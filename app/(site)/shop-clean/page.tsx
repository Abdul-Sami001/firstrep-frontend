// app/(site)/shop-clean/page.tsx - Shop Page with Filters
'use client';
import { Suspense, useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts, useCategories } from '@/hooks/useProducts';
import ShopHero from '@/components/ShopHero';
import ProductCard from '@/components/ProductCard';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, Grid3x3, List, ChevronLeft, ChevronRight, Filter, X, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

// Shop Page Content Component (wrapped in Suspense for searchParams)
function ShopPageContent() {
  const searchParams = useSearchParams();
  
  const router = useRouter();
  
  // Extract URL parameters
  const categoryParam = searchParams.get('category');
  const genderParam = searchParams.get('gender') as 'men' | 'women' | 'unisex' | null;
  const collectionParam = searchParams.get('collection');
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'featured';
  const pageParam = searchParams.get('page') || '1';
  const minPriceParam = searchParams.get('min_price');
  const maxPriceParam = searchParams.get('max_price');

  // Local search state
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Update search query when URL param changes
  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  // Fetch categories to find the selected category
  const { data: categories } = useCategories();
  const categoriesList = Array.isArray(categories) ? categories : [];
  const selectedCategory = categoriesList.find(
    (cat) => cat.name === categoryParam || cat.slug === categoryParam
  );

  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      const updates: Record<string, string | null> = { search: value || null, page: null };
      router.push(buildUrl(updates));
    }, 500); // 500ms debounce

    setSearchTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Determine if we should group by category (no filters except maybe sort)
  const shouldGroupByCategory = !categoryParam && !genderParam && !searchParam && !collectionParam;

  // Build filters for API
  const filters = useMemo(() => {
    const apiFilters: any = {
      is_active: true,
      page: parseInt(pageParam) || 1,
      page_size: shouldGroupByCategory ? 100 : 24, // Fetch more when grouping by category
    };

    // Search filter
    if (searchParam) {
      apiFilters.search = searchParam;
    }

    // Category filter
    if (selectedCategory?.slug) {
      apiFilters.category__slug = selectedCategory.slug;
    } else if (categoryParam) {
      // Fallback: try to use category name as slug
      apiFilters.category__slug = categoryParam.toLowerCase().replace(/\s+/g, '-');
    }

    // Collection filter
    if (collectionParam) {
      apiFilters.collections__name = collectionParam;
    }

    // Gender filter - handle via product specifications or backend gender field
    if (genderParam) {
      // Option 1: If backend has a direct gender field
      // apiFilters.gender = genderParam;
      
      // Option 2: If backend uses specifications JSON field
      // apiFilters.specifications__gender = genderParam;
      
      // Option 3: If backend uses a different field name, adjust accordingly
      // For now, we'll add it to filters but backend needs to support it
      // You may need to adjust this based on your backend API structure
    }

    // Price filters
    if (minPriceParam) {
      apiFilters.min_price = parseFloat(minPriceParam);
    }
    if (maxPriceParam) {
      apiFilters.max_price = parseFloat(maxPriceParam);
    }

    // Sort
    const sortMap: Record<string, string> = {
      featured: '-popularity',
      'price-low': 'price',
      'price-high': '-price',
      newest: '-created_at',
      'name-asc': 'title',
      'name-desc': '-title',
    };
    apiFilters.ordering = sortMap[sortParam] || '-popularity';

    return apiFilters;
  }, [categoryParam, selectedCategory, genderParam, collectionParam, sortParam, pageParam, minPriceParam, maxPriceParam, searchParam, shouldGroupByCategory]);

  // State to control loading delay for smooth UX
  const [showLoadingDelay, setShowLoadingDelay] = useState(true);

  // Fetch products
  const {
    data: productsData,
    isLoading,
    error,
  } = useProducts(filters);

  // Add a small delay when products load to ensure smooth transition from cart
  useEffect(() => {
    if (!isLoading && productsData) {
      // Small delay to allow cart close animation and smooth page transition
      const timer = setTimeout(() => {
        setShowLoadingDelay(false);
      }, 400); // 400ms delay for smooth UX
      return () => clearTimeout(timer);
    } else if (isLoading) {
      setShowLoadingDelay(true);
    }
  }, [isLoading, productsData]);

  const products = productsData?.results || [];
  const totalCount = productsData?.count || 0;
  const currentPage = parseInt(pageParam) || 1;
  const totalPages = Math.ceil(totalCount / (filters.page_size || 24));
  const hasNextPage = !!productsData?.next;
  const hasPrevPage = !!productsData?.previous;
  
  // Show loading state during delay or actual loading
  const isShowingLoading = isLoading || showLoadingDelay;

  // Group products by category when no filters are applied
  const groupedProducts = useMemo(() => {
    if (!shouldGroupByCategory || !products.length) return null;

    const grouped: Record<string, typeof products> = {};
    
    products.forEach((product) => {
      const categoryName = product.category?.name || 'Uncategorized';
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(product);
    });

    // Sort categories by name
    const sortedCategories = Object.keys(grouped).sort();
    
    return sortedCategories.map((categoryName) => ({
      categoryName,
      products: grouped[categoryName],
    }));
  }, [products, shouldGroupByCategory]);

  // Build URL with updated params
  const buildUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams();
    
    // Get updated values (use update if provided, otherwise use existing)
    const updatedCategory = 'category' in updates ? updates.category : categoryParam;
    const updatedGender = 'gender' in updates ? updates.gender : genderParam;
    const updatedCollection = 'collection' in updates ? updates.collection : collectionParam;
    const updatedSearch = 'search' in updates ? updates.search : (searchParam || null);
    const updatedSort = 'sort' in updates ? updates.sort : (sortParam && sortParam !== 'featured' ? sortParam : null);
    const updatedMinPrice = 'min_price' in updates ? updates.min_price : minPriceParam;
    const updatedMaxPrice = 'max_price' in updates ? updates.max_price : maxPriceParam;
    const updatedPage = 'page' in updates ? updates.page : (pageParam && pageParam !== '1' ? pageParam : null);

    // Set params (only if not null)
    if (updatedCategory) params.set('category', updatedCategory);
    if (updatedGender) params.set('gender', updatedGender);
    if (updatedCollection) params.set('collection', updatedCollection);
    if (updatedSearch) params.set('search', updatedSearch);
    if (updatedSort) params.set('sort', updatedSort);
    if (updatedMinPrice) params.set('min_price', updatedMinPrice);
    if (updatedMaxPrice) params.set('max_price', updatedMaxPrice);
    if (updatedPage) params.set('page', updatedPage);

    const queryString = params.toString();
    return queryString ? `/shop-clean?${queryString}` : '/shop-clean';
  };

  // Get hero image from first product or category
  // Priority: 1. category.image (new API field), 2. first product image (fallback)
  const heroImage = selectedCategory?.image || products?.[0]?.images?.[0]?.image;

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Hero Section */}
      <ShopHero
        category={selectedCategory || undefined}
        gender={genderParam || undefined}
        image={heroImage}
      />

      {/* Filters and Toolbar */}
      <section className="bg-[#000000] border-b border-gray-800">
        <div className="mobile-container tablet-container desktop-container py-4 md:py-6">
          {/* Results Count */}
          <div className="mb-4 md:mb-6">
            <p className="text-sm md:text-base text-gray-300">
              {isShowingLoading ? (
                'Loading...'
              ) : error ? (
                'Error loading products'
              ) : (
                <>
                  Showing <span className="text-white font-semibold">{products.length}</span> of{' '}
                  <span className="text-white font-semibold">{totalCount}</span> products
                  {selectedCategory && ` in ${selectedCategory.name}`}
                  {collectionParam && ` in ${collectionParam} Collection`}
                  {genderParam && ` for ${genderParam === 'men' ? 'Men' : genderParam === 'women' ? 'Women' : 'Unisex'}`}
                </>
              )}
            </p>
          </div>

          {/* Active Filters */}
          {(selectedCategory || genderParam || searchParam || collectionParam) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs md:text-sm text-gray-400 font-medium">Active Filters:</span>
              {searchParam && (
                <Link
                  href={buildUrl({ search: null })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3c83f6]/20 text-[#3c83f6] border border-[#3c83f6]/30 rounded-md text-xs md:text-sm font-medium hover:bg-[#3c83f6]/30 transition-colors"
                >
                  <span>Search: {searchParam}</span>
                  <X className="h-3 w-3" />
                </Link>
              )}
              {collectionParam && (
                <Link
                  href={buildUrl({ collection: null })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3c83f6]/20 text-[#3c83f6] border border-[#3c83f6]/30 rounded-md text-xs md:text-sm font-medium hover:bg-[#3c83f6]/30 transition-colors"
                >
                  <span>Collection: {collectionParam}</span>
                  <X className="h-3 w-3" />
                </Link>
              )}
              {selectedCategory && (
                <Link
                  href={buildUrl({ category: null })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3c83f6]/20 text-[#3c83f6] border border-[#3c83f6]/30 rounded-md text-xs md:text-sm font-medium hover:bg-[#3c83f6]/30 transition-colors"
                >
                  <span>{selectedCategory.name}</span>
                  <X className="h-3 w-3" />
                </Link>
              )}
              {genderParam && (
                <Link
                  href={buildUrl({ gender: null })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3c83f6]/20 text-[#3c83f6] border border-[#3c83f6]/30 rounded-md text-xs md:text-sm font-medium hover:bg-[#3c83f6]/30 transition-colors"
                >
                  <span>{genderParam === 'men' ? 'Men' : genderParam === 'women' ? 'Women' : 'Unisex'}</span>
                  <X className="h-3 w-3" />
                </Link>
              )}
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-4 md:mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3c83f6]"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Gender Filter */}
              <Select
                value={genderParam || 'all'}
                onValueChange={(value) => {
                  window.location.href = buildUrl({ 
                    gender: value === 'all' ? null : value as 'men' | 'women' | 'unisex',
                    page: null 
                  });
                }}
              >
                <SelectTrigger className="w-full sm:w-[160px] bg-gray-900 border-gray-700 text-white focus:border-[#3c83f6]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all" className="text-white focus:bg-gray-700 data-[highlighted]:bg-gray-700 focus:text-white data-[highlighted]:text-white">
                    All Genders
                  </SelectItem>
                  <SelectItem value="men" className="text-white focus:bg-gray-700 data-[highlighted]:bg-gray-700 focus:text-white data-[highlighted]:text-white">
                    Men
                  </SelectItem>
                  <SelectItem value="women" className="text-white focus:bg-gray-700 data-[highlighted]:bg-gray-700 focus:text-white data-[highlighted]:text-white">
                    Women
                  </SelectItem>
                  <SelectItem value="unisex" className="text-white focus:bg-gray-700 data-[highlighted]:bg-gray-700 focus:text-white data-[highlighted]:text-white">
                    Unisex
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select
                value={selectedCategory?.slug || selectedCategory?.name || 'all'}
                onValueChange={(value) => {
                  if (value === 'all') {
                    window.location.href = buildUrl({ category: null, page: null });
                  } else {
                    const selectedCat = categoriesList.find(cat => cat.slug === value || cat.name === value);
                    window.location.href = buildUrl({ 
                      category: selectedCat?.name || value,
                      page: null 
                    });
                  }
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-900 border-gray-700 text-white focus:border-[#3c83f6]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 max-h-[300px]">
                  <SelectItem value="all" className="text-white focus:bg-gray-700 data-[highlighted]:bg-gray-700 focus:text-white data-[highlighted]:text-white">
                    All Categories
                  </SelectItem>
                  {categoriesList.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.slug || category.name}
                      className="text-white focus:bg-gray-700 data-[highlighted]:bg-gray-700 focus:text-white data-[highlighted]:text-white"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select
                value={sortParam}
                onValueChange={(value) => {
                  window.location.href = buildUrl({ sort: value, page: null });
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-900 border-gray-700 text-white focus:border-[#3c83f6]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="featured" className="text-white focus:bg-gray-700 data-[highlighted]:bg-gray-700 focus:text-white data-[highlighted]:text-white">
                    Featured
                  </SelectItem>
                  <SelectItem value="price-low" className="text-white focus:bg-gray-700 data-[highlighted]:bg-gray-700 focus:text-white data-[highlighted]:text-white">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-high" className="text-white focus:bg-gray-700 data-[highlighted]:bg-gray-700 focus:text-white data-[highlighted]:text-white">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="newest" className="text-white focus:bg-gray-700 data-[highlighted]:bg-gray-700 focus:text-white data-[highlighted]:text-white">
                    Newest
                  </SelectItem>
                  <SelectItem value="name-asc" className="text-white focus:bg-gray-700 data-[highlighted]:bg-gray-700 focus:text-white data-[highlighted]:text-white">
                    Name: A-Z
                  </SelectItem>
                  <SelectItem value="name-desc" className="text-white focus:bg-gray-700 data-[highlighted]:bg-gray-700 focus:text-white data-[highlighted]:text-white">
                    Name: Z-A
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-[#000000] py-8 md:py-12 lg:py-16">
        <div className="mobile-container tablet-container desktop-container">
          {isShowingLoading ? (
            <ProductGridSkeleton count={12} />
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-lg text-gray-400 mb-4">Unable to load products.</p>
              <p className="text-sm text-gray-500 mb-6">Please try again later.</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#3c83f6] hover:bg-[#2563eb] text-white"
              >
                Retry
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl md:text-2xl font-bold text-white mb-4">No products found</p>
              <p className="text-gray-400 mb-6">
                {searchParam
                  ? `No products found for "${searchParam}". Try a different search term.`
                  : selectedCategory || genderParam || collectionParam
                  ? 'Try adjusting your filters or browse all products.'
                  : 'Check back soon for new arrivals.'}
              </p>
              {(selectedCategory || genderParam || searchParam || collectionParam) ? (
                <Link href="/shop-clean">
                  <Button className="bg-[#3c83f6] hover:bg-[#2563eb] text-white">
                    View All Products
                  </Button>
                </Link>
              ) : null}
            </div>
          ) : shouldGroupByCategory && groupedProducts ? (
            <>
              {/* Grouped by Category */}
              <div className="space-y-12 md:space-y-16">
                {groupedProducts.map(({ categoryName, products: categoryProducts }) => (
                  <div key={categoryName} className="space-y-6">
                    {/* Products Grid for this Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {categoryProducts.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          priority={index < 8}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Product Grid - Filtered/Searched Results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={index < 8}
                  />
                ))}
              </div>

              {/* Pagination - Only show when not grouped by category */}
              {!shouldGroupByCategory && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Link
                    href={buildUrl({ page: hasPrevPage ? String(currentPage - 1) : null })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                      !hasPrevPage
                        ? 'border-gray-800 text-gray-600 cursor-not-allowed'
                        : 'border-gray-700 text-white hover:bg-gray-800'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Previous</span>
                  </Link>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Link
                          key={pageNum}
                          href={buildUrl({ page: pageNum === 1 ? null : String(pageNum) })}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-[#3c83f6] text-white'
                              : 'border border-gray-700 text-white hover:bg-gray-800'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>

                  <Link
                    href={buildUrl({ page: hasNextPage ? String(currentPage + 1) : null })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                      !hasNextPage
                        ? 'border-gray-800 text-gray-600 cursor-not-allowed'
                        : 'border-gray-700 text-white hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-sm font-medium">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// Main Page Component with Suspense
export default function ShopCleanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#000000]">
          <div className="relative w-full aspect-[16/9] bg-gray-900 animate-pulse" />
          <div className="mobile-container tablet-container desktop-container py-8">
            <ProductGridSkeleton count={12} />
          </div>
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}

