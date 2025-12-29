// components/Footer.tsx - Redesigned to match reference site
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className="bg-[#000000] border-t border-gray-800 mt-16 md:mt-20">
      {/* Mobile-First Container */}
      <div className="mobile-container tablet-container desktop-container">

        {/* Newsletter Signup Section - Centered at Top */}
        <div className="py-8 md:py-12 text-center border-b border-gray-700">
          <div className="max-w-md mx-auto">
            {/* Email Icon */}
            <div className="mb-4 flex justify-center">
              <Mail className="h-8 w-8 md:h-10 md:w-10 text-[#3c83f6]" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">Stay in the Loop</h3>
            <p className="text-sm md:text-base text-gray-300 mb-6">
              Get early access to new collections, exclusive offers, and training tips from our athletes.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
                suppressHydrationWarning
              />
              <Button 
                className="whitespace-nowrap bg-[#3c83f6] hover:bg-[#2563eb] text-[#1d1e29] border-0 font-semibold" 
                suppressHydrationWarning
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-8 md:py-12">

          {/* Mobile-First Grid: Stack on Mobile, 5 columns on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-8">

            {/* Brand Section */}
            <div>
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/logo.png"
                  alt="1stRep"
                  width={200}
                  height={70}
                  className="h-8 md:h-10 lg:h-24 xl:h-24 w-auto object-contain"
                />
              </Link>
              <p className="text-sm md:text-base text-gray-300 mb-6">
                It all starts with your 1st Rep. Performance range designed for athletes who never settle for ordinary.
              </p>
              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/1strep_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target text-white hover:opacity-80 transition-opacity"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com/1strep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target text-white hover:opacity-80 transition-opacity"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/1strep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target text-white hover:opacity-80 transition-opacity"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://youtube.com/1strep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target text-white hover:opacity-80 transition-opacity"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Shop Section */}
            <div>
              <h4 className="font-semibold text-base md:text-lg mb-4 text-white uppercase">SHOP</h4>
              <ul className="space-y-3 text-xs md:text-sm text-[#949fa1]">
                <li>
                  <Link
                    href="/shop-clean?gender=men"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Men
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop-clean?gender=women"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Women
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop-clean?category=Accessories"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop-clean?category=T-Shirts%20and%20Jumpers"
                    className="hover:text-white transition-colors block py-1"
                  >
                    T-Shirts & Jumpers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop-clean?category=Hoodies%20and%20Jumpers"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Hoodies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop-clean?category=Vests%20%26%20Crop%20Tops"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Vests
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop-clean?category=Leggings"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Bottoms & Leggings
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care Section */}
            <div>
              <h4 className="font-semibold text-base md:text-lg mb-4 text-white uppercase">CUSTOMER CARE</h4>
              <ul className="space-y-3 text-xs md:text-sm text-[#949fa1]">
                <li>
                  <Link
                    href="/size-guide"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping-returns"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link
                    href="/order-tracking"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Order Tracking
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Request a Return
                  </Link>
                </li>
                <li>
                  <Link
                    href="/feedback"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Leave Feedback
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-support"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors block py-1"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h4 className="font-semibold text-base md:text-lg mb-4 text-white uppercase">COMPANY</h4>
              <ul className="space-y-3 text-xs md:text-sm text-[#949fa1]">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors block py-1"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sustainability"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/press"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Press
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reseller-portal"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Reseller Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect Section */}
            <div>
              <h4 className="font-semibold text-base md:text-lg mb-4 text-white uppercase">CONNECT</h4>
              <ul className="space-y-3 text-xs md:text-sm text-[#949fa1]">
                <li>
                  <Link
                    href="/store-locator"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Store Locator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/athletes"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Athlete Program
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors block py-1"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-6 md:pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
              {/* Copyright and Built By */}
              <div className="text-sm md:text-base text-gray-400">
                <p>&copy; 2025 1stRep. All rights reserved.</p>
                <p className="mt-1 text-xs md:text-sm">
                  Built by{' '}
                  <a
                    href="https://qanzakglobal.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Qanzak Global
                  </a>
                </p>
              </div>

              {/* Legal Links */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm md:text-base text-gray-400">
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition-colors py-1 touch-target"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="hover:text-white transition-colors py-1 touch-target"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookie-policy"
                  className="hover:text-white transition-colors py-1 touch-target"
                >
                  Cookie Policy
                </Link>
                <Link
                  href="/contact-support"
                  className="hover:text-white transition-colors py-1 touch-target"
                >
                  Accessibility
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}