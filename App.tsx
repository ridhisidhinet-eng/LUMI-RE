import { useState, useMemo } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CategoryFilter from "./components/CategoryFilter";
import ProductGrid from "./components/ProductGrid";
import ProductModal from "./components/ProductModal";
import Cart from "./components/Cart";
import { Product, CartItem } from "./types";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Diamond Solitaire Ring",
    price: 2499,
    category: "Rings",
    image: "https://images.unsplash.com/photo-1739591414031-edd27896c8bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZyUyMGVsZWdhbnR8ZW58MXx8fHwxNzYyNTA5NTM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "A timeless solitaire diamond ring featuring a brilliant-cut diamond set in 18k white gold.",
    material: "18k White Gold",
    details: "1.5 carat diamond",
    isNew: true,
  },
  {
    id: "2",
    name: "Gold Chain Necklace",
    price: 1299,
    category: "Necklaces",
    image: "https://images.unsplash.com/photo-1611012756377-05e2e4269fa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwbmVja2xhY2UlMjBqZXdlbHJ5fGVufDF8fHx8MTc2MjQzNTU1OHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Elegant 18k gold chain necklace with a delicate link design.",
    material: "18k Yellow Gold",
    details: "16 inch length",
  },
  {
    id: "3",
    name: "Pearl Drop Earrings",
    price: 899,
    category: "Earrings",
    image: "https://images.unsplash.com/photo-1761637999571-9dfaf98a1fab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMGVhcnJpbmdzJTIwbHV4dXJ5fGVufDF8fHx8MTc2MjUyMzI2MHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Classic freshwater pearl drop earrings with 14k gold settings.",
    material: "14k Yellow Gold",
    details: "8mm freshwater pearls",
    isNew: true,
  },
  {
    id: "4",
    name: "Tennis Bracelet",
    price: 3299,
    category: "Bracelets",
    image: "https://images.unsplash.com/photo-1689397136362-dce64e557fcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFjZWxldCUyMGpld2VscnklMjBnb2xkfGVufDF8fHx8MTc2MjQ4MzQyMXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Stunning diamond tennis bracelet with perfectly matched stones.",
    material: "Platinum",
    details: "5 carat total weight",
  },
  {
    id: "5",
    name: "Eternity Band",
    price: 1899,
    category: "Rings",
    image: "https://images.unsplash.com/photo-1584628913500-7da703b091db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmluZ3MlMjBkaWFtb25kfGVufDF8fHx8MTc2MjUyMzI2MXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Beautiful eternity band with diamonds set all around the band.",
    material: "18k White Gold",
    details: "0.75 carat total weight",
  },
  {
    id: "6",
    name: "Sapphire Ring",
    price: 2799,
    category: "Rings",
    image: "https://images.unsplash.com/photo-1739591414031-edd27896c8bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZyUyMGVsZWdhbnR8ZW58MXx8fHwxNzYyNTA5NTM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Royal blue sapphire surrounded by a halo of brilliant diamonds.",
    material: "Platinum",
    details: "2 carat sapphire",
    isNew: true,
  },
  {
    id: "7",
    name: "Diamond Pendant",
    price: 1599,
    category: "Necklaces",
    image: "https://images.unsplash.com/photo-1611012756377-05e2e4269fa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwbmVja2xhY2UlMjBqZXdlbHJ5fGVufDF8fHx8MTc2MjQzNTU1OHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Elegant diamond pendant necklace perfect for any occasion.",
    material: "18k White Gold",
    details: "0.5 carat diamond",
  },
  {
    id: "8",
    name: "Hoop Earrings",
    price: 699,
    category: "Earrings",
    image: "https://images.unsplash.com/photo-1761637999571-9dfaf98a1fab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMGVhcnJpbmdzJTIwbHV4dXJ5fGVufDF8fHx8MTc2MjUyMzI2MHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Classic gold hoop earrings with a modern twist.",
    material: "14k Yellow Gold",
    details: "25mm diameter",
  },
];

const CATEGORIES = ["All", "Rings", "Necklaces", "Earrings", "Bracelets"];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return PRODUCTS;
    return PRODUCTS.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        toast.success("Updated quantity in cart");
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success("Added to cart");
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Removed from cart");
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      <Header cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />
      <Hero />
      <CategoryFilter
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <ProductGrid
        products={filteredProducts}
        onAddToCart={handleAddToCart}
        onViewDetails={setSelectedProduct}
      />
      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
      <Cart
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      <Toaster />

      {/* Footer */}
      <footer className="bg-gray-50 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="mb-4">LUMIÈRE</h3>
              <p className="text-sm text-gray-600">
                Crafting timeless elegance since 1985
              </p>
            </div>
            <div>
              <h4 className="mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">Rings</a></li>
                <li><a href="#" className="hover:text-black">Necklaces</a></li>
                <li><a href="#" className="hover:text-black">Earrings</a></li>
                <li><a href="#" className="hover:text-black">Bracelets</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Customer Care</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">Contact Us</a></li>
                <li><a href="#" className="hover:text-black">Shipping</a></li>
                <li><a href="#" className="hover:text-black">Returns</a></li>
                <li><a href="#" className="hover:text-black">Warranty</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">Our Story</a></li>
                <li><a href="#" className="hover:text-black">Craftsmanship</a></li>
                <li><a href="#" className="hover:text-black">Sustainability</a></li>
                <li><a href="#" className="hover:text-black">Press</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-gray-600">
            <p>© 2025 LUMIÈRE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
