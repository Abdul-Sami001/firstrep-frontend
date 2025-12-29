// app/(site)/blog/page.tsx - Blog Page
'use client';
import { useState } from 'react';
import ContentLayout from '@/components/ContentLayout';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';

// Mock blog posts - in production, this would come from an API
const blogPosts = [
  {
    id: '1',
    title: 'The Science Behind Performance Apparel',
    excerpt: 'Understanding how advanced materials and design enhance athletic performance and recovery.',
    author: 'Dr. Sarah Johnson',
    date: '2025-01-15',
    image: '/attached_assets/placeholder.jpg',
    category: 'Science',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Training Tips from Elite Athletes',
    excerpt: 'Learn from the best as we share training routines and insights from our sponsored athletes.',
    author: 'Mike Thompson',
    date: '2025-01-10',
    image: '/attached_assets/placeholder.jpg',
    category: 'Training',
    readTime: '7 min read',
  },
  {
    id: '3',
    title: 'Sustainable Fashion in Athletics',
    excerpt: 'How 1stRep is leading the way in sustainable performance apparel and what it means for the future.',
    author: 'Emma Wilson',
    date: '2025-01-05',
    image: '/attached_assets/placeholder.jpg',
    category: 'Sustainability',
    readTime: '6 min read',
  },
  {
    id: '4',
    title: 'Nutrition for Peak Performance',
    excerpt: 'Fuel your workouts with the right nutrition strategies for optimal performance and recovery.',
    author: 'Dr. James Miller',
    date: '2024-12-28',
    image: '/attached_assets/placeholder.jpg',
    category: 'Nutrition',
    readTime: '8 min read',
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading] = useState(false);

  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category)))];
  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <ContentLayout
      title="Blog"
      description="Expert insights, training tips, and stories from the world of performance apparel and athletics."
      maxWidth="4xl"
    >
      <div className="space-y-12 md:space-y-16">
        {/* Category Filter */}
        <section className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-[#3c83f6] text-white'
                  : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </section>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Featured</h2>
            <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 hover:border-[#3c83f6] transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative aspect-video bg-gray-800">
                  <Image
                    src={filteredPosts[0].image}
                    alt={filteredPosts[0].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[#3c83f6]" />
                    <span className="text-[#3c83f6] text-sm font-semibold">{filteredPosts[0].category}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {filteredPosts[0].title}
                  </h3>
                  <p className="text-gray-300 text-base leading-relaxed">
                    {filteredPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {filteredPosts[0].author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(filteredPosts[0].date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <span>{filteredPosts[0].readTime}</span>
                  </div>
                  <Link href={`/blog/${filteredPosts[0].id}`}>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white hover:text-black transition-colors w-full md:w-auto"
                    >
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Latest Articles</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 bg-gray-800" />
              ))}
            </div>
          ) : filteredPosts.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.slice(1).map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 hover:border-[#3c83f6] transition-colors h-full flex flex-col">
                    <div className="relative aspect-video bg-gray-800">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col space-y-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-[#3c83f6]" />
                        <span className="text-[#3c83f6] text-sm font-semibold">{post.category}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-gray-400 text-xs">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                        </div>
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center text-[#3c83f6] text-sm font-semibold group">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900/50 rounded-lg p-8 text-center">
              <Tag className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No articles found in this category.</p>
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest articles, training tips, and exclusive content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 rounded-md focus:outline-none focus:border-[#3c83f6]"
            />
            <Button className="bg-[#3c83f6] hover:bg-[#2563eb] text-white whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}

