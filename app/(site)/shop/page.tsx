"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";

const products = [
    {
        id: "1",
        name: "1st Rep Classic Tshirt - Iron Grey",
        price: 22.0,
        originalPrice: 22.0,
        image: "https://1strep.com/cdn/shop/files/IMG_5881.jpg?v=1758281862",
        category: "Men",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Iron Grey", "Black", "White"],
        isNew: false,
    },
    {
        id: "2",
        name: "1st Rep Classic Hoodie - All Colours",
        price: 40.0,
        originalPrice: 40.0,
        image: "https://1strep.com/cdn/shop/files/IMG_5960.jpg?v=1758570983",
        category: "Men",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Grey", "Navy", "White"],
        isNew: true,
    },
    {
        id: "3",
        name: "High Neck Sports Bra - Hot Pink",
        price: 30.0,
        originalPrice: 30.0,
        image: "https://1strep.com/cdn/shop/files/3F0354B7-C772-4FD5-8923-4427A8BDCF71.png?v=1758570861",
        category: "Women",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Hot Pink", "Black", "Rust"],
        isNew: false,
    },
    {
        id: "4",
        name: "High Neck Sports Bra - Black",
        price: 30.0,
        originalPrice: 30.0,
        image: "https://1strep.com/cdn/shop/files/527FA8AD-D198-494C-9CC5-11D9CC627A1D.png?v=1758570859",
        category: "Women",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Hot Pink", "Rust"],
        isNew: false,
    },
    {
        id: "5",
        name: "1st Rep Organic Cropped Tank - Light Pink",
        price: 25.0,
        originalPrice: 25.0,
        image: "https://1strep.com/cdn/shop/files/2490119E-8AC3-4CB0-BD72-5F3041DC76E9.jpg?v=1758576696",
        category: "Women",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Light Pink", "Stone", "Black"],
        isNew: true,
    },
    {
        id: "6",
        name: "1st Rep Cropped Tshirt - Peppermint",
        price: 28.0,
        originalPrice: 28.0,
        image: "https://1strep.com/cdn/shop/files/IMG_6066.jpg?v=1758280627",
        category: "Women",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Peppermint", "Black", "White"],
        isNew: false,
    },
    {
        id: "7",
        name: "1st Rep Hoodie - Lime",
        price: 55.0,
        originalPrice: 55.0,
        image: "https://1strep.com/cdn/shop/files/DSC03051.jpg?v=1758276177",
        category: "Men",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Lime", "Black", "Navy"],
        isNew: true,
    },
    {
        id: "8",
        name: "1st Rep Classic Tank",
        price: 25.0,
        originalPrice: 25.0,
        image: "https://1strep.com/cdn/shop/files/DSC02328.jpg?v=1758279110",
        category: "Men",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Grey"],
        isNew: false,
    },
    {
        id: "9",
        name: "1st Rep Rainbow Back Tshirt",
        price: 22.0,
        originalPrice: 22.0,
        image: "https://1strep.com/cdn/shop/files/IMG_5925.jpg?v=1758281535",
        category: "Men",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White"],
        isNew: false,
    },
    {
        id: "10",
        name: "1st Rep Batwing Jacket",
        price: 38.0,
        originalPrice: 38.0,
        image: "https://1strep.com/cdn/shop/files/IMG_7015.jpg?v=1758278396",
        category: "Women",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Navy", "Grey"],
        isNew: false,
    },
    {
        id: "11",
        name: "High Impact Sports Bra - Black",
        price: 30.0,
        originalPrice: 30.0,
        image: "https://1strep.com/cdn/shop/files/538995D6-06FC-404B-91CF-C6A9453D3884.png?v=1758570913",
        category: "Women",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Blue"],
        isNew: false,
    },
    {
        id: "12",
        name: "FrostFit Bobble Hat",
        price: 18.0,
        originalPrice: 18.0,
        image: "https://1strep.com/cdn/shop/files/AB3F1B62-BDE9-4244-9994-6D2D6D95487B.jpg?v=1758832877",
        category: "Accessories",
        sizes: ["One Size"],
        colors: ["Black", "Grey", "Navy"],
        isNew: true,
    },
];

export default function ShopPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("featured");
    const { addToCart } = useCart();

    const categories = ["all", "Men", "Women", "Accessories"];
    const sortOptions = [
        { value: "featured", label: "Featured" },
        { value: "price-low", label: "Price: Low to High" },
        { value: "price-high", label: "Price: High to Low" },
        { value: "newest", label: "Newest" },
    ];

    const filteredProducts = products
        .filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "newest":
                    return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
                default:
                    return 0;
            }
        });

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-8 text-center space-y-4">
                    <h1 className="text-4xl font-bold">Shop 1stRep</h1>
                    <p className="text-muted-foreground text-lg">
                        Performance range designed for athletes who never settle for ordinary
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category === "all" ? "All Categories" : category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Results Count */}
                <p className="text-muted-foreground mb-6">
                    Showing {filteredProducts.length} of {products.length} products
                    {selectedCategory !== "all" && ` in ${selectedCategory}`}
                    {searchQuery && ` for "${searchQuery}"`}
                </p>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("all");
                                setSortBy("featured");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}

                {/* Call to Action */}
                <div className="mt-16 text-center bg-primary/5 border border-primary/20 rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
                    <p className="text-muted-foreground mb-6">
                        Contact our team for custom orders or specific size requirements.
                    </p>
                    <Button variant="outline" onClick={() => (window.location.href = "mailto:info@1strep.com")}>
                        Contact Us
                    </Button>
                </div>
            </div>
        </div>
    );
}
