'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, File, Loader2, MessageSquare, Paperclip, Send, User } from 'lucide-react';
import { useTicket, useTicketEvents, useTicketMessages, useCreateMessage, useMarkTicketRead } from '@/hooks/useSupport';
import { mergeCursorPages } from '@/lib/utils/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params?.id as string;
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { data: ticket, isLoading, isError, refetch } = useTicket(ticketId);
  const messagesQuery = useTicketMessages(ticketId);
  const eventsQuery = useTicketEvents(ticketId, true);
  const createMessage = useCreateMessage(ticketId);
  const markRead = useMarkTicketRead(ticketId);

  const markReadOnceRef = useRef(false);

  useEffect(() => {
    if (!ticketId || markReadOnceRef.current) return;
    markReadOnceRef.current = true;
    markRead.mutate();
  }, [ticketId, markRead.mutate]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesQuery.data]);

  const mergedMessages = useMemo(
    () => (messagesQuery.data ? mergeCursorPages(messagesQuery.data.pages) : { items: [], nextCursor: null, previousCursor: null }),
    [messagesQuery.data]
  );

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setFiles(selected);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        title: 'Message required',
        description: 'Add some text before sending.',
        variant: 'destructive',
      });
      return;
    }

    await createMessage.mutateAsync({
      ticket: ticketId,
      body: message.trim(),
      files,
    });

    setMessage('');
    setFiles([]);
    messagesQuery.refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-gray-400">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h1 className="text-2xl font-bold mb-2 text-white">Ticket unavailable</h1>
          <p className="text-gray-400 mb-6">We could not load this ticket. Please try again.</p>
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
        <div className="mobile-container tablet-container desktop-container py-8 md:py-12 flex items-center gap-4 flex-wrap">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white break-words">{ticket.subject}</h1>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <Badge className={`${statusBadgeClass(ticket.status)} border`}>{ticket.status.replace('_', ' ')}</Badge>
              {ticket.priority && <Badge className={`${priorityBadgeClass(ticket.priority)} border`}>{ticket.priority}</Badge>}
              {ticket.channel && (
                <Badge variant="outline" className="text-gray-300 border-gray-700 bg-gray-800/60">
                  {ticket.channel}
                </Badge>
              )}
            </div>
          </div>
          <Button asChild className="bg-white text-black hover:bg-gray-200">
            <Link href="/support">Back to tickets</Link>
          </Button>
        </div>
      </div>

      <div className="mobile-container tablet-container desktop-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Conversation</CardTitle>
                <div className="text-xs text-gray-500">
                  Updated {ticket.last_message_at ? new Date(ticket.last_message_at).toLocaleString() : '—'}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mergedMessages.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                      <MessageSquare className="h-8 w-8 mb-3 text-gray-500" />
                      No messages yet. Start the conversation below.
                    </div>
                  ) : (
                    mergedMessages.items.map((msg) => (
                      <div
                        key={msg.id}
                        className="flex gap-3"
                      >
                        <div className="h-10 w-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-300" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <p className="font-semibold text-white capitalize">{msg.direction === 'inbound' ? 'You' : 'Support'}</p>
                            <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</span>
                            {msg.direction === 'outbound' && (
                              <Badge
                                variant="outline"
                                className="text-xs border-[#00bfff]/50 bg-[#00bfff]/10 text-[#00d0ff]"
                              >
                                From support
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-200 whitespace-pre-line">{msg.body}</p>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {msg.attachments.map((file) => (
                                <a
                                  key={file.id}
                                  href={file.file}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-[#00bfff] hover:text-white bg-gray-800/60 border border-gray-700 rounded px-3 py-1"
                                >
                                  <File className="h-4 w-4" />
                                  {file.original_name}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {messagesQuery.hasNextPage && (
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        className="border-gray-700 text-gray-200"
                        onClick={() => messagesQuery.fetchNextPage()}
                        disabled={messagesQuery.isFetchingNextPage}
                      >
                        {messagesQuery.isFetchingNextPage ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Loading more
                          </>
                        ) : (
                          'Load older messages'
                        )}
                      </Button>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Reply</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSend}>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your reply"
                    rows={4}
                    className="bg-gray-950 border-gray-800 text-white placeholder:text-gray-500"
                  />

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                      <Paperclip className="h-4 w-4" />
                      <span>Attach files</span>
                      <Input
                        type="file"
                        multiple
                        onChange={handleFilesChange}
                        className="hidden"
                      />
                    </label>
                    {files.length > 0 && (
                      <div className="text-xs text-gray-400">
                        {files.length} file{files.length > 1 ? 's' : ''} selected
                      </div>
                    )}
                  </div>

                  {createMessage.isError && (
                    <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-md p-3">
                      <AlertCircle className="h-4 w-4" />
                      <span>Message failed to send. Please try again.</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={createMessage.isPending}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      {createMessage.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Sending
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send message
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-700 text-gray-300"
                      onClick={() => {
                        setMessage('');
                        setFiles([]);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Ticket details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span>{new Date(ticket.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last activity</span>
                  <span>{ticket.last_message_at ? new Date(ticket.last_message_at).toLocaleString() : '—'}</span>
                </div>
                {ticket.order && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order</span>
                    <span className="text-white font-medium">{ticket.order}</span>
                  </div>
                )}
                {ticket.description && (
                  <div className="pt-2 border-t border-gray-800">
                    <p className="text-gray-400 mb-1">Description</p>
                    <p className="text-white whitespace-pre-line">{ticket.description}</p>
                  </div>
                )}
                {(ticket.ai_summary || ticket.ai_confidence_score) && (
                  <div className="pt-2 border-t border-gray-800 space-y-1">
                    <p className="text-gray-400 mb-1">AI summary</p>
                    <p className="text-white whitespace-pre-line">{ticket.ai_summary || '—'}</p>
                    {typeof ticket.ai_confidence_score === 'number' && (
                      <p className="text-xs text-gray-500">Confidence: {(ticket.ai_confidence_score * 100).toFixed(0)}%</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {eventsQuery.isLoading && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading timeline...
                  </div>
                )}
                {eventsQuery.data?.results?.length ? (
                  <div className="space-y-3">
                    {eventsQuery.data.results.map((event) => (
                      <div key={event.id} className="flex gap-3 text-sm">
                        <div className="h-10 w-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-gray-300" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-white font-medium capitalize">{event.event_type.replace('_', ' ')}</p>
                            <span className="text-xs text-gray-500">{new Date(event.created_at).toLocaleString()}</span>
                          </div>
                          {event.from_status || event.to_status ? (
                            <p className="text-xs text-gray-400">
                              Status: {event.from_status || '—'} → {event.to_status || '—'}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No timeline events yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
