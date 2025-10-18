// app/(site)/Collections/page.tsx - Mobile-First Responsive Design
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, SlidersHorizontal, Grid3x3, List, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { useTheme } from '@/components/ThemeProvider';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Import images
// Import hero/banner images
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

// Import video backgrounds
const trainingVideo = '/attached_assets/148208-793717949_small_1760255538521.mp4';
const yogaVideo = '/attached_assets/189730-886596151_small_1760255538521.mp4';
const runningVideo = '/attached_assets/istockphoto-1410441629-640_adpp_is_1760255538522.mp4';
const studioVideo = '/attached_assets/istockphoto-2187361158-640_adpp_is_1760255538522.mp4';

const collectionHeroImages = {
    'training': trainingHero,
    'yoga': yogaHero,
    'running': runningHero,
    'studio': studioHero,
};

const collectionHeroVideos = {
    'training': trainingVideo,
    'yoga': yogaVideo,
    'running': runningVideo,
    'studio': studioVideo,
};

const collectionProducts = {
    'training': [
        { id: 'train-1', name: 'Power Leggings', price: 89.99, image: trainProduct1, hoverImage: trainProduct3, category: 'Bottoms' },
        { id: 'train-2', name: 'Strength Sports Bra', price: 52.99, image: trainProduct2, hoverImage: trainProduct1, category: 'Bras' },
        { id: 'train-3', name: 'Training Crossback Bra', price: 64.99, image: trainProduct3, hoverImage: trainProduct2, category: 'Bras' },
        { id: 'train-4', name: 'Training Essential Set', price: 149.99, image: trainProduct4, hoverImage: trainProduct1, category: 'Sets' },
        { id: 'train-5', name: 'Pro Compression Tights', price: 95.99, image: trainProduct1, hoverImage: trainProduct2, category: 'Bottoms' },
        { id: 'train-6', name: 'High Impact Sports Bra', price: 68.99, image: trainProduct3, hoverImage: trainProduct4, category: 'Bras' },
        { id: 'train-7', name: 'Strength Crop Top', price: 44.99, image: trainProduct2, hoverImage: trainProduct3, category: 'Tops' },
        { id: 'train-8', name: 'Weightlifting Shorts', price: 56.99, image: trainProduct4, hoverImage: trainProduct1, category: 'Bottoms' },
    ],
    'yoga': [
        { id: 'yoga-1', name: 'Yoga Leggings', price: 89.99, image: yogaProduct1, hoverImage: yogaProduct3, category: 'Bottoms' },
        { id: 'yoga-2', name: 'Flow Crop Top', price: 48.99, image: yogaProduct2, hoverImage: yogaProduct1, category: 'Tops' },
        { id: 'yoga-3', name: 'Soft Bra', price: 42.99, image: yogaProduct3, hoverImage: yogaProduct2, category: 'Bras' },
        { id: 'yoga-4', name: 'Relaxed Hoodie', price: 92.99, image: yogaProduct4, hoverImage: yogaProduct1, category: 'Outerwear' },
        { id: 'yoga-5', name: 'Mindful Meditation Pants', price: 78.99, image: yogaProduct1, hoverImage: yogaProduct4, category: 'Bottoms' },
        { id: 'yoga-6', name: 'Zen Tank Top', price: 39.99, image: yogaProduct2, hoverImage: yogaProduct3, category: 'Tops' },
        { id: 'yoga-7', name: 'Flow Shorts', price: 54.99, image: yogaProduct3, hoverImage: yogaProduct1, category: 'Bottoms' },
        { id: 'yoga-8', name: 'Cozy Wrap Sweater', price: 108.99, image: yogaProduct4, hoverImage: yogaProduct2, category: 'Outerwear' },
    ],
    'running': [
        { id: 'run-1', name: 'Running Tights', price: 79.99, image: runProduct1, hoverImage: runProduct3, category: 'Bottoms' },
        { id: 'run-2', name: 'Speed Tank', price: 39.99, image: runProduct2, hoverImage: runProduct1, category: 'Tops' },
        { id: 'run-3', name: 'Running Shorts', price: 49.99, image: runProduct3, hoverImage: runProduct2, category: 'Bottoms' },
        { id: 'run-4', name: 'Wind Jacket', price: 119.99, image: runProduct4, hoverImage: runProduct1, category: 'Outerwear' },
        { id: 'run-5', name: 'Marathon Leggings', price: 84.99, image: runProduct1, hoverImage: runProduct4, category: 'Bottoms' },
        { id: 'run-6', name: 'Breathable Running Bra', price: 46.99, image: runProduct2, hoverImage: runProduct3, category: 'Bras' },
        { id: 'run-7', name: 'Performance Singlet', price: 34.99, image: runProduct3, hoverImage: runProduct1, category: 'Tops' },
        { id: 'run-8', name: 'Weather Shield Jacket', price: 138.99, image: runProduct4, hoverImage: runProduct2, category: 'Outerwear' },
    ],
    'studio': [
        { id: 'studio-1', name: 'Studio Leggings', price: 84.99, image: studioProduct1, hoverImage: studioProduct3, category: 'Bottoms' },
        { id: 'studio-2', name: 'Crossback Bra', price: 58.99, image: studioProduct2, hoverImage: studioProduct1, category: 'Bras' },
        { id: 'studio-3', name: 'Cropped Tank', price: 44.99, image: studioProduct3, hoverImage: studioProduct2, category: 'Tops' },
        { id: 'studio-4', name: 'Studio Jacket', price: 98.99, image: studioProduct4, hoverImage: studioProduct1, category: 'Outerwear' },
        { id: 'studio-5', name: 'Pilates Capri', price: 76.99, image: studioProduct1, hoverImage: studioProduct4, category: 'Bottoms' },
        { id: 'studio-6', name: 'Support Bra', price: 62.99, image: studioProduct2, hoverImage: studioProduct3, category: 'Bras' },
        { id: 'studio-7', name: 'Studio Wrap Top', price: 52.99, image: studioProduct3, hoverImage: studioProduct1, category: 'Tops' },
        { id: 'studio-8', name: 'Warm-Up Hoodie', price: 104.99, image: studioProduct4, hoverImage: studioProduct2, category: 'Outerwear' },
    ],
};

