import ProductCard from '../ProductCard';
import productImg1 from '@assets/stock_images/athletic_wear_leggin_a986799a.jpg';
import productImg2 from '@assets/stock_images/athletic_wear_leggin_c6f767d1.jpg';

export default function ProductCardExample() {
  return (
    <div className="p-8 max-w-xs">
      <ProductCard
        id="1"
        name="Performance Leggings"
        price={89.99}
        image={productImg1}
        hoverImage={productImg2}
      />
    </div>
  );
}
