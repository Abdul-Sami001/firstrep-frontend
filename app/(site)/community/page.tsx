// app/(site)/community/page.tsx - Community Page
'use client';
import ContentLayout from '@/components/ContentLayout';
import { Button } from '@/components/ui/button';
import { Users, Instagram, MessageCircle, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CommunityPage() {
  // Mock community posts - in production, this would come from an API
  const communityPosts = [
    {
      id: '1',
      user: '@athlete_jane',
      image: null,
      caption: 'Just completed my first marathon in @1strep gear! The performance was incredible. #1stRep #Marathon',
      likes: 124,
      comments: 23,
    },
    {
      id: '2',
      user: '@fitness_pro',
      image: null,
      caption: 'Training session in the new 1stRep collection. Quality that matches the intensity! 💪',
      likes: 89,
      comments: 15,
    },
    {
      id: '3',
      user: '@runner_mike',
      image: null,
      caption: 'Love the breathability of these leggings. Perfect for long runs!',
      likes: 67,
      comments: 8,
    },
  ];

  return (
    <ContentLayout
      title="1stRep Community"
      description="Join thousands of athletes sharing their journey, achievements, and love for performance apparel."
      maxWidth="4xl"
    >
      <div className="space-y-12 md:space-y-16">
        {/* Community Introduction */}
        <section className="space-y-6">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            The 1stRep Community is a space for athletes, fitness enthusiasts, and performance-focused 
            individuals to connect, share experiences, and inspire each other. Join us in celebrating 
            every rep, every milestone, and every achievement.
          </p>
        </section>

        {/* Social Media Links */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Connect With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="https://www.instagram.com/1strep_/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-[#3c83f6] transition-colors text-center"
            >
              <Instagram className="h-8 w-8 text-[#3c83f6] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Instagram</h3>
              <p className="text-gray-400 text-sm">@1strep_</p>
            </a>
            <a
              href="https://facebook.com/1strep"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-[#3c83f6] transition-colors text-center"
            >
              <MessageCircle className="h-8 w-8 text-[#3c83f6] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Facebook</h3>
              <p className="text-gray-400 text-sm">1stRep Official</p>
            </a>
            <a
              href="https://twitter.com/1strep"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-[#3c83f6] transition-colors text-center"
            >
              <Share2 className="h-8 w-8 text-[#3c83f6] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Twitter</h3>
              <p className="text-gray-400 text-sm">@1strep</p>
            </a>
            <a
              href="https://youtube.com/1strep"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-[#3c83f6] transition-colors text-center"
            >
              <Users className="h-8 w-8 text-[#3c83f6] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">YouTube</h3>
              <p className="text-gray-400 text-sm">1stRep Channel</p>
            </a>
          </div>
        </section>

        {/* Community Highlights */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Community Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityPosts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800"
              >
                <div className="relative aspect-square bg-gray-800">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.caption}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{post.user}</span>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2">{post.caption}</p>
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Join Community CTA */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Share Your Journey</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Tag us @1strep_ on Instagram or use #1stRep to be featured in our community highlights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.instagram.com/1strep_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[#3c83f6] hover:bg-[#2563eb] text-white">
                <Instagram className="mr-2 h-4 w-4" />
                Follow on Instagram
              </Button>
            </a>
            <Link href="/athletes">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white hover:text-black transition-colors"
              >
                Join Athlete Program
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}

