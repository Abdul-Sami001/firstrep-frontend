import CategoryCard from '../CategoryCard';
import categoryImage from '@assets/stock_images/athletic_person_trai_c7021144.jpg';

export default function CategoryCardExample() {
  return (
    <div className="p-8 max-w-md">
      <CategoryCard
        name="Gym Equipment"
        image={categoryImage}
      />
    </div>
  );
}
