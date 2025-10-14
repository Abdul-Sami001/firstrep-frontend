import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Twitter, Youtube, Mail } from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "Shop",
      links: [
        { label: "Men", href: "/collections/men" },
        { label: "Women", href: "/collections/women" },
        { label: "Accessories", href: "/collections/accessories" },
        { label: "T-shirts", href: "/collections/t-shirts" },
        { label: "Hoodies", href: "/collections/hoodies" },
        { label: "Vests", href: "/collections/vests" },
        { label: "Bottoms & Leggings", href: "/collections/leggings" }
      ]
    },
    {
      title: "Customer Care",
      links: [
        { label: "Size Guide", href: "/size-guide" },
        { label: "Shipping & Returns", href: "/shipping" },
        { label: "Order Tracking", href: "/track-order" },
        { label: "Contact Support", href: "/support" },
        { label: "FAQ", href: "/faq" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Sustainability", href: "/sustainability" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Reseller Portal", href: "/reseller" }
      ]
    },
    {
      title: "Connect",
      links: [
        { label: "Store Locator", href: "/stores" },
        { label: "Athlete Program", href: "/athletes" },
        { label: "Community", href: "/community" },
        { label: "Events", href: "/events" },
        { label: "Blog", href: "/blog" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/1strep", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com/1strep", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/1strep", label: "Twitter" },
    { icon: Youtube, href: "https://youtube.com/1strep", label: "YouTube" }
  ];

  return (
    <footer className="bg-card border-t border-card-border">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-card-border">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4" data-testid="newsletter-title">
              Stay in the Loop
            </h3>
            <p className="text-muted-foreground mb-6" data-testid="newsletter-subtitle">
              Get early access to new collections, exclusive offers, and training tips from our athletes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button 
                onClick={() => console.log('Newsletter signup clicked')}
                data-testid="button-newsletter-signup"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <img 
                src="https://1strep.com/cdn/shop/files/1stRep_White.png?v=1706179237" 
                alt="1stRep" 
                className="h-10 w-auto mb-6" 
                data-testid="footer-logo"
              />
              <p className="text-muted-foreground mb-6" data-testid="footer-brand-description">
                It all starts with your 1st Rep. Performance range designed for athletes who never settle for ordinary.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="icon"
                    onClick={() => console.log(`${social.label} clicked`)}
                    data-testid={`social-${social.label.toLowerCase()}`}
                  >
                    <social.icon className="h-5 w-5" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-4" data-testid={`footer-section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-card-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground" data-testid="footer-copyright">
              © 2024 1stRep. All rights reserved.
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <a href="/privacy" className="hover:text-foreground transition-colors" data-testid="footer-privacy">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-foreground transition-colors" data-testid="footer-terms">
                Terms of Service
              </a>
              <a href="/cookies" className="hover:text-foreground transition-colors" data-testid="footer-cookies">
                Cookie Policy
              </a>
              <a href="/accessibility" className="hover:text-foreground transition-colors" data-testid="footer-accessibility">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}