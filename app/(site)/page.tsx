'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { useTheme } from '@/components/ThemeProvider';

// Import hero/lifestyle images
const trainingHero = '/attached_assets/videoframe_6232_1760252496970.png';
// Use string paths for missing images
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

// Import video backgrounds
const trainingVideo = '/attached_assets/148208-793717949_small_1760255538521.mp4';
const yogaVideo = '/attached_assets/189730-886596151_small_1760255538521.mp4';
const runningVideo = '/attached_assets/istockphoto-497041804-640_adpp_is - Copy_1760257907270.mp4';
const studioVideo = '/attached_assets/istockphoto-2187361158-640_adpp_is_1760255538522.mp4';

const styleVideo1 = '/attached_assets/293079_small_1760255538523.mp4';
const styleVideo2 = '/attached_assets/istockphoto-1290029022-640_adpp_is_1760255538522.mp4';
const featureVideo1 = '/attached_assets/293079_small (1)_1760255538523.mp4';
const featureVideo2 = '/attached_assets/istockphoto-497041804-640_adpp_is_1760255538523.mp4';

const newVideo1 = '/attached_assets/8745114-uhd_2160_4096_25fps_1760258378760.mp4';
const newVideo2 = '/attached_assets/6739967-hd_1080_1920_25fps_1760258381467.mp4';

// Import new lifestyle/editorial images
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

const themeContent = {
    'training': {
        hero: {
            image: trainingHero,
            video: trainingVideo,
            title: 'Built for Training',
            subtitle: 'High-performance apparel for intense workouts'
        },
        products: [
            { id: 'train-1', name: 'Power Leggings', price: 89.99, image: trainProduct1, hoverImage: trainProduct3 },
            { id: 'train-2', name: 'Strength Sports Bra', price: 52.99, image: trainProduct2, hoverImage: trainProduct1 },
            { id: 'train-3', name: 'Training Crossback Bra', price: 64.99, image: trainProduct3, hoverImage: trainProduct2 },
            { id: 'train-4', name: 'Training Essential Set', price: 149.99, image: trainProduct4, hoverImage: trainProduct1 },
        ]
    },
    'yoga': {
        hero: {
            image: yogaHero,
            video: yogaVideo,
            title: 'Move with Grace',
            subtitle: 'Soft, breathable fabrics for yoga and mindful movement'
        },
        products: [
            { id: 'yoga-1', name: 'Yoga Leggings', price: 89.99, image: yogaProduct1, hoverImage: yogaProduct3 },
            { id: 'yoga-2', name: 'Flow Crop Top', price: 48.99, image: yogaProduct2, hoverImage: yogaProduct1 },
            { id: 'yoga-3', name: 'Soft Bra', price: 42.99, image: yogaProduct3, hoverImage: yogaProduct2 },
            { id: 'yoga-4', name: 'Relaxed Hoodie', price: 92.99, image: yogaProduct4, hoverImage: yogaProduct1 },
        ]
    },
    'running': {
        hero: {
            image: runningHero,
            video: runningVideo,
            title: 'Run Faster, Go Farther',
            subtitle: 'Elevate your performance with premium activewear designed to move with you'
        },
        products: [
            { id: 'run-1', name: 'Running Tights', price: 79.99, image: runProduct1, hoverImage: runProduct3 },
            { id: 'run-2', name: 'Speed Tank', price: 39.99, image: runProduct2, hoverImage: runProduct1 },
            { id: 'run-3', name: 'Running Shorts', price: 49.99, image: runProduct3, hoverImage: runProduct2 },
            { id: 'run-4', name: 'Wind Jacket', price: 119.99, image: runProduct4, hoverImage: runProduct1 },
        ]
    },
    'studio': {
        hero: {
            image: studioHero,
            video: studioVideo,
            title: 'Studio Essentials',
            subtitle: 'Versatile pieces for all your fitness classes'
        },
        products: [
            { id: 'studio-1', name: 'Studio Leggings', price: 84.99, image: studioProduct1, hoverImage: studioProduct3 },
            { id: 'studio-2', name: 'Crossback Bra', price: 58.99, image: studioProduct2, hoverImage: studioProduct1 },
            { id: 'studio-3', name: 'Cropped Tank', price: 44.99, image: studioProduct3, hoverImage: studioProduct2 },
            { id: 'studio-4', name: 'Studio Jacket', price: 98.99, image: studioProduct4, hoverImage: studioProduct1 },
        ]
    }
};

