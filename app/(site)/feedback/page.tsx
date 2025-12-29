// app/(site)/feedback/page.tsx - Leave Feedback Page
'use client';
import { useState } from 'react';
import ContentLayout from '@/components/ContentLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, CheckCircle2, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function FeedbackPage() {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <ContentLayout
        title="Thank You for Your Feedback"
        description="Your feedback has been successfully submitted."
      >
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="bg-gray-900/50 rounded-lg p-8">
            <CheckCircle2 className="h-16 w-16 text-[#3c83f6] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Feedback Received
            </h2>
            <p className="text-base md:text-lg text-gray-300 mb-6">
              Thank you for taking the time to share your feedback. We value your input and will use it to improve our products and services.
            </p>
            <a href="/">
              <Button className="bg-[#3c83f6] hover:bg-[#2563eb] text-white">
                Return to Home
              </Button>
            </a>
          </div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="Leave Feedback"
      description="We value your opinion. Share your thoughts, suggestions, or concerns with us."
    >
      <div className="space-y-8 md:space-y-12">
        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Overall Rating */}
          <section className="space-y-4">
            <Label className="text-white text-lg font-semibold">
              Overall Rating *
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-gray-400 text-sm">
                {rating === 5 && 'Excellent!'}
                {rating === 4 && 'Great!'}
                {rating === 3 && 'Good'}
                {rating === 2 && 'Fair'}
                {rating === 1 && 'Poor'}
              </p>
            )}
          </section>

          {/* Feedback Type */}
          <section className="space-y-4">
            <Label htmlFor="feedbackType" className="text-white text-lg font-semibold">
              Feedback Type *
            </Label>
            <Select value={feedbackType} onValueChange={setFeedbackType} required>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-[#3c83f6]">
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="product" className="text-white focus:bg-gray-700">
                  Product Feedback
                </SelectItem>
                <SelectItem value="service" className="text-white focus:bg-gray-700">
                  Customer Service
                </SelectItem>
                <SelectItem value="website" className="text-white focus:bg-gray-700">
                  Website Experience
                </SelectItem>
                <SelectItem value="shipping" className="text-white focus:bg-gray-700">
                  Shipping & Delivery
                </SelectItem>
                <SelectItem value="suggestion" className="text-white focus:bg-gray-700">
                  Suggestion
                </SelectItem>
                <SelectItem value="complaint" className="text-white focus:bg-gray-700">
                  Complaint
                </SelectItem>
                <SelectItem value="other" className="text-white focus:bg-gray-700">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </section>

          {/* Subject */}
          <section className="space-y-4">
            <Label htmlFor="subject" className="text-white text-lg font-semibold">
              Subject *
            </Label>
            <Input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of your feedback"
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3c83f6]"
            />
          </section>

          {/* Message */}
          <section className="space-y-4">
            <Label htmlFor="message" className="text-white text-lg font-semibold">
              Your Feedback *
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please share your thoughts, suggestions, or concerns in detail..."
              rows={8}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3c83f6]"
            />
            <p className="text-gray-400 text-sm">
              {message.length} characters
            </p>
          </section>

          {/* Contact Information (if not logged in) */}
          {!user && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3c83f6]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3c83f6]"
                />
              </div>
            </section>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={!rating || !feedbackType || !subject || !message || isSubmitting}
              className="bg-[#3c83f6] hover:bg-[#2563eb] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <MessageSquare className="mr-2 h-4 w-4 animate-pulse" />
                  Submitting...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Information Section */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Your Feedback Matters</h2>
          <p className="text-base md:text-lg text-gray-300 mb-4">
            We're committed to providing the best possible experience. Your feedback helps us:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
            <li>Improve our products and services</li>
            <li>Enhance customer experience</li>
            <li>Address concerns and issues promptly</li>
            <li>Develop new features based on your needs</li>
          </ul>
        </section>
      </div>
    </ContentLayout>
  );
}

