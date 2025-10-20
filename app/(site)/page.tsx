// app/(site)/page.tsx - Production-Ready API Integration (Dynamic New Arrivals only)
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { useTheme } from '@/components/ThemeProvider';
import { useProducts } from '@/hooks/useProducts';
import { Loader2, AlertCircle } from 'lucide-react';

// ✅ KEEP ALL YOUR EXISTING IMAGES AND DATA
// Import hero/lifestyle images
const trainingHero = '/attached_assets/videoframe_6232_1760252496970.png';
const yogaHero = '/attached_assets/stock_images/woman_yoga_meditatio_5c026a27.jpg';
const runningHero = '/attached_assets/M5583226771-f_1760251696002.webp';
const studioHero = '/attached_assets/stock_images/woman_pilates_studio_fd48cd53.jpg';

// Import product images - Training
const trainProduct1 = '/attached_assets/M3012182333-b_1760252501219.webp';
const trainProduct2 = '/attached_assets/M3012182555-a7_1760252505983.webp';
const trainProduct3 = '/attached_assets/34121822709-07-m1_1760252514562.webp';
const trainProduct4 = '/attached_assets/34121822709-07-a16_1760252516609.webp';

// Import product images - Yoga
const yogaProduct1 = '/attached_assets/stock_images/fitness_leggings_pro_c1056f29.jpg';
const yogaProduct2 = '/attached_assets/stock_images/athletic_tank_top_fi_a8efba09.jpg';
const yogaProduct3 = '/attached_assets/stock_images/sports_bra_athletic__e52c7a14.jpg';
const yogaProduct4 = '/attached_assets/stock_images/yoga_hoodie_sweatshi_c4c2d58a.jpg';

// Import product images - Running
const runProduct1 = '/attached_assets/33707229598-01-a1_1760251710177.webp';
const runProduct2 = '/attached_assets/M5523226771-b_1760251706866.webp';
const runProduct3 = '/attached_assets/M5533226771-a7_1760251701188.webp';
const runProduct4 = '/attached_assets/stock_images/athletic_jacket_wind_b1fbd930.jpg';

// Import product images - Studio
const studioProduct1 = '/attached_assets/stock_images/fitness_leggings_pro_04bbb42c.jpg';
const studioProduct2 = '/attached_assets/stock_images/sports_bra_athletic__47b23b36.jpg';
const studioProduct3 = '/attached_assets/stock_images/woman_wearing_active_8c826f66.jpg';
const studioProduct4 = '/attached_assets/stock_images/athletic_jacket_wind_a7a165ee.jpg';

// Import videos
const styleVideo1 = '/attached_assets/293079_small_1760255538523.mp4';
const styleVideo2 = '/attached_assets/istockphoto-1290029022-640_adpp_is_1760255538522.mp4';
const featureVideo1 = '/attached_assets/293079_small (1)_1760255538523.mp4';
const newVideo1 = '/attached_assets/8745114-uhd_2160_4096_25fps_1760258378760.mp4';
const newVideo2 = '/attached_assets/6739967-hd_1080_1920_25fps_1760258381467.mp4';

// Editorial images
const newLifestyle1 = '/attached_assets/julia-rekamie-Z72YujnOrlY-unsplash_1760258343008.jpg';
const newLifestyle2 = '/attached_assets/marvin-ozz-1M11MZe-DgU-unsplash_1760258345061.jpg';
const newLifestyle3 = '/attached_assets/han-wei-sheng-5Lp7PJONCFw-unsplash_1760258350814.jpg';
const newLifestyle4 = '/attached_assets/strict-girl-glamour-salon-styling_1760258354452.jpg';
const newLifestyle5 = '/attached_assets/full-shot-sporty-woman-with-jumping-rope_1760258356366.jpg';
const newLifestyle6 = '/attached_assets/fitness-woman-doing-exercise-home_1760258360301.jpg';
const newLifestyle7 = '/attached_assets/pexels-lloyd-james-189552887-11588005_1760258363076.jpg';
const newLifestyle8 = '/attached_assets/pexels-cottonbro-7690850_1760258366380.jpg';
const newLifestyle9 = '/attached_assets/pexels-jonathanborba-3076513_1760258369403.jpg';
const newLifestyle10 = '/attached_assets/pexels-nappy-936094_1760258372261.jpg';
const newLifestyle11 = '/attached_assets/pexels-olly-3764537_1760258374850.jpg';

// Theme content (used for static UI sections)
const themeContent = {
    running: {
        hero: {
            image: runningHero,
            video: newVideo1,
            title: 'Run Faster, Go Farther',
            subtitle: 'Elevate your performance with premium activewear designed to move with you',
        },
        products: [
            { id: 'run-1', name: 'Running Tights', price: 79.99, image: runProduct1, hoverImage: runProduct3 },
            { id: 'run-2', name: 'Speed Tank', price: 39.99, image: runProduct2, hoverImage: runProduct1 },
            { id: 'run-3', name: 'Running Shorts', price: 49.99, image: runProduct3, hoverImage: runProduct2 },
            { id: 'run-4', name: 'Wind Jacket', price: 119.99, image: runProduct4, hoverImage: runProduct1 },
        ],
    },
} as const;

