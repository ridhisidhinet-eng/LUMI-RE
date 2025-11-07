import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { Product } from "../types";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
}: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-shadow duration-300">
      <div
        className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
          <Heart className="w-5 h-5" />
        </button>
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs">
            NEW
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <h3 className="mb-2 cursor-pointer" onClick={() => onViewDetails(product)}>
          {product.name}
        </h3>
        <p className="mb-4">${product.price.toLocaleString()}</p>
        <Button
          className="w-full"
          onClick={() => onAddToCart(product)}
          variant="outline"
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
