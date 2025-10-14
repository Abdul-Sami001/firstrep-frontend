"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heart, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  colors?: string[];
  sizes?: string[];
}

export default function ProductCard({ 
  id, 
  name, 
  price, 
  originalPrice, 
  image, 
  category, 
  isNew = false,
  colors = [],
  sizes = []
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0] || "Black");
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "M");
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Card className="group relative overflow-hidden hover-elevate border-card-border bg-card" data-testid={`product-card-${id}`}>
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`product-image-${id}`}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-primary text-primary-foreground" data-testid={`badge-new-${id}`}>
              NEW
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive" data-testid={`badge-discount-${id}`}>
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
          onClick={() => {
            setIsWishlisted(!isWishlisted);
            console.log(`Product ${id} wishlist toggled: ${!isWishlisted}`);
          }}
          data-testid={`button-wishlist-${id}`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
        </Button>

        {/* Quick Add Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => {
              console.log('Quick Add clicked for product:', { id, name, selectedSize, selectedColor });
              addToCart({
                id,
                name,
                price,
                size: selectedSize,
                color: selectedColor,
                image,
                category
              });
              console.log('Item added to cart successfully');
              toast({
                title: "Added to cart",
                description: `${name} (${selectedColor}, ${selectedSize}) added to your cart.`,
              });
            }}
            data-testid={`button-quick-add-${id}`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <p className="text-sm text-muted-foreground uppercase tracking-wide" data-testid={`product-category-${id}`}>
          {category}
        </p>

        {/* Name */}
        <h3 className="font-semibold text-lg leading-tight" data-testid={`product-name-${id}`}>
          {name}
        </h3>

        {/* Colors */}
        {colors.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Colors:</span>
            <div className="flex gap-1">
              {colors.map((color, index) => (
                <button
                  key={color}
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedColor === color ? 'border-primary' : 'border-muted'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setSelectedColor(color);
                    console.log(`Selected color: ${color} for product ${id}`);
                  }}
                  data-testid={`color-${color}-${id}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sizes:</span>
            <div className="flex gap-1">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`px-2 py-1 text-xs border rounded ${
                    selectedSize === size 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : 'border-muted hover:border-primary'
                  }`}
                  onClick={() => {
                    setSelectedSize(size);
                  }}
                  data-testid={`size-${size}-${id}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold" data-testid={`product-price-${id}`}>
              £{price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through" data-testid={`product-original-price-${id}`}>
                £{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}