export default function HomePage() {
    const { setTheme } = useTheme();
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());

    // Fetch dynamic products for New Arrivals only
    const {
        data: apiProducts,
        isLoading: apiLoading,
        error: apiError,
        refetch: refetchProducts,
    } = useProducts({
        page_size: 8,
        ordering: '-created_at',
        is_active: true,
    });

    // Normalize both array and paginated responses
    const apiList = Array.isArray(apiProducts) ? apiProducts : apiProducts?.results ?? [];

    // Static UI sections use the running theme
    const content = themeContent['running'];

    useEffect(() => {
        setTheme('running');
    }, [setTheme]);

    const handleToggleWishlist = (productId: string) => {
        setWishlist(prev => {
            const next = new Set(prev);
            next.has(productId) ? next.delete(productId) : next.add(productId);
            return next;
        });
    };

    return (
        <div className="min-h-screen">
            {/* HERO - static */}
            <Hero {...content.hero} />

            {/* Static UI sections */}
            <div className="mobile-container tablet-container desktop-container">
                {/* Shop by Style - static */}
                <section className="py-8 md:py-12 lg:py-16">
                    <div className="mb-8 md:mb-12 text-center">
                        <h2 className="text-mobile-h2 md:text-tablet-h2 lg:text-desktop-h2 font-bold mb-2" data-testid="text-featured-title">
                            Shop by Style
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Discover our curated collections for every occasion
                        </p>
                    </div>

                    <div className="grid grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop gap-mobile md:gap-tablet lg:gap-desktop mb-8 md:mb-12 lg:mb-20">
                        <div className="md:col-span-2 md:row-span-2">
                            <Link href="/Collections/training" data-testid="link-category-jackets">
                                <div className="group relative h-64 md:h-80 lg:h-96 rounded-md overflow-hidden">
                                    <video autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                                        <source src={styleVideo1} type="video/mp4" />
                                    </video>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                    <div className="absolute bottom-4 md:bottom-6 lg:bottom-8 left-4 md:left-6 lg:left-8 text-white">
                                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2">Jackets</h3>
                                        <p className="text-xs md:text-sm text-white/90 mb-2 md:mb-4">Essential layers for every season</p>
                                        <span className="inline-block border-b-2 border-white pb-1 text-xs md:text-sm font-medium">Shop Now</span>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div>
                            <Link href="/Collections/yoga" data-testid="link-category-sweatshirts">
                                <div className="group relative h-48 md:h-56 lg:h-64 rounded-md overflow-hidden">
                                    <Image
                                        src={newLifestyle1}
                                        alt="Athletic Sets Collection"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        quality={85}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                    <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 text-white">
                                        <h3 className="text-lg md:text-xl font-bold mb-1">Athletic Sets</h3>
                                        <p className="text-xs text-white/90 mb-2">Coordinated performance wear</p>
                                        <span className="inline-block border-b border-white pb-1 text-xs font-medium">Shop Now</span>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div>
                            <Link href="/Collections/studio" data-testid="link-category-knitwear">
                                <div className="group relative h-48 md:h-56 lg:h-64 rounded-md overflow-hidden">
                                    <Image
                                        src={newLifestyle7}
                                        alt="Training Essentials"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        quality={85}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                    <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 text-white">
                                        <h3 className="text-lg md:text-xl font-bold mb-1">Training Essentials</h3>
                                        <p className="text-xs text-white/90 mb-2">Performance-driven pieces</p>
                                        <span className="inline-block border-b border-white pb-1 text-xs font-medium">Shop Now</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Bottom row - static */}
                    <div className="grid grid-cols-mobile md:grid-cols-tablet gap-mobile md:gap-tablet lg:gap-desktop mb-12 md:mb-16 lg:mb-20">
                        <Link href="/Collections/running" data-testid="link-category-borreguito">
                            <div className="group relative h-48 md:h-56 lg:h-64 rounded-md overflow-hidden">
                                <video autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                                    <source src={styleVideo2} type="video/mp4" />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                <div className="absolute bottom-4 md:bottom-6 lg:bottom-8 left-4 md:left-6 lg:left-8 text-white">
                                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2">Borreguito</h3>
                                    <p className="text-xs md:text-sm text-white/90 mb-2 md:mb-3">Sherpa & fleece favorites</p>
                                    <span className="inline-block border-b-2 border-white pb-1 text-xs md:text-sm font-medium">Shop Now</span>
                                </div>
                            </div>
                        </Link>

                        <Link href="/Collections/training" data-testid="link-category-activity">
                            <div className="group relative h-48 md:h-56 lg:h-64 rounded-md overflow-hidden">
                                <video autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                                    <source src={newVideo1} type="video/mp4" />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                <div className="absolute bottom-4 md:bottom-6 lg:bottom-8 left-4 md:left-6 lg:left-8 text-white">
                                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2">By Activity</h3>
                                    <p className="text-xs md:text-sm text-white/90 mb-2 md:mb-3">Find gear for your workout</p>
                                    <span className="inline-block border-b-2 border-white pb-1 text-xs md:text-sm font-medium">Shop Now</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Activity Categories - static */}
                    <div className="mb-8 md:mb-12">
                        <h2 className="text-mobile-h2 md:text-tablet-h2 lg:text-desktop-h2 font-bold mb-2">Shop by Activity</h2>
                        <p className="text-sm md:text-base text-muted-foreground">Explore our complete range of fitness essentials</p>
                    </div>

                    <div className="grid grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop gap-mobile md:gap-tablet lg:gap-desktop mb-12 md:mb-16 lg:mb-20">
                        <Link href="/Collections/training"><CategoryCard name="Training" image={newLifestyle3} /></Link>
                        <Link href="/Collections/yoga"><CategoryCard name="Yoga" image={newLifestyle4} /></Link>
                        <Link href="/Collections/running"><CategoryCard name="Running" image={newLifestyle2} /></Link>
                        <Link href="/Collections/studio"><CategoryCard name="Studio" image={newLifestyle6} /></Link>
                    </div>

                    {/* Editorial - static */}
                    <div className="mb-12 md:mb-16 lg:mb-20">
                        <div className="mb-8 md:mb-12 text-center">
                            <h2 className="text-mobile-h2 md:text-tablet-h2 lg:text-desktop-h2 font-bold mb-2">Performance Features</h2>
                            <p className="text-sm md:text-base text-muted-foreground">Discover the technology behind our designs</p>
                        </div>

                        <div className="grid grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop gap-mobile md:gap-tablet lg:gap-desktop">
                            <Link href="/Collections/training" data-testid="link-editorial-jacket">
                                <div className="group relative aspect-[3/4] rounded-md overflow-hidden">
                                    <video autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                                        <source src={featureVideo1} type="video/mp4" />
                                    </video>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </Link>

                            <Link href="/Collections/training" data-testid="link-editorial-highrise">
                                <div className="group relative aspect-[3/4] rounded-md overflow-hidden bg-muted">
                                    <Image
                                        src={newLifestyle8}
                                        alt="Strength Training"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        quality={85}
                                    />
                                </div>
                            </Link>

                            <Link href="/Collections/training" data-testid="link-editorial-tech">
                                <div className="group relative aspect-[3/4] rounded-md overflow-hidden bg-muted">
                                    <video autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                                        <source src={newVideo2} type="video/mp4" />
                                    </video>
                                </div>
                            </Link>

                            <Link href="/Collections/training" data-testid="link-editorial-training">
                                <div className="group relative aspect-[3/4] rounded-md overflow-hidden">
                                    <Image
                                        src={newLifestyle11}
                                        alt="Outdoor Running"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        quality={85}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </Link>
                        </div>

                        <div className="grid grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop gap-mobile md:gap-tablet lg:gap-desktop mt-4 md:mt-6">
                            <Link href="/Collections/training" data-testid="link-editorial-totallook">
                                <div className="group relative aspect-square rounded-md overflow-hidden bg-muted">
                                    <Image
                                        src={newLifestyle9}
                                        alt="Core Training"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        quality={85}
                                    />
                                </div>
                            </Link>

                            <Link href="/Collections/yoga" data-testid="link-editorial-outdoor">
                                <div className="group relative aspect-square rounded-md overflow-hidden">
                                    <Image
                                        src={newLifestyle10}
                                        alt="Speed Training"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        quality={85}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </Link>

                            <Link href="/Collections/training" data-testid="link-editorial-flare">
                                <div className="group relative aspect-square rounded-md overflow-hidden bg-muted">
                                    <Image
                                        src={newLifestyle5}
                                        alt="Recovery & Flexibility"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        quality={85}
                                    />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* ✅ DYNAMIC ONLY: New Arrivals (API products) */}
                    <div className="mb-8 md:mb-12">
                        <h2 className="text-mobile-h2 md:text-tablet-h2 lg:text-desktop-h2 font-bold mb-2" data-testid="text-products-title">
                            {apiList.length > 0 ? 'Featured Products' : 'New Arrivals'}
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground">
                            {apiList.length > 0
                                ? 'Discover our handpicked selection of premium activewear'
                                : 'Discover the latest additions to our collection'}
                        </p>
                    </div>

                    {/* Loader / Error / Empty states */}
                    {apiLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                                <p>Loading products from API...</p>
                            </div>
                        </div>
                    ) : apiError ? (
                        <div className="text-center py-12">
                            <div className="flex items-center justify-center mb-4">
                                <AlertCircle className="h-8 w-8 text-destructive" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Unable to load products</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                There was an issue connecting to our product database.
                            </p>
                            <button
                                onClick={() => refetchProducts()}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : apiList.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground">No products available yet. Please check back soon.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop gap-mobile md:gap-tablet lg:gap-desktop">
                            {apiList.map((product: any, index: number) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}             // pass API product as-is
                                    onToggleWishlist={handleToggleWishlist}
                                    isWishlisted={wishlist.has(product.id)}
                                    priority={index < 4}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}