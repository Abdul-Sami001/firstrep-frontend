// components/Header.tsx - Fixed Mobile-First Responsive Design
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Heart, User, LogOut, Settings, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useUserProfile } from '@/hooks/useAuth';
import { SearchDialog } from '@/components/SearchDialog';
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
  const [searchOpen, setSearchOpen] = useState(false);
  const { setTheme } = useTheme();
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems: wishlistItems } = useWishlist();

  // Get user profile for additional info (only when authenticated)
  const { data: profile } = useUserProfile(isAuthenticated);

  const navigationItems = [
    { name: 'ACTIVE RANGE', href: '/shop-clean', id: null },
    { name: '1R COLLECTION', href: '/shop-clean?collection=1R', id: null },
    { name: 'RESELLERS', href: '/ResellerLogin', id: null },
    { name: 'ABOUT US', href: '/about', id: null },
  ];

  const handleUserClick = () => {
    if (!isAuthenticated) {
      router.push('/CustomerLogin');
    }
  };

  const handleResellerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Check if reseller is logged in (check for reseller_token in localStorage)
    const resellerToken = typeof window !== 'undefined' ? localStorage.getItem('reseller_token') : null;
    if (resellerToken) {
      // Already logged in as reseller, go to dashboard
      router.push('/ResellerDashboard');
    } else {
      // Not logged in, go to login page
      router.push('/ResellerLogin');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#000000] border-b border-gray-800">
      {/* Mobile-First Container */}
      <div className="mobile-container tablet-container desktop-container">

        {/* Mobile-First Header Layout */}
        <div className="flex items-center justify-between h-mobile-header md:h-tablet-header lg:h-desktop-header">

          {/* Left Side: Mobile Menu Button + Logo */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 lg:-ml-4 xl:-ml-6">
            {/* Mobile Menu Button - Only on Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden touch-target p-2 -ml-2 text-white"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo - Left Side on All Screens */}
            <Link
              href="/"
              className="flex items-center h-full cursor-pointer hover:opacity-80 transition-opacity"
              data-testid="logo"
            >
              <Image
                src="/logo.png"
                alt="1stRep"
                width={180}
                height={60}
                className="h-8 md:h-10 lg:h-14 xl:h-16 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation - Centered */}
          <div className="hidden lg:flex flex-1 items-center justify-center h-full">
            <nav className="flex items-center justify-center gap-6 xl:gap-8 h-full" data-testid="nav-desktop">
              {navigationItems.map((item) => {
                // Special handling for RESELLERS link
                if (item.name === 'RESELLERS') {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={handleResellerClick}
                      className="text-sm font-semibold tracking-wide uppercase text-white hover:opacity-80 transition-opacity touch-target flex items-center font-poppins cursor-pointer"
                      data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item.name}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold tracking-wide uppercase text-white hover:opacity-80 transition-opacity touch-target flex items-center font-poppins"
                    data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => {
                      if (item.id) setTheme(item.id);
                    }}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side: Action Icons - Mobile Optimized */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Search - Hidden on very small screens */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex touch-target-sm text-white hover:bg-gray-800 hover:text-white"
              data-testid="button-search"
              onClick={() => setSearchOpen(true)}
              suppressHydrationWarning
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
                    className="touch-target-sm text-white hover:bg-gray-800 hover:text-white"
                    data-testid="button-account"
                    suppressHydrationWarning
                  >
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                      <AvatarImage src={profile?.avatar || undefined} alt={user?.first_name || 'User'} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm font-semibold">
                        {user?.first_name?.[0] || ''}{user?.last_name?.[0] || ''}
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
                      {user?.first_name || ''} {user?.last_name || ''}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
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
                  <DropdownMenuItem onClick={() => router.push('/support')}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Support
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
                className="touch-target-sm text-white hover:bg-gray-800 hover:text-white"
                data-testid="button-account"
                suppressHydrationWarning
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}

            

            {/* Cart - Mobile Optimized */}
            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative touch-target-sm text-white hover:bg-gray-800 hover:text-white"
              asChild
            >
              <Link href="/wishlist" data-testid="button-wishlist" suppressHydrationWarning>
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-white text-black text-xs flex items-center justify-center font-semibold" data-testid="text-wishlist-count">
                    {wishlistItems > 99 ? '99+' : wishlistItems}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative touch-target-sm text-white hover:bg-gray-800 hover:text-white"
              onClick={openCart}
              data-testid="button-cart"
              suppressHydrationWarning
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-white text-black text-xs flex items-center justify-center font-semibold" data-testid="text-cart-count">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Full Width */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-800" data-testid="nav-mobile">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                // Special handling for RESELLERS link
                if (item.name === 'RESELLERS') {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleResellerClick(e);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm font-medium uppercase text-white hover:bg-gray-800 transition-colors touch-target cursor-pointer"
                      data-testid={`link-mobile-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item.name}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block w-full text-left px-4 py-3 text-sm font-medium uppercase text-white hover:bg-gray-800 transition-colors touch-target"
                    data-testid={`link-mobile-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => {
                      if (item.id) setTheme(item.id);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile Search - Full Width */}
              <div className="px-4 py-2">
                <Button
                  variant="outline"
                  className="w-full justify-start touch-target border-gray-700 text-white hover:bg-gray-800 hover:text-white"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
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

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}