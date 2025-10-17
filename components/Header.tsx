// components/Header.tsx - Mobile-First Responsive
import { useState } from 'react';
import { ShoppingCart, Search, Menu, X, Heart, User, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setTheme } = useTheme();
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  // Get user profile for additional info
  const { data: profile } = useUserProfile();

  const categories = [
    { name: 'New In', href: '/editorial', id: null },
    { name: 'Training', href: '/collection/training', id: 'training' as const },
    { name: 'Yoga', href: '/collection/yoga', id: 'yoga' as const },
    { name: 'Running', href: '/collection/running', id: 'running' as const },
    { name: 'Studio', href: '/collection/studio', id: 'studio' as const },
    { name: 'Sale', href: '#', id: null },
  ];

  const handleUserClick = () => {
    if (!isAuthenticated) {
      router.push('/CustomerLogin');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto px-4">
        {/* Mobile-First Header Layout */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Mobile Menu Button - Always Visible on Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2"
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo - Mobile Optimized */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold tracking-tight cursor-pointer hover:text-primary transition-colors"
            data-testid="text-logo"
          >
            1strep
          </Link>

          {/* Desktop Navigation - Hidden on Mobile */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6" data-testid="nav-desktop">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="text-sm font-medium tracking-wide uppercase hover-elevate px-2 xl:px-3 py-2 rounded-md transition-colors"
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

          {/* Action Icons - Mobile Optimized */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search - Hidden on very small screens */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex h-9 w-9"
              data-testid="button-search"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* User Account - Mobile-First */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10"
                    data-testid="button-account"
                  >
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                      <AvatarImage src={profile?.avatar} alt={user?.first_name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm font-semibold">
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 sm:w-56"
                  sideOffset={8}
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/orders')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUserClick}
                className="h-9 w-9 sm:h-10 sm:w-10"
                data-testid="button-account"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}

            {/* Wishlist - Always Visible */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
              data-testid="button-wishlist"
            >
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Cart - Mobile Optimized */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 sm:h-10 sm:w-10"
              onClick={openCart}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center" data-testid="text-cart-count">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Full Width */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t" data-testid="nav-mobile">
            <div className="space-y-2">
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

              {/* Mobile Search - Full Width */}
              <div className="px-4 py-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    // Handle search
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search products...
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}