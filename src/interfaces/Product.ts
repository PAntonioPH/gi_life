export interface Product {
  id: number;
  id_category: number;
  category : string;
  name: string;
  price: number;
  discount: number;
  images: string[]
  description: string;
  stock: number;
  count: number;
}
