import { useState } from 'react';
import { ShoppingCart, Search, Menu, X, Heart, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { useCart } from '@/contexts/CartContext';

// ✅ Remove onCartClick prop - use context instead
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setTheme } = useTheme();
  const { totalItems, openCart } = useCart(); // ✅ Get openCart from context

  const categories = [
    { name: 'New In', href: '/editorial', id: null },
    { name: 'Training', href: '/collection/training', id: 'training' as const },
    { name: 'Yoga', href: '/collection/yoga', id: 'yoga' as const },
    { name: 'Running', href: '/collection/running', id: 'running' as const },
    { name: 'Studio', href: '/collection/studio', id: 'studio' as const },
    { name: 'Sale', href: '#', id: null },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/" className="text-2xl font-bold tracking-tight cursor-pointer hover:text-primary transition-colors" data-testid="text-logo">
              1strep
            </Link>

            <nav className="hidden lg:flex items-center gap-6" data-testid="nav-desktop">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-sm font-medium tracking-wide uppercase hover-elevate px-3 py-2 rounded-md transition-colors"
                  data-testid={`link-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    if (category.id) setTheme(category.id);
                    console.log(`Navigated to ${category.name}`);
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" data-testid="button-search">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-account">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-wishlist">
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart} // ✅ Use context function directly
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center" data-testid="text-cart-count">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t" data-testid="nav-mobile">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="block w-full text-left px-4 py-3 text-sm font-medium uppercase hover-elevate rounded-md transition-colors"
                data-testid={`link-mobile-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  if (category.id) setTheme(category.id);
                  setMobileMenuOpen(false);
                  console.log(`Navigated to ${category.name}`);
                }}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}