// app/(site)/events/page.tsx - Events Page
'use client';
import { useState } from 'react';
import ContentLayout from '@/components/ContentLayout';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';

// Mock events data - in production, this would come from an API
const events = [
  {
    id: '1',
    title: 'London Marathon Expo',
    date: '2025-04-20',
    time: '10:00 AM - 6:00 PM',
    location: 'ExCeL London, Royal Victoria Dock, London E16 1XL',
    description: 'Visit our booth at the London Marathon Expo. Try on our latest collection and meet our team.',
    image: null,
    attendees: 500,
    type: 'Expo',
  },
  {
    id: '2',
    title: '1stRep Community Run',
    date: '2025-05-15',
    time: '8:00 AM',
    location: 'Hyde Park, London',
    description: 'Join us for a community 5K run followed by refreshments and product demos.',
    image: null,
    attendees: 200,
    type: 'Community',
  },
  {
    id: '3',
    title: 'Fitness Festival Manchester',
    date: '2025-06-10',
    time: '9:00 AM - 5:00 PM',
    location: 'Manchester Central, M2 3GX',
    description: 'Experience our full product range and attend exclusive training sessions with our athletes.',
    image: null,
    attendees: 1000,
    type: 'Festival',
  },
];

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading] = useState(false);

  const eventTypes = ['all', ...Array.from(new Set(events.map(event => event.type)))];
  const filteredEvents = selectedType === 'all'
    ? events
    : events.filter(event => event.type === selectedType);

  return (
    <ContentLayout
      title="Events"
      description="Join us at upcoming events, expos, and community gatherings. Meet the team, try our products, and connect with fellow athletes."
      maxWidth="4xl"
    >
      <div className="space-y-12 md:space-y-16">
        {/* Filter */}
        <section className="flex gap-2 overflow-x-auto pb-2">
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedType === type
                  ? 'bg-[#3c83f6] text-white'
                  : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </section>

        {/* Events List */}
        <section className="space-y-6">
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 bg-gray-800" />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="space-y-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 hover:border-[#3c83f6] transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative aspect-video md:aspect-square bg-gray-800">
                      {event.image ? (
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2 p-6 space-y-4">
                      <div>
                        <span className="inline-block bg-[#3c83f6]/20 text-[#3c83f6] px-3 py-1 rounded text-sm font-semibold mb-3">
                          {event.type}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                          {event.title}
                        </h3>
                        <p className="text-gray-300 text-base leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                      <div className="space-y-2 text-gray-300 text-sm md:text-base">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#3c83f6] flex-shrink-0" />
                          <span>{new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#3c83f6] flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-[#3c83f6] mt-1 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#3c83f6] flex-shrink-0" />
                          <span>{event.attendees}+ expected attendees</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900/50 rounded-lg p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No events scheduled in this category.</p>
              <p className="text-gray-500 text-sm mt-2">
                Check back soon or{' '}
                <a href="/contact-support" className="text-[#3c83f6] hover:text-white underline">
                  contact us
                </a>{' '}
                to suggest an event.
              </p>
            </div>
          )}
        </section>

        {/* Host an Event */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Host an Event</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Interested in hosting a 1stRep event or having us at your fitness facility? 
            Get in touch with our events team.
          </p>
          <a href="mailto:events@1strep.com">
            <Button className="bg-[#3c83f6] hover:bg-[#2563eb] text-white">
              Contact Events Team
            </Button>
          </a>
        </section>
      </div>
    </ContentLayout>
  );
}

