import { api } from '../client';

export type TicketStatus = 'new' | 'open' | 'pending_customer' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TicketChannel = 'portal' | 'email' | 'ai' | 'system';

export interface CursorPaginatedResponse<T> {
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface Ticket {
    id: string;
    subject: string;
    description?: string | null;
    status: TicketStatus;
    priority: TicketPriority;
    channel: TicketChannel;
    category?: string | null;
    order?: string | null;
    sla_due_at?: string | null;
    last_message_at?: string | null;
    unread_by_agent?: number;
    unread_by_customer?: number;
    ai_summary?: string | null;
    ai_confidence_score?: number | null;
    ai_first_response_time?: string | null;
    ai_auto_resolved?: boolean;
    created_at: string;
    updated_at: string;
    closed_at?: string | null;
    assigned_to?: string | null;
    watchers?: string[];
    contact?: string | null;
    user?: string | null;
}

export interface TicketFilters {
    status?: TicketStatus;
    priority?: TicketPriority;
    channel?: TicketChannel;
    ordering?: string;
    search?: string;
    sla_overdue?: boolean;
    created_at_after?: string;
    created_at_before?: string;
    last_message_at_after?: string;
    last_message_at_before?: string;
    cursor?: string | null;
}

export interface CreateTicketPayload {
    subject: string;
    description?: string;
    initial_message?: string;
    order?: string;
    channel?: TicketChannel;
}

export interface TicketMessage {
    id: string;
    ticket: string;
    body: string;
    direction: 'inbound' | 'outbound';
    is_internal?: boolean;
    author_user?: string | null;
    author_contact?: string | null;
    created_at: string;
    attachments?: TicketAttachment[];
}

export interface TicketAttachment {
    id: string;
    original_name: string;
    file: string;
    uploaded_at: string;
}

export interface TicketEvent {
    id: string;
    ticket: string;
    event_type: 'status_change' | 'assignment_change' | 'message' | 'reopen' | 'close' | 'note';
    from_status?: TicketStatus | null;
    to_status?: TicketStatus | null;
    metadata?: Record<string, any>;
    created_at: string;
    created_by?: string | null;
}

export interface MessageCreatePayload {
    ticket: string;
    body: string;
    files?: File[];
}

const SUPPORT_BASE = '/support';

export const buildMessageFormData = (payload: MessageCreatePayload): FormData => {
    const formData = new FormData();
    formData.append('ticket', payload.ticket);
    formData.append('body', payload.body);

    if (payload.files && payload.files.length > 0) {
        payload.files.forEach((file) => {
            formData.append('files', file);
        });
    }

    return formData;
};

export const supportApi = {
    getTickets: (filters?: TicketFilters) =>
        api.get<CursorPaginatedResponse<Ticket>>(`${SUPPORT_BASE}/tickets/`, {
            params: {
                ...filters,
                cursor: filters?.cursor || undefined,
            },
        }),

    createTicket: (data: CreateTicketPayload) =>
        api.post<Ticket>(`${SUPPORT_BASE}/tickets/`, data),

    getTicket: (id: string) =>
        api.get<Ticket>(`${SUPPORT_BASE}/tickets/${id}/`),

    markTicketRead: (id: string) =>
        api.post(`${SUPPORT_BASE}/tickets/${id}/mark-read/`),

    getMessages: (params: { ticket: string; cursor?: string | null }) =>
        api.get<CursorPaginatedResponse<TicketMessage>>(`${SUPPORT_BASE}/messages/`, {
            params: {
                ticket: params.ticket,
                cursor: params.cursor || undefined,
            },
        }),

    createMessage: (payload: MessageCreatePayload) =>
        api.post<TicketMessage>(`${SUPPORT_BASE}/messages/`, buildMessageFormData(payload), {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    getEvents: (params: { ticket: string }) =>
        api.get<CursorPaginatedResponse<TicketEvent>>(`${SUPPORT_BASE}/events/`, {
            params,
        }),
};
