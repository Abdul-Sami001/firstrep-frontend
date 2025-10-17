// components/Hero.tsx - Mobile-First with Next.js Image
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface HeroProps {
  image?: string;
  video?: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export default function Hero({
  image,
  video,
  title,
  subtitle,
  ctaText = 'Shop Now',
  onCtaClick
}: HeroProps) {
  return (
    <section
      className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] min-h-[300px] md:min-h-[400px] lg:min-h-[500px] overflow-hidden"
      data-testid="section-hero"
    >
      {/* Mobile-First Background */}
      {video ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : image ? (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
          priority={true}
          quality={85}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
      )}

      {/* Mobile-First Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"
        aria-hidden="true"
      />

      {/* Mobile-First Content */}
      <div className="relative h-full flex items-center justify-center text-center px-mobile md:px-tablet lg:px-desktop">
        <div className="max-w-3xl w-full">
          <h2
            className="text-mobile-h1 md:text-tablet-h1 lg:text-desktop-h1 font-bold text-white mb-4 tracking-tight"
            data-testid="text-hero-title"
          >
            {title}
          </h2>
          <p
            className="text-sm md:text-base lg:text-lg text-white/90 mb-6 md:mb-8"
            data-testid="text-hero-subtitle"
          >
            {subtitle}
          </p>
          <Button
            size="lg"
            onClick={() => {
              onCtaClick?.();
              console.log('Hero CTA clicked');
            }}
            className="touch-target bg-white/10 backdrop-blur-md text-white border-2 border-white/20 hover:bg-white/20 transition-all duration-300"
            data-testid="button-hero-cta"
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </section>
  );
}