'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Activity, Sparkles, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Import images
// Import product images - Training
const trainProduct1 = '/attached_assets/M3012182333-b_1760252501219.webp';
const trainProduct2 = '/attached_assets/M3012182555-a7_1760252505983.webp';
const trainProduct3 = '/attached_assets/34121822709-07-m1_1760252514562.webp';
const trainProduct4 = '/attached_assets/34121822709-07-a16_1760252516609.webp';
const trainProduct5 = '/attached_assets/M3012182888-a7_1760252512712.webp';

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

// Import lifestyle/in-action images
import lifestyleJackets from '@assets/jackets_20251009_1760253383147.webp';
import lifestyleSweatshirts from '@assets/sweatshirts_20251009_1760253386825.webp';
import lifestyleKnitwear from '@assets/knitwear_20251009_1760253390566.webp';
import lifestyleBorreguito from '@assets/borreguito_20251009_1760253393745.webp';
import lifestyleActivity from '@assets/by-activity_l_20251009_1760253399000.webp';

const productData: Record<string, any> = {
    // Training Collection
    'train-1': {
        name: 'Power Leggings',
        price: 89.99,
        description: 'High-performance training leggings engineered for strength workouts. Features compression support and a sleek, sculpting fit.',
        images: [trainProduct1, trainProduct5, trainProduct1],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Chocolate', 'Black', 'Olive'],
        details: ['Compression fit', 'High-waisted design', 'Squat-proof fabric', 'Moisture-wicking technology', '78% Nylon, 22% Spandex'],
        category: 'Training',
        collection: 'training'
    },
    'train-2': {
        name: 'Strength Sports Bra',
        price: 52.99,
        description: 'High-support sports bra designed for intense training sessions. Features compression fit and breathable fabric.',
        images: [trainProduct2, trainProduct2, trainProduct5],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Chocolate', 'Black', 'Charcoal'],
        details: ['High-impact support', 'Compression design', 'Moisture-wicking fabric', 'Racerback style', '85% Polyamide, 15% Elastane'],
        category: 'Training',
        collection: 'training'
    },
    // Add more products as needed...
    'yoga-1': {
        name: 'Yoga Leggings',
        price: 89.99,
        description: 'High-waisted yoga leggings crafted from our signature soft-touch fabric. Perfect for yoga, Pilates, and everyday comfort.',
        images: [yogaProduct1, yogaProduct1, yogaProduct1],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy', 'Dusty Rose'],
        details: ['High-waisted design', 'Four-way stretch fabric', 'Moisture-wicking technology', 'Hidden pocket for essentials', '75% Polyamide, 25% Elastane'],
        category: 'Yoga',
        collection: 'yoga'
    },
    // Add more products...
};

const relatedProducts = [
    { id: 'yoga-2', name: 'Flow Crop Top', price: 48.99, image: yogaProduct2, hoverImage: yogaProduct1 },
    { id: 'yoga-3', name: 'Soft Bra', price: 42.99, image: yogaProduct3, hoverImage: yogaProduct2 },
    { id: 'yoga-4', name: 'Relaxed Hoodie', price: 92.99, image: yogaProduct4, hoverImage: yogaProduct1 },
    { id: 'run-1', name: 'Running Tights', price: 79.99, image: runProduct1, hoverImage: runProduct3 },
];

export default function ProductDetailPage() {
    const params = useParams();
    const productId = (params?.id as string) || 'yoga-1';
    const product = productData[productId];

    // Handle invalid product ID
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                    <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
                    <Link href="/">
                        <Button>Return Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    return (
        <div>
            {/* Breadcrumb */}
            <div className="border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground" data-testid="link-home">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href={`/Collections/${product.collection}`} className="hover:text-foreground capitalize" data-testid="link-collection">
                            {product.collection}
                        </Link>
                        <span className="mx-2">/</span>
                        <span data-testid="text-product-name">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-[3/4] bg-muted rounded-md overflow-hidden">
                            <img
                                src={product.images[currentImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />

                            {product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover-elevate"
                                        data-testid="button-prev-image"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover-elevate"
                                        data-testid="button-next-image"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Navigation */}
                        <div className="flex gap-2">
                            {product.images.map((img: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`flex-1 aspect-square rounded-md overflow-hidden border-2 ${currentImageIndex === index ? 'border-primary' : 'border-transparent'
                                        }`}
                                    data-testid={`thumbnail-${index}`}
                                >
                                    <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2" data-testid="text-product-title">{product.name}</h1>
                            <p className="text-2xl font-semibold" data-testid="text-product-price">${product.price.toFixed(2)}</p>
                        </div>

                        <p className="text-muted-foreground" data-testid="text-product-description">
                            {product.description}
                        </p>

                        {/* Color Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Color: {selectedColor}</label>
                            <div className="flex gap-2">
                                {product.colors.map((color: string) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 border rounded-md text-sm ${selectedColor === color ? 'border-primary bg-primary/10' : 'border-border'
                                            } hover-elevate`}
                                        data-testid={`color-${color.toLowerCase().replace(/\s+/g, '-')}`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Size</label>
                            <Select value={selectedSize} onValueChange={setSelectedSize}>
                                <SelectTrigger data-testid="select-size">
                                    <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {product.sizes.map((size: string) => (
                                        <SelectItem key={size} value={size} data-testid={`size-${size}`}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Add to Cart & Wishlist */}
                        <div className="flex gap-3">
                            <Button
                                size="lg"
                                className="flex-1"
                                onClick={() => console.log('Added to cart')}
                                data-testid="button-add-to-cart"
                            >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Add to Cart
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => {
                                    setIsWishlisted(!isWishlisted);
                                    console.log('Wishlist toggled');
                                }}
                                data-testid="button-add-to-wishlist"
                            >
                                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current text-destructive' : ''}`} />
                            </Button>
                        </div>

                        {/* Product Details */}
                        <div className="border-t pt-6">
                            <h3 className="font-semibold mb-4">Product Details</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {product.details.map((detail: string, index: number) => (
                                    <li key={index} className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Care Instructions */}
                        <div className="border-t pt-6">
                            <h3 className="font-semibold mb-4">Care Instructions</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Machine wash cold with like colors</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Do not bleach or use fabric softener</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Tumble dry low or hang to dry</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Do not iron or dry clean</span>
                                </li>
                            </ul>
                        </div>

                        {/* Shipping & Returns */}
                        <div className="border-t pt-6">
                            <h3 className="font-semibold mb-4">Shipping & Returns</h3>
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <p>Free standard shipping on orders over $100. Express shipping available at checkout.</p>
                                <p>30-day returns and exchanges. Items must be unworn with tags attached.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-20">
                    <h2 className="text-2xl font-bold mb-8" data-testid="text-related-title">Complete the Look</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}