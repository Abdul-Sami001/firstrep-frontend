// app/(site)/storefront/[slug]/page.tsx - Public Storefront Page
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Store, Loader2, AlertCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { usePublicStorefront, usePublicStorefrontProducts } from '@/hooks/useStorefronts';
import { setStorefrontId } from '@/lib/utils/storefront';
import ProductCard from '@/components/ProductCard';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function StorefrontPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { data: storefront, isLoading: loadingStorefront, error: storefrontError } = usePublicStorefront(slug);
  const { data: productsData, isLoading: loadingProducts, error: productsError } = usePublicStorefrontProducts(slug, {
    page_size: 50,
    ordering: 'position',
  });

  const products = productsData?.results || [];
  const isLoading = loadingStorefront || loadingProducts;
  const error = storefrontError || productsError;

  // Store storefront_id in session when storefront loads
  useEffect(() => {
    if (storefront?.slug && typeof window !== 'undefined') {
      setStorefrontId(storefront.slug);
    }
  }, [storefront]);

  // Get storefront type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'physical_screen':
        return 'bg-blue-500/20 text-blue-300 border-blue-700/40';
      case 'online':
        return 'bg-green-500/20 text-green-300 border-green-700/40';
      case 'link':
        return 'bg-purple-500/20 text-purple-300 border-purple-700/40';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-700/40';
    }
  };

  // Format storefront type for display
  const formatStorefrontType = (type: string) => {
    switch (type) {
      case 'physical_screen':
        return 'Physical Screen';
      case 'online':
        return 'Online Store';
      case 'link':
        return 'Link';
      default:
        return type;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-16 bg-gray-800 rounded-lg" />
              <div className="h-8 bg-gray-800 rounded-lg w-2/3" />
              <ProductGridSkeleton count={8} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !storefront) {
    const isNotFound = (error as any)?.response?.status === 404;
    
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
              <h1 className="text-3xl font-bold mb-4">
                {isNotFound ? 'Storefront Not Found' : 'Something Went Wrong'}
              </h1>
              <p className="text-gray-400 mb-8">
                {isNotFound
                  ? "This storefront doesn't exist or has been removed."
                  : 'Unable to load storefront. Please try again later.'}
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button
                  onClick={() => router.push('/shop-clean')}
                  className="bg-[#00bfff] text-black hover:bg-[#00a8e6]"
                >
                  Browse All Products
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Build location string
  const locationParts = [storefront.address_line1, storefront.city, storefront.country].filter(Boolean);
  const locationString = locationParts.length > 0 ? locationParts.join(', ') : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Storefront Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="mb-6 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {/* Storefront Info */}
            <div className="space-y-4">
              {/* Type Badge */}
              <Badge className={`${getTypeBadgeColor(storefront.type)} border`}>
                <Store className="h-3 w-3 mr-1.5" />
                {formatStorefrontType(storefront.type)}
              </Badge>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {storefront.name}
              </h1>

              {/* Reseller Company */}
              {storefront.reseller_company_name && (
                <p className="text-lg md:text-xl text-gray-300">
                  Powered by <span className="font-semibold text-white">{storefront.reseller_company_name}</span>
                </p>
              )}

              {/* Location */}
              {locationString && (
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{locationString}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <h2 className="text-xl md:text-2xl font-bold mb-2">No Products Available</h2>
              <p className="text-sm md:text-base text-gray-400 mb-6 md:mb-8 px-4">
                This storefront doesn't have any products yet. Check back soon!
              </p>
              <Button
                onClick={() => router.push('/shop-clean')}
                className="bg-[#00bfff] text-black hover:bg-[#00a8e6]"
              >
                Browse All Products
              </Button>
            </div>
          ) : (
            <>
              {/* Products Header */}
              <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
                  Featured Products
                </h2>
                <p className="text-sm md:text-base text-gray-400">
                  {products.length} product{products.length !== 1 ? 's' : ''} available
                </p>
              </div>

              {/* Products Grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More / Pagination (if needed) */}
              {productsData?.next && (
                <div className="mt-8 md:mt-12 text-center">
                  <Button
                    onClick={() => {
                      // TODO: Implement pagination if needed
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    Load More Products
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
