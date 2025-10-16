import Hero from '../Hero';
import heroImage from '@assets/stock_images/woman_wearing_active_8c826f66.jpg';

export default function HeroExample() {
  return (
    <Hero
      image={heroImage}
      title="Elevate Your Performance"
      subtitle="Premium activewear designed for athletes who demand excellence"
    />
  );
}
