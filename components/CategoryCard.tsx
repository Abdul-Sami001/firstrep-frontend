interface CategoryCardProps {
  name: string;
  image: string;
  onClick?: () => void;
}

export default function CategoryCard({ name, image, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={() => {
        onClick?.();
        console.log(`${name} category clicked`);
      }}
      className="relative group overflow-hidden rounded-md aspect-square hover-elevate"
      data-testid={`card-category-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <h3 className="absolute bottom-6 left-6 text-2xl font-bold text-white tracking-tight" data-testid={`text-category-${name.toLowerCase().replace(/\s+/g, '-')}`}>
        {name}
      </h3>
    </button>
  );
}