export default function HomePage() {
    const { setTheme } = useTheme();
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());

    // Always use running content for homepage
    const content = themeContent['running'];

    // Set running theme colors on homepage mount
    useEffect(() => {
        setTheme('running');
    }, [setTheme]);

    const handleToggleWishlist = (productId: string) => {
        setWishlist(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen">
            <Hero {...content.hero} />

            {/* Featured Categories - Shop by Style */}
            <section className="container mx-auto px-4 py-16">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold mb-2" data-testid="text-featured-title">Shop by Style</h2>
                    <p className="text-muted-foreground">Discover our curated collections for every occasion</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Large featured category - Jackets with Video */}
                    <div className="md:col-span-2 md:row-span-2">
                        <Link href="/Collections/training" data-testid="link-category-jackets">
                            <div className="group relative h-full min-h-[400px] rounded-md overflow-hidden">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                >
                                    <source src={styleVideo1} type="video/mp4" />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                <div className="absolute bottom-8 left-8 text-white">
                                    <h3 className="text-3xl font-bold mb-2">Jackets</h3>
                                    <p className="text-sm text-white/90 mb-4">Essential layers for every season</p>
                                    <span className="inline-block border-b-2 border-white pb-1 text-sm font-medium">
                                        Shop Now
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Athletic Sets */}
                    <div>
                        <Link href="/Collections/yoga" data-testid="link-category-sweatshirts">
                            <div className="group relative h-full min-h-[192px] rounded-md overflow-hidden">
                                <img
                                    src={newLifestyle1}
                                    alt="Athletic Sets Collection"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-xl font-bold mb-1">Athletic Sets</h3>
                                    <p className="text-xs text-white/90 mb-2">Coordinated performance wear</p>
                                    <span className="inline-block border-b border-white pb-1 text-xs font-medium">
                                        Shop Now
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Training Essentials */}
                    <div>
                        <Link href="/Collections/studio" data-testid="link-category-knitwear">
                            <div className="group relative h-full min-h-[192px] rounded-md overflow-hidden">
                                <img
                                    src={newLifestyle7}
                                    alt="Training Essentials"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-xl font-bold mb-1">Training Essentials</h3>
                                    <p className="text-xs text-white/90 mb-2">Performance-driven pieces</p>
                                    <span className="inline-block border-b border-white pb-1 text-xs font-medium">
                                        Shop Now
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Bottom row - Borreguito and By Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    {/* Borreguito/Sherpa with Video */}
                    <Link href="/Collections/running" data-testid="link-category-borreguito">
                        <div className="group relative h-64 rounded-md overflow-hidden">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            >
                                <source src={styleVideo2} type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute bottom-8 left-8 text-white">
                                <h3 className="text-2xl font-bold mb-2">Borreguito</h3>
                                <p className="text-sm text-white/90 mb-3">Sherpa & fleece favorites</p>
                                <span className="inline-block border-b-2 border-white pb-1 text-sm font-medium">
                                    Shop Now
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* By Activity with Video */}
                    <Link href="/Collections/training" data-testid="link-category-activity">
                        <div className="group relative h-64 rounded-md overflow-hidden">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            >
                                <source src={newVideo1} type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute bottom-8 left-8 text-white">
                                <h3 className="text-2xl font-bold mb-2">By Activity</h3>
                                <p className="text-sm text-white/90 mb-3">Find gear for your workout</p>
                                <span className="inline-block border-b-2 border-white pb-1 text-sm font-medium">
                                    Shop Now
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Original activity categories */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-2">Shop by Activity</h2>
                    <p className="text-muted-foreground">Explore our complete range of fitness essentials</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    <Link href="/Collections/training">
                        <CategoryCard name="Training" image={newLifestyle3} />
                    </Link>
                    <Link href="/Collections/yoga">
                        <CategoryCard name="Yoga" image={newLifestyle4} />
                    </Link>
                    <Link href="/Collections/running">
                        <CategoryCard name="Running" image={newLifestyle2} />
                    </Link>
                    <Link href="/Collections/studio">
                        <CategoryCard name="Studio" image={newLifestyle6} />
                    </Link>
                </div>

                {/* Editorial Features Section */}
                <div className="mb-20">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold mb-2">Performance Features</h2>
                        <p className="text-muted-foreground">Discover the technology behind our designs</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Lifestyle Editorial with Video */}
                        <Link href="/Collections/training" data-testid="link-editorial-jacket">
                            <div className="group relative aspect-[3/4] rounded-md overflow-hidden">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                >
                                    <source src={featureVideo1} type="video/mp4" />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </Link>

                        {/* Strength Training */}
                        <Link href="/Collections/training" data-testid="link-editorial-highrise">
                            <div className="group relative aspect-[3/4] rounded-md overflow-hidden bg-muted">
                                <img
                                    src={newLifestyle8}
                                    alt="Strength Training"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </Link>

                        {/* Cardio Training with Video */}
                        <Link href="/Collections/training" data-testid="link-editorial-tech">
                            <div className="group relative aspect-[3/4] rounded-md overflow-hidden bg-muted">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                >
                                    <source src={newVideo2} type="video/mp4" />
                                </video>
                            </div>
                        </Link>

                        {/* Outdoor Running */}
                        <Link href="/Collections/training" data-testid="link-editorial-training">
                            <div className="group relative aspect-[3/4] rounded-md overflow-hidden">
                                <img
                                    src={newLifestyle11}
                                    alt="Outdoor Running"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </Link>
                    </div>

                    {/* Bottom Row - Feature Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {/* Core Training */}
                        <Link href="/Collections/training" data-testid="link-editorial-totallook">
                            <div className="group relative aspect-square rounded-md overflow-hidden bg-muted">
                                <img
                                    src={newLifestyle9}
                                    alt="Core Training"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </Link>

                        {/* Speed Training */}
                        <Link href="/Collections/yoga" data-testid="link-editorial-outdoor">
                            <div className="group relative aspect-square rounded-md overflow-hidden">
                                <img
                                    src={newLifestyle10}
                                    alt="Speed Training"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </Link>

                        {/* Recovery & Flexibility */}
                        <Link href="/Collections/training" data-testid="link-editorial-flare">
                            <div className="group relative aspect-square rounded-md overflow-hidden bg-muted">
                                <img
                                    src={newLifestyle5}
                                    alt="Recovery & Flexibility"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-2" data-testid="text-products-title">New Arrivals</h2>
                    <p className="text-muted-foreground">Discover the latest additions to our collection</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {content.products.map((product) => (
                        <ProductCard
                            key={product.id}
                            {...product}
                            onToggleWishlist={handleToggleWishlist}
                            isWishlisted={wishlist.has(product.id)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}