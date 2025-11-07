export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  material: string;
  details: string;
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
