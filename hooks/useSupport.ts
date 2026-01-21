import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supportApi, TicketFilters, CreateTicketPayload, MessageCreatePayload, Ticket } from '@/lib/api/support';
import { QUERY_KEYS } from '@/lib/utils/constants';
import { extractCursor } from '@/lib/utils/pagination';
import { useToast } from './use-toast';

const DEFAULT_STALE_TIME = 5 * 60 * 1000;
const DEFAULT_CACHE_TIME = 10 * 60 * 1000;

export const useSupportTickets = (filters?: TicketFilters) =>
    useInfiniteQuery({
        queryKey: QUERY_KEYS.SUPPORT.TICKETS(filters),
        queryFn: ({ pageParam = null }) =>
            supportApi.getTickets({ ...filters, cursor: pageParam }),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => extractCursor(lastPage?.next),
        getPreviousPageParam: (lastPage) => extractCursor(lastPage?.previous),
        staleTime: DEFAULT_STALE_TIME,
        gcTime: DEFAULT_CACHE_TIME,
        retry: 2,
    });

export const useTicket = (id: string) =>
    useQuery({
        queryKey: QUERY_KEYS.SUPPORT.TICKET(id),
        queryFn: () => supportApi.getTicket(id),
        enabled: !!id,
        staleTime: DEFAULT_STALE_TIME,
        gcTime: DEFAULT_CACHE_TIME,
        retry: 2,
    });

export const useTicketMessages = (ticketId: string) =>
    useInfiniteQuery({
        queryKey: QUERY_KEYS.SUPPORT.MESSAGES(ticketId),
        queryFn: ({ pageParam = null }) =>
            supportApi.getMessages({ ticket: ticketId, cursor: pageParam }),
        enabled: !!ticketId,
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => extractCursor(lastPage?.next),
        getPreviousPageParam: (lastPage) => extractCursor(lastPage?.previous),
        staleTime: DEFAULT_STALE_TIME,
        gcTime: DEFAULT_CACHE_TIME,
        retry: 2,
    });

export const useTicketEvents = (ticketId: string, enabled = false) =>
    useQuery({
        queryKey: QUERY_KEYS.SUPPORT.EVENTS(ticketId),
        queryFn: () => supportApi.getEvents({ ticket: ticketId }),
        enabled: enabled && !!ticketId,
        staleTime: DEFAULT_STALE_TIME,
        gcTime: DEFAULT_CACHE_TIME,
        retry: 1,
    });

export const useCreateTicket = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (payload: CreateTicketPayload) => supportApi.createTicket(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUPPORT.TICKETS() });
            toast({
                title: 'Ticket created',
                description: 'We have received your request and will respond soon.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Unable to create ticket',
                description: error?.response?.data?.detail || 'Please try again.',
                variant: 'destructive',
            });
        },
    });
};

export const useCreateMessage = (ticketId: string) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (payload: MessageCreatePayload) => supportApi.createMessage(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUPPORT.MESSAGES(ticketId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUPPORT.TICKET(ticketId) });
        },
        onError: (error: any) => {
            toast({
                title: 'Message not sent',
                description: error?.response?.data?.detail || 'Please try again.',
                variant: 'destructive',
            });
        },
    });
};

export const useMarkTicketRead = (ticketId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => supportApi.markTicketRead(ticketId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUPPORT.TICKET(ticketId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUPPORT.TICKETS() });
        },
    });
};

export const flattenTickets = (pages?: { results: Ticket[] }[]) =>
    pages?.flatMap((page) => page?.results || []) || [];
