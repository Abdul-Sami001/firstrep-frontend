import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function EditorialPage() {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-screen">
                <Image
                    src="/attached_assets/stock_images/minimalist_fitness_l_0c037224.jpg"
                    alt="Spring Summer Collection"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="relative h-full flex items-end justify-center pb-20">
                    <div className="text-center text-white max-w-3xl px-4">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight" data-testid="text-editorial-title">
                            Spring Summer 2025
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-white/90">
                            Move into spring with our latest collection of sustainable activewear
                        </p>
                        <Link href="/Collections/training">
                            <Button
                                size="lg"
                                className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 hover:bg-white/20"
                                data-testid="button-shop-collection"
                            >
                                Shop Collection
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Collections */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12" data-testid="text-featured-title">
                        Featured Collections
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Collection 1 */}
                        <Link href="/Collections/yoga">
                            <div className="group relative aspect-[3/4] rounded-md overflow-hidden hover-elevate cursor-pointer">
                                <Image
                                    src="/attached_assets/stock_images/woman_yoga_meditatio_a9755925.jpg"
                                    alt="Mindful Movement"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-8 left-8 text-white">
                                    <h3 className="text-3xl font-bold mb-2" data-testid="text-collection-1-title">Mindful Movement</h3>
                                    <p className="text-lg text-white/90">Yoga & Pilates Collection</p>
                                </div>
                            </div>
                        </Link>

                        {/* Collection 2 */}
                        <Link href="/Collections/training">
                            <div className="group relative aspect-[3/4] rounded-md overflow-hidden hover-elevate cursor-pointer">
                                <Image
                                    src="/attached_assets/stock_images/woman_training_high__4916fc47.jpg"
                                    alt="Power Training"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-8 left-8 text-white">
                                    <h3 className="text-3xl font-bold mb-2" data-testid="text-collection-2-title">Power Training</h3>
                                    <p className="text-lg text-white/90">High-Performance Gear</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-20 bg-muted">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-6" data-testid="text-philosophy-title">
                        Our Philosophy
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        At 1strep, we believe that movement is medicine. Our collections are designed to support
                        your active lifestyle while respecting the planet. Every piece is crafted with sustainable
                        materials and thoughtful design, so you can move with purpose and style.
                    </p>
                    <Link href="/Collections/studio">
                        <Button variant="outline" size="lg" data-testid="button-discover-more">
                            Discover More
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Shop by Activity */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12" data-testid="text-activity-title">
                        Shop by Activity
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                        {[
                            { name: 'Training', link: '/Collections/training' },
                            { name: 'Yoga', link: '/Collections/yoga' },
                            { name: 'Running', link: '/Collections/running' },
                            { name: 'Studio', link: '/Collections/studio' },
                        ].map((activity) => (
                            <Link key={activity.name} href={activity.link}>
                                <Button
                                    variant="outline"
                                    className="w-full h-20 text-lg"
                                    data-testid={`button-activity-${activity.name.toLowerCase()}`}
                                >
                                    {activity.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}