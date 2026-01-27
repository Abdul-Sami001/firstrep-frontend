// app/(site)/store-locator/page.tsx - Store Locator Page
'use client';
import { useState } from 'react';
import ContentLayout from '@/components/ContentLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Phone, Mail, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Mock store data - in production, this would come from an API
const stores = [
  {
    id: '1',
    name: '1stRep London Flagship',
    address: '123 Oxford Street, London, W1D 2HX',
    phone: '+44 20 1234 5678',
    email: 'london@1strep.com',
    hours: 'Mon-Sat: 9 AM - 8 PM, Sun: 11 AM - 6 PM',
    coordinates: { lat: 51.5155, lng: -0.1419 },
  },
  {
    id: '2',
    name: '1stRep Manchester',
    address: '456 King Street, Manchester, M2 4LQ',
    phone: '+44 161 1234 5678',
    email: 'manchester@1strep.com',
    hours: 'Mon-Sat: 9 AM - 7 PM, Sun: 11 AM - 5 PM',
    coordinates: { lat: 53.4808, lng: -2.2426 },
  },
  {
    id: '3',
    name: '1stRep Birmingham',
    address: '789 Bull Street, Birmingham, B4 6AD',
    phone: '+44 121 1234 5678',
    email: 'birmingham@1strep.com',
    hours: 'Mon-Sat: 9 AM - 7 PM, Sun: 11 AM - 5 PM',
    coordinates: { lat: 52.4862, lng: -1.8904 },
  },
];

export default function StoreLocatorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [isLoading] = useState(false);

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ContentLayout
      title="Store Locator"
      description="Find a 1stRep store near you or shop online with free shipping on orders over £50."
      maxWidth="4xl"
    >
      <div className="space-y-8 md:space-y-12">
        {/* Search Section */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by city, postcode, or store name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3c83f6]"
              />
            </div>
            <Button
              onClick={() => {
                // In production, this would use browser geolocation
                alert('Location services would be enabled here');
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white hover:text-black"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Use My Location
            </Button>
          </div>
        </section>

        {/* Map and List View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Section */}
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 h-[500px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <MapPin className="h-16 w-16 text-gray-600 mx-auto" />
              <p className="text-gray-400">
                Interactive map would be integrated here
              </p>
              <p className="text-gray-500 text-sm">
                (Google Maps or Mapbox integration)
              </p>
            </div>
          </div>

          {/* Store List */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {filteredStores.length} Store{filteredStores.length !== 1 ? 's' : ''} Found
            </h2>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 bg-gray-800" />
                ))}
              </div>
            ) : filteredStores.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-hide">
                {filteredStores.map((store) => (
                  <div
                    key={store.id}
                    className={`bg-gray-900/50 rounded-lg p-6 border transition-colors cursor-pointer ${
                      selectedStore === store.id
                        ? 'border-[#3c83f6]'
                        : 'border-gray-800 hover:border-gray-700'
                    }`}
                    onClick={() => setSelectedStore(store.id)}
                  >
                    <h3 className="text-xl font-bold text-white mb-3">{store.name}</h3>
                    <div className="space-y-2 text-gray-300 text-sm md:text-base">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-[#3c83f6] mt-1 flex-shrink-0" />
                        <span>{store.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#3c83f6] flex-shrink-0" />
                        <a href={`tel:${store.phone}`} className="hover:text-white transition-colors">
                          {store.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#3c83f6] flex-shrink-0" />
                        <a href={`mailto:${store.email}`} className="hover:text-white transition-colors">
                          {store.email}
                        </a>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-[#3c83f6] mt-1 flex-shrink-0" />
                        <span>{store.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-lg p-8 text-center">
                <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No stores found matching your search.</p>
                <p className="text-gray-500 text-sm mt-2">
                  Try a different location or{' '}
                  <a href="/shop-clean" className="text-[#3c83f6] hover:text-white underline">
                    shop online
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Online Shopping CTA */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Can't Visit a Store?</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Shop online with free shipping on orders over £50. Same premium quality, delivered to your door.
          </p>
          <a href="/shop-clean">
            <Button className="bg-[#3c83f6] hover:bg-[#2563eb] text-white">
              Shop Online
            </Button>
          </a>
        </section>
      </div>
    </ContentLayout>
  );
}

