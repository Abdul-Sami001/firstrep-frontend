"use client";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

// Hero media items - diverse athletic training scenarios with focus on hijab-style gymwear
const heroMedia = [
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/muslim_woman_wearing_87a068e7.jpg",
    alt: "Muslim woman wearing sports hijab during gym training."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/woman_jogging_trail__2510baa6.jpg",
    alt: "Woman jogging in modest gym wear and sports hijab."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/female_athlete_hijab_653e6699.jpg",
    alt: "Female athlete in sports hijab running workout."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/woman_wearing_modest_e1991178.jpg",
    alt: "Woman wearing modest athletic hijab sportswear for training."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/muslim_woman_wearing_0614751b.jpg",
    alt: "Athlete in sports hijab and modest fitness wear training."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/woman_squat_dumbbell_809f2989.jpg",
    alt: "Woman training with dumbbells in high-support sports bra and leggings."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/female_athlete_hijab_5b2848b3.jpg",
    alt: "Muslim athlete in hijab doing active workout."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/man_running_at_sunri_81367675.jpg",
    alt: "Man running at sunrise wearing lightweight gym tee and compression shorts."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/muslim_woman_wearing_fc889ac7.jpg",
    alt: "Woman in sports hijab wearing athletic fitness apparel."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/woman_wearing_modest_8e688010.jpg",
    alt: "Female athlete in modest full-coverage gym outfit."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/female_athlete_hijab_321089cf.jpg",
    alt: "Athlete training in sports hijab and modest sportswear."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/male_athlete_deadlif_d35adc8a.jpg",
    alt: "Athlete lifting weights in moisture-wicking t-shirt."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/female_athlete_modes_e44bd1ba.jpg",
    alt: "Woman in modest long-sleeve sportswear and leggings."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/woman_wearing_athlet_9e87b5d7.jpg",
    alt: "Woman wearing athletic tank top and leggings for gym training."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/female_athlete_modes_86c1b641.jpg",
    alt: "Athlete training in full-coverage modest athletic wear."
  },
  {
    type: "image" as const,
    url: "/attached_assets/stock_images/man_wearing_fitness__afc6a273.jpg",
    alt: "Man wearing fitness hoodie and joggers outdoors."
  }
];

export default function HeroSection() {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false })
  );

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Carousel */}
      <Carousel
        opts={{ 
          loop: true,
          duration: 20
        }}
        plugins={[autoplayPlugin.current]}
        className="absolute inset-0"
      >
        <CarouselContent className="h-screen -ml-0">
          {heroMedia.map((media, index) => (
            <CarouselItem key={index} className="h-screen pl-0 hero-carousel-item">
              {media.type === "image" ? (
                <div className="relative h-full w-full">
                  <img
                    src={media.url}
                    alt={media.alt}
                    className="absolute inset-0 w-full h-full hero-image"
                  />
                </div>
              ) : (
                <video
                  className="absolute inset-0 w-full h-full hero-image"
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={media.url}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      
      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" data-testid="hero-title">
          BUILD YOUR
          <br />
          <span className="text-primary">IMPOSSIBLE</span>
          {/* <span className="text-primary bg-red-500 text-white p-2">IMPOSSIBLE</span> */}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed" data-testid="hero-subtitle">
          It all starts with your 1st Rep. Performance range designed for athletes who never settle for ordinary.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold"
            onClick={() => window.location.href = '/shop'}
            data-testid="button-shop-now"
          >
            Shop Now
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
            onClick={() => console.log('Learn more clicked')}
            data-testid="button-learn-more"
          >
            Learn More
          </Button>
        </div>
        
        {/* Featured Stats */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-12 mt-16 text-white/80">
          <div className="text-center" data-testid="stat-products">
            <div className="text-2xl font-bold text-white">500+</div>
            <div className="text-sm uppercase tracking-wide">Products</div>
          </div>
          <div className="text-center" data-testid="stat-athletes">
            <div className="text-2xl font-bold text-white">10K+</div>
            <div className="text-sm uppercase tracking-wide">Athletes</div>
          </div>
          <div className="text-center" data-testid="stat-countries">
            <div className="text-2xl font-bold text-white">25+</div>
            <div className="text-sm uppercase tracking-wide">Countries</div>
          </div>
        </div>
      </div>
    </section>
  );
}