const collectionFeatures = {
    'training': {
        title: 'Engineered for Performance',
        subtitle: 'Designed to elevate your strength training',
        features: [
            { title: 'Compression Technology', description: 'Muscle support and enhanced blood flow during intense workouts' },
            { title: 'Moisture Management', description: 'Advanced fabrics that keep you dry and comfortable' },
            { title: 'Squat-Proof Design', description: 'Tested and proven to stay opaque through every movement' },
            { title: 'Four-Way Stretch', description: 'Unrestricted movement for maximum performance' }
        ]
    },
    'yoga': {
        title: 'Move with Intention',
        subtitle: 'Soft, breathable fabrics for mindful practice',
        features: [
            { title: 'Buttery Soft Fabric', description: 'Luxurious feel against your skin during every pose' },
            { title: 'High-Waisted Comfort', description: 'Stay-put waistbands that move with you' },
            { title: 'Eco-Friendly Materials', description: 'Sustainable fabrics for conscious practice' },
            { title: 'Seamless Construction', description: 'No chafing, just pure comfort' }
        ]
    },
    'running': {
        title: 'Built for Speed',
        subtitle: 'Lightweight gear designed for runners',
        features: [
            { title: 'Lightweight Fabrics', description: 'Barely-there feel that won\'t slow you down' },
            { title: 'Reflective Details', description: 'Stay visible during early morning or evening runs' },
            { title: 'Strategic Ventilation', description: 'Breathable mesh panels where you need them most' },
            { title: 'Anti-Chafe Technology', description: 'Flatlock seams prevent irritation on long runs' }
        ]
    },
    'studio': {
        title: 'Versatility Meets Style',
        subtitle: 'Essential pieces for every fitness class',
        features: [
            { title: 'All-Day Comfort', description: 'Transition seamlessly from studio to street' },
            { title: 'Moisture-Wicking', description: 'Stay fresh through back-to-back classes' },
            { title: 'Medium Support', description: 'Perfect balance for varied movements' },
            { title: 'Stylish Details', description: 'Fashion-forward designs you\'ll love to wear' }
        ]
    }
};

