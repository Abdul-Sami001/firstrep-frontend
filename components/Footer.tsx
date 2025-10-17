// components/Footer.tsx - Mobile-First Responsive Design
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-16 md:mt-20">
      {/* Mobile-First Container */}
      <div className="mobile-container tablet-container desktop-container">

        {/* Main Footer Content */}
        <div className="py-8 md:py-12">

          {/* Mobile-First Grid: Stack on Mobile, Multi-column on Desktop */}
          <div className="grid grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop gap-mobile md:gap-tablet lg:gap-desktop mb-8">

            {/* Brand Section - Full Width on Mobile */}
            <div className="lg:col-span-1">
              <h3 className="font-bold text-mobile-h2 md:text-tablet-h2 lg:text-desktop-h2 mb-4" data-testid="text-footer-brand">
                1strep
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6 lg:mb-8">
                Your First Step to Fitness Excellence
              </p>

              {/* Social Links - Mobile Optimized */}
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/1strep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com/1strep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/1strep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://youtube.com/1strep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-youtube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Shop Section */}
            <div>
              <h4 className="font-semibold text-base md:text-lg mb-4">Shop</h4>
              <ul className="space-y-3 text-sm md:text-base text-muted-foreground">
                <li>
                  <Link
                    href="/editorial"
                    className="hover:text-primary transition-colors block py-1"
                  >
                    New In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collection/training"
                    className="hover:text-primary transition-colors block py-1"
                  >
                    Training
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collection/yoga"
                    className="hover:text-primary transition-colors block py-1"
                  >
                    Yoga
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collection/running"
                    className="hover:text-primary transition-colors block py-1"
                  >
                    Running
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collection/studio"
                    className="hover:text-primary transition-colors block py-1"
                  >
                    Studio
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service Section */}
            <div>
              <h4 className="font-semibold text-base md:text-lg mb-4">Support</h4>
              <ul className="space-y-3 text-sm md:text-base text-muted-foreground">
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary transition-colors block py-1"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping-returns"
                    className="hover:text-primary transition-colors block py-1"
                  >
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link
                    href="/size-guide"
                    className="hover:text-primary transition-colors block py-1"
                  >
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-primary transition-colors block py-1"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/track-order"
                    className="hover:text-primary transition-colors block py-1"
                  >
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>

            {/* About Section */}
            <div>
              <h4 className="font-semibold text-base md:text-lg mb-4">About</h4>
              <ul className="space-y-3 text-sm md:text-base text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary transition-colors block py-1"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sustainability"
                    className="hover:text-primary transition-colors block py-1"
                  >
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-primary transition-colors block py-1"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/store-locator"
                    className="hover:text-primary transition-colors block py-1"
                  >
                    Store Locator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Section - Mobile Optimized */}
            <div className="lg:col-span-1">
              <h4 className="font-semibold text-base md:text-lg mb-4">Stay Connected</h4>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Get 10% off your first order + exclusive updates
              </p>

              {/* Mobile-First Newsletter Form */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-touch text-sm md:text-base"
                      data-testid="input-newsletter"
                    />
                  </div>
                  <Button
                    className="h-touch px-6 text-sm md:text-base font-semibold touch-target"
                    data-testid="button-subscribe"
                  >
                    Subscribe
                  </Button>
                </div>

                {/* Mobile-First Privacy Note */}
                <p className="text-xs text-muted-foreground">
                  By subscribing, you agree to our privacy policy. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile-First Divider */}
          <div className="pt-6 md:pt-8 border-t border-border/50">

            {/* Bottom Section - Mobile Stack, Desktop Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">

              {/* Copyright - Mobile First */}
              <div className="text-sm md:text-base text-muted-foreground">
                <p>&copy; 2024 1strep. All rights reserved.</p>
                <p className="mt-1 text-xs md:text-sm">
                  Empowering athletes worldwide since 2024
                </p>
              </div>

              {/* Legal Links - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm md:text-base">
                <Link
                  href="/privacy-policy"
                  className="hover:text-primary transition-colors py-1 touch-target"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="hover:text-primary transition-colors py-1 touch-target"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookies"
                  className="hover:text-primary transition-colors py-1 touch-target"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}