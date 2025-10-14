import ProductCard from '../ProductCard'
import productImage from '@assets/generated_images/Black_athletic_t-shirt_4a985312.png'

export default function ProductCardExample() {
  return (
    <div className="max-w-sm">
      <ProductCard
        id="1"
        name="Performance T-Shirt"
        price={35.00}
        originalPrice={45.00}
        image={productImage}
        category="Men's Apparel"
        isNew={true}
        colors={['#000000', '#333333', '#666666']}
        sizes={['S', 'M', 'L', 'XL']}
      />
    </div>
  )
}