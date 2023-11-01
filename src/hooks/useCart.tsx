import React, {createContext, useContext, useState, ReactNode, useEffect} from "react";
import Cookies from "js-cookie";

interface Product {
  id: number;
  id_category: number;
  category: string;
  name: string;
  price: number;
  discount: number;
  images: string[]
  description: string;
  stock: number;
  count: number;
}

interface CartContextProps {
  cart: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  clearCart: () => void;
  total: string
  setCount: (product: Product, count: number) => void;
  deleteProduct: (product: Product) => void;
}

const CartContext = createContext<CartContextProps | null>(null);

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({children}) => {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const cartCookie = Cookies.get('cart');
    if (cartCookie) {
      setCart(JSON.parse(cartCookie));
    }
  }, [])

  const addProduct = (product: Product) => {
    const exist = cart.find((item) => item.id === product.id);
    let newCart: Product[];

    if (exist) {
      const count = (exist.count! + 1) > product.stock ? product.stock : exist.count! + 1;
      newCart = cart.map((item) => item.id === product.id ? {...exist, count: count} : item);
    } else {
      newCart = [...cart, {...product, count: 1}];
    }

    setCart(newCart);
    Cookies.set('cart', JSON.stringify(newCart));
  };


  const removeProduct = (product: Product) => {
    const exist = cart.find((item) => item.id === product.id);
    let newCart: Product[] = [];

    if (exist) {
      if (exist.count === 1) {
        newCart = cart.filter((item) => item.id !== product.id);
      } else {
        newCart = cart.map((item) => item.id === product.id ? {...exist, count: exist.count! - 1} : item);
      }
    }

    setCart(newCart);
    Cookies.set('cart', JSON.stringify(newCart));
  }

  const setCount = (product: Product, count: number) => {
    const exist = cart.find((item) => item.id === product.id);
    let newCart: Product[] = [];

    if (count > product.stock) count = product.stock;

    if (isNaN(count)) count = 1;

    if (exist) {
      if (count === 0) {
        newCart = cart.filter((item) => item.id !== product.id);
      } else {
        newCart = cart.map((item) => item.id === product.id ? {...exist, count: count} : item);
      }
    }

    setCart(newCart);
    Cookies.set('cart', JSON.stringify(newCart));
  }

  const deleteProduct = (product: Product) => {
    const exist = cart.find((item) => item.id === product.id);
    let newCart: Product[] = [];

    if (exist) {
      newCart = cart.filter((item) => item.id !== product.id);
    }

    setCart(newCart);
    Cookies.set('cart', JSON.stringify(newCart));
  }

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((a, b) => a + (b.price * b.count) * (1 - b.discount / 100), 0).toLocaleString("es-MX", {minimumFractionDigits: 2,maximumFractionDigits: 2});

  return (
    <CartContext.Provider value={{cart, addProduct, removeProduct, clearCart, total, setCount, deleteProduct}}>
      {children}
    </CartContext.Provider>
  );
};
