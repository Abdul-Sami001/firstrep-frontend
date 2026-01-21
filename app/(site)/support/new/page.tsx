'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateTicket } from '@/hooks/useSupport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function NewSupportTicketPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const createTicket = useCreateTicket();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [order, setOrder] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'Please log in to create a support ticket.',
        variant: 'destructive',
      });
      router.push('/CustomerLogin');
    }
  }, [isAuthenticated, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast({
        title: 'Subject required',
        description: 'Please provide a brief subject for your ticket.',
        variant: 'destructive',
      });
      return;
    }

    await createTicket.mutateAsync({
      subject: subject.trim(),
      description: description.trim() || undefined,
      initial_message: initialMessage.trim() || undefined,
      order: order.trim() || undefined,
      channel: 'portal',
    });

    router.push('/support');
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="border-b border-gray-800 bg-[#000000]">
        <div className="mobile-container tablet-container desktop-container py-8 md:py-12 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Create Support Ticket</h1>
            <p className="text-gray-400 text-sm md:text-base">
              Tell us what you need help with. Our team will respond soon.
            </p>
          </div>
        </div>
      </div>

      <div className="mobile-container tablet-container desktop-container py-8">
        <Card className="bg-gray-900 border-gray-800 max-w-3xl">
          <CardHeader>
            <CardTitle className="text-white">Ticket details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Subject *</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your issue"
                  required
                  className="bg-gray-950 border-gray-800 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share details that can help us resolve this quickly."
                  rows={4}
                  className="bg-gray-950 border-gray-800 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Initial message</label>
                <Textarea
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Add the first message to start the conversation."
                  rows={3}
                  className="bg-gray-950 border-gray-800 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Related order (optional)</label>
                <Input
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  placeholder="Order ID"
                  className="bg-gray-950 border-gray-800 text-white placeholder:text-gray-500"
                />
              </div>

              {createTicket.isError && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-md p-3">
                  <AlertCircle className="h-4 w-4" />
                  <span>Something went wrong. Please try again.</span>
                </div>
              )}

              {createTicket.isSuccess && (
                <div className="flex items-center gap-2 text-sm text-emerald-300 bg-emerald-900/20 border border-emerald-900/50 rounded-md p-3">
                  <CheckCircle className="h-4 w-4" />
                  <span>Ticket created! Redirecting you to your tickets.</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={createTicket.isPending}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  {createTicket.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit ticket
                    </>
                  )}
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-200" asChild>
                  <Link href="/support">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