export default function CollectionPage() {
    const params = useParams();
    const collectionName = (params?.name as string) || 'training';
    const { setTheme } = useTheme();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState('newest');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const products = collectionProducts[collectionName as keyof typeof collectionProducts] || [];
    const heroImage = collectionHeroImages[collectionName as keyof typeof collectionHeroImages];
    const heroVideo = collectionHeroVideos[collectionName as keyof typeof collectionHeroVideos];
    const features = collectionFeatures[collectionName as keyof typeof collectionFeatures];

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

    useEffect(() => {
        setTheme(collectionName as any);
    }, [collectionName, setTheme]);

    return (
        <div className="min-h-screen">
            {/* Mobile-First Breadcrumb */}
            <div className="border-b bg-background">
                <div className="mobile-container tablet-container desktop-container">
                    <div className="py-3">
                        <div className="text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-foreground transition-colors" data-testid="link-home">
                                Home
                            </Link>
                            <span className="mx-2">/</span>
                            <span className="capitalize font-medium" data-testid="text-breadcrumb">
                                {collectionName}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile-First Hero Banner */}
            <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] min-h-[300px] md:min-h-[400px] lg:min-h-[500px] overflow-hidden">
                {heroVideo ? (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={heroVideo} type="video/mp4" />
                    </video>
                ) : (
                    <Image
                        src={heroImage}
                        alt={`${collectionName} collection`}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority={true}
                        quality={85}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
                <div className="mobile-container tablet-container desktop-container text-center relative z-10 h-full flex items-center justify-center">
                    <div className="max-w-3xl">
                        <h1 className="text-mobile-h1 md:text-tablet-h1 lg:text-desktop-h1 font-bold mb-4 capitalize text-white" data-testid="text-collection-title">
                            {collectionName}
                        </h1>
                        <p className="text-sm md:text-base lg:text-lg text-white/90 max-w-2xl mx-auto">
                            Discover our premium {collectionName} collection designed for performance and style
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile-First Features Section */}
            <div className="bg-muted/30 py-8 md:py-12 lg:py-16">
                <div className="mobile-container tablet-container desktop-container">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-mobile-h2 md:text-tablet-h2 lg:text-desktop-h2 font-bold mb-3">
                            {features.title}
                        </h2>
                        <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                            {features.subtitle}
                        </p>
                    </div>
                    <div className="grid grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop gap-mobile md:gap-tablet lg:gap-desktop">
                        {features.features.map((feature, index) => (
                            <div key={index} className="text-center p-4 md:p-6 bg-background rounded-lg shadow-sm">
                                <h3 className="font-semibold mb-2 text-sm md:text-base lg:text-lg">
                                    {feature.title}
                                </h3>
                                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile-First Filters & Sorting Bar */}
            <div className="sticky top-16 z-40 bg-background border-b shadow-sm">
                <div className="mobile-container tablet-container desktop-container">
                    <div className="py-4">

                        {/* Mobile Filter Toggle */}
                        <div className="flex items-center justify-between mb-4 md:hidden">
                            <Button
                                variant="outline"
                                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                                className="flex-1 mr-2 touch-target"
                                data-testid="button-mobile-filters"
                            >
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Filters & Sort
                                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
                            </Button>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="icon"
                                    onClick={() => setViewMode('grid')}
                                    className="touch-target-sm"
                                    data-testid="button-grid-view"
                                >
                                    <Grid3x3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="icon"
                                    onClick={() => setViewMode('list')}
                                    className="touch-target-sm"
                                    data-testid="button-list-view"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Filters Panel */}
                        {mobileFiltersOpen && (
                            <div className="md:hidden mb-4 p-4 bg-muted/50 rounded-lg space-y-4">
                                {/* Category Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Category</label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between touch-target" data-testid="button-mobile-filter">
                                                {selectedCategory === 'all' ? 'All Products' : selectedCategory}
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-full">
                                            {categories.map((cat) => (
                                                <DropdownMenuItem
                                                    key={cat}
                                                    onClick={() => setSelectedCategory(cat)}
                                                    data-testid={`mobile-filter-${cat}`}
                                                >
                                                    {cat === 'all' ? 'All Products' : cat}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Sort Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between touch-target" data-testid="button-mobile-sort">
                                                {sortBy}
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-full">
                                            <DropdownMenuItem onClick={() => setSortBy('newest')} data-testid="mobile-sort-newest">Newest</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSortBy('price-low')} data-testid="mobile-sort-price-low">Price: Low to High</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSortBy('price-high')} data-testid="mobile-sort-price-high">Price: High to Low</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSortBy('popular')} data-testid="mobile-sort-popular">Most Popular</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Product Count */}
                                <div className="text-center">
                                    <span className="text-sm text-muted-foreground" data-testid="text-mobile-product-count">
                                        {filteredProducts.length} products
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Desktop Filters */}
                        <div className="hidden md:flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-wrap">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" data-testid="button-filter">
                                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                                            Filter
                                            <ChevronDown className="h-4 w-4 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {categories.map((cat) => (
                                            <DropdownMenuItem
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                data-testid={`filter-${cat}`}
                                            >
                                                {cat === 'all' ? 'All Products' : cat}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" data-testid="button-sort">
                                            Sort: {sortBy}
                                            <ChevronDown className="h-4 w-4 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem onClick={() => setSortBy('newest')} data-testid="sort-newest">Newest</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSortBy('price-low')} data-testid="sort-price-low">Price: Low to High</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSortBy('price-high')} data-testid="sort-price-high">Price: High to Low</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSortBy('popular')} data-testid="sort-popular">Most Popular</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <span className="text-sm text-muted-foreground" data-testid="text-product-count">
                                    {filteredProducts.length} products
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="icon"
                                    onClick={() => setViewMode('grid')}
                                    data-testid="button-grid-view"
                                >
                                    <Grid3x3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="icon"
                                    onClick={() => setViewMode('list')}
                                    data-testid="button-list-view"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile-First Products Grid */}
            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                <div className={`grid gap-mobile md:gap-tablet lg:gap-desktop ${viewMode === 'grid'
                    ? 'grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop'
                    : 'grid-cols-1'
                    }`}>
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={{
                                ...product,
                                category: collectionName
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile-First Collection Story Section */}
            <div className="border-t bg-muted/20">
                <div className="mobile-container tablet-container desktop-container py-8 md:py-12 lg:py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-mobile-h2 md:text-tablet-h2 lg:text-desktop-h2 font-bold mb-6 capitalize">
                            The {collectionName} Collection
                        </h2>
                        <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                            {collectionName === 'training' && (
                                <>
                                    <p>
                                        Our Training collection is engineered for those who push their limits. Every piece is designed with performance in mind,
                                        featuring advanced compression technology that supports your muscles during the most intense workouts.
                                    </p>
                                    <p>
                                        From heavy lifting to HIIT sessions, our squat-proof fabrics and moisture-wicking technology ensure you stay comfortable
                                        and confident. The four-way stretch construction moves with your body, never against it.
                                    </p>
                                </>
                            )}
                            {collectionName === 'yoga' && (
                                <>
                                    <p>
                                        The Yoga collection embodies mindful movement. Crafted from buttery-soft, sustainable fabrics, each piece feels like
                                        a second skin. Our high-waisted designs stay in place through every vinyasa, warrior, and savasana.
                                    </p>
                                    <p>
                                        Experience the perfect balance of support and freedom. Seamless construction eliminates distractions, allowing you to
                                        focus on your breath and practice. From studio to street, these versatile pieces transition effortlessly.
                                    </p>
                                </>
                            )}
                            {collectionName === 'running' && (
                                <>
                                    <p>
                                        Built for runners by runners. Our Running collection combines lightweight, breathable fabrics with strategic ventilation
                                        to keep you cool on long distances. Reflective details ensure visibility during early morning or evening runs.
                                    </p>
                                    <p>
                                        Anti-chafe technology and flatlock seams mean no irritation, even on your longest runs. Every piece is designed to move
                                        with you, providing support without restriction. Run faster, go farther in comfort.
                                    </p>
                                </>
                            )}
                            {collectionName === 'studio' && (
                                <>
                                    <p>
                                        The Studio collection is your versatile fitness companion. Designed for every class on your schedule - from Pilates to
                                        barre to dance cardio. Medium-support pieces adapt to varied movements while keeping you comfortable.
                                    </p>
                                    <p>
                                        Fashion meets function with stylish details that transition seamlessly from studio to street. Moisture-wicking fabrics
                                        keep you fresh through back-to-back classes. All-day comfort for your active lifestyle.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}