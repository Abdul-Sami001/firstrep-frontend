import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import CategorySection from "@/components/CategorySection";
import FeatureSection from "@/components/FeatureSection";

export default function HomePage() {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <ProductGrid
                title="Featured Products"
                subtitle="Discover our latest collection of performance-engineered fitness apparel"
            />
            <CategorySection />
            <FeatureSection />
        </div>
    );
}
