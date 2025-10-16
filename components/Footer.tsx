import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4" data-testid="text-footer-brand">1strep</h3>
            <p className="text-sm text-muted-foreground">Your First Step to Fitness</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/editorial" className="hover:text-foreground transition-colors">New In</Link></li>
              <li><Link href="/collection/training" className="hover:text-foreground transition-colors">Training</Link></li>
              <li><Link href="/collection/yoga" className="hover:text-foreground transition-colors">Yoga</Link></li>
              <li><Link href="/collection/running" className="hover:text-foreground transition-colors">Running</Link></li>
              <li><Link href="/collection/studio" className="hover:text-foreground transition-colors">Studio</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping-returns" className="hover:text-foreground transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="hover:text-foreground transition-colors">Size Guide</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/track-order" className="hover:text-foreground transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">Our Story</Link></li>
              <li><Link href="/sustainability" className="hover:text-foreground transition-colors">Sustainability</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/store-locator" className="hover:text-foreground transition-colors">Store Locator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">Get 10% off your first order</p>
            <div className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                data-testid="input-newsletter"
              />
              <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover-elevate" data-testid="button-subscribe">
                Subscribe
              </button>
            </div>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/1strep"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/1strep"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/1strep"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/1strep"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2024 1strep. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}