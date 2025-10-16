import { Button } from '@/components/ui/button';

interface HeroProps {
  image?: string;
  video?: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export default function Hero({ image, video, title, subtitle, ctaText = 'Shop Now', onCtaClick }: HeroProps) {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden" data-testid="section-hero">
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
      ) : (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"
        aria-hidden="true"
      />
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight" data-testid="text-hero-title">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8" data-testid="text-hero-subtitle">
            {subtitle}
          </p>
          <Button 
            size="lg"
            onClick={() => {
              onCtaClick?.();
              console.log('Hero CTA clicked');
            }}
            className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 hover:bg-white/20"
            data-testid="button-hero-cta"
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </section>
  );
}
