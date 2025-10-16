import { X } from 'lucide-react';
import { useState } from 'react';

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm relative">
      <p data-testid="text-promo">
        Free shipping on orders over $100 | New Collection: Spring Summer 2025
      </p>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2"
        data-testid="button-close-promo"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
