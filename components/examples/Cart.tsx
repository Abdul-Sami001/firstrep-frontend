import { useState } from 'react';
import Cart from '../Cart';
import { Button } from '@/components/ui/button';
import productImg from '@assets/stock_images/athletic_wear_leggin_a986799a.jpg';

export default function CartExample() {
  const [isOpen, setIsOpen] = useState(true);

  const mockItems = [
    {
      id: '1',
      name: 'Performance Leggings',
      price: 89.99,
      quantity: 1,
      image: productImg,
      size: 'M'
    }
  ];

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>Open Cart</Button>
      <Cart
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={mockItems}
      />
    </div>
  );
}
