'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { MessageSquare, Plus, Loader2, AlertCircle, Filter, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSupportTickets } from '@/hooks/useSupport';
import { TicketStatus, TicketPriority, TicketChannel } from '@/lib/api/support';
import { mergeCursorPages } from '@/lib/utils/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'open', label: 'Open' },
  { value: 'pending_customer', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const priorityOptions = [
  { value: 'all', label: 'All' },
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const channelOptions = [
  { value: 'all', label: 'All' },
  { value: 'portal', label: 'Portal' },
  { value: 'email', label: 'Email' },
  { value: 'ai', label: 'AI' },
  { value: 'system', label: 'System' },
];

const orderingOptions = [
  { value: '-last_message_at', label: 'Most recent activity' },
  { value: '-created_at', label: 'Newest tickets' },
  { value: 'created_at', label: 'Oldest tickets' },
];

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'new':
      return 'bg-blue-900/40 text-blue-200 border-blue-700';
    case 'open':
      return 'bg-emerald-900/40 text-emerald-200 border-emerald-700';
    case 'pending_customer':
      return 'bg-amber-900/40 text-amber-200 border-amber-700';
    case 'resolved':
      return 'bg-teal-900/40 text-teal-200 border-teal-700';
    case 'closed':
      return 'bg-gray-800 text-gray-200 border-gray-700';
    default:
      return 'bg-gray-800 text-gray-200 border-gray-700';
  }
};

const priorityBadgeClass = (priority?: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-900/40 text-red-200 border-red-700';
    case 'high':
      return 'bg-orange-900/40 text-orange-200 border-orange-700';
    case 'normal':
      return 'bg-sky-900/40 text-sky-200 border-sky-700';
    case 'low':
      return 'bg-gray-800 text-gray-200 border-gray-700';
    default:
      return 'bg-gray-800 text-gray-200 border-gray-700';
  }
};

export default function SupportTicketsPage() {
  const [status, setStatus] = useState<string>('all');
  const [priority, setPriority] = useState<string>('all');
  const [channel, setChannel] = useState<string>('all');
  const [ordering, setOrdering] = useState<string>('-last_message_at');
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 300);

  const filters = useMemo(
    () => ({
      status: status === 'all' ? undefined : status as TicketStatus,
      priority: priority === 'all' ? undefined : priority as TicketPriority,
      channel: channel === 'all' ? undefined : channel as TicketChannel,
      ordering,
      search: debouncedSearch || undefined,
    }),
    [status, priority, channel, ordering, debouncedSearch]
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useSupportTickets(filters);

  const merged = data ? mergeCursorPages(data.pages) : { items: [], nextCursor: null, previousCursor: null };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-gray-400">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h1 className="text-2xl font-bold mb-2 text-white">Unable to load support</h1>
          <p className="text-gray-400 mb-6">Please refresh or try again later.</p>
          <Button onClick={() => refetch()} className="bg-white text-black hover:bg-gray-200">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="border-b border-gray-800 bg-[#000000]">
        <div className="mobile-container tablet-container desktop-container py-8 md:py-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Support</h1>
            <p className="text-sm md:text-base text-gray-400">
              View your tickets, track responses, and keep conversations going.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="bg-white text-black hover:bg-gray-200">
              <Link href="/support/new">
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mobile-container tablet-container desktop-container py-6 space-y-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-gray-950 border-gray-800 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-white">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Priority</label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="bg-gray-950 border-gray-800 text-white">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    {priorityOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-white">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Channel</label>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger className="bg-gray-950 border-gray-800 text-white">
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    {channelOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-white">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Ordering</label>
                <Select value={ordering} onValueChange={setOrdering}>
                  <SelectTrigger className="bg-gray-950 border-gray-800 text-white">
                    <SelectValue placeholder="Ordering" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    {orderingOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-white">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Search</label>
              <div className="relative">
                <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search subject, description, or email"
                  className="pl-9 bg-gray-950 border-gray-800 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {merged.items.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="py-10 text-center space-y-3">
                <MessageSquare className="h-10 w-10 mx-auto text-gray-600" />
                <h2 className="text-xl font-semibold text-white">No tickets yet</h2>
                <p className="text-gray-400">Create a ticket to reach our support team.</p>
                <Button asChild className="bg-white text-black hover:bg-gray-200">
                  <Link href="/support/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create ticket
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {merged.items.map((ticket) => (
                <Link key={ticket.id} href={`/support/${ticket.id}`}>
                  <Card className="bg-gray-900 border-gray-800 hover:border-[#00bfff]/50 transition-colors">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-semibold text-white line-clamp-1">{ticket.subject}</h3>
                            <Badge className={`${statusBadgeClass(ticket.status)} border`}>
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                            {ticket.priority && (
                              <Badge className={`${priorityBadgeClass(ticket.priority)} border`}>
                                {ticket.priority}
                              </Badge>
                            )}
                            {ticket.channel && (
                              <Badge variant="outline" className="text-gray-300 border-gray-700 bg-gray-800/60">
                                {ticket.channel}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {ticket.description || 'No description provided.'}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                            <span>Updated {ticket.last_message_at ? new Date(ticket.last_message_at).toLocaleString() : '—'}</span>
                            <span>Created {new Date(ticket.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                        {ticket.unread_by_customer ? (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#00bfff]/20 border border-[#00bfff]/40 text-[#00bfff] text-sm font-semibold">
                            {ticket.unread_by_customer}
                          </div>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {hasNextPage && (
                <div className="flex justify-center pt-2">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="bg-gray-900 border border-gray-800 text-white hover:bg-gray-800"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading more
                      </>
                    ) : (
                      'Load more'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
