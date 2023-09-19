interface Product {
  id: number;
  price: number;
  count: number;
  discount: number;
}

export interface Cart {
  id: number;
  id_user: number;
  orders: Product[];
}