import React, {createContext, useContext, useState, ReactNode} from "react";

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

  const addProduct = (product: Product) => {
    const exist = cart.find((item) => item.id === product.id);
    if (exist) {
      setCart((prevCart) => prevCart.map((item) => item.id === product.id ? {...exist, count: exist.count! + 1} : item));
    } else {
      setCart((prevCart) => [...prevCart, {...product, count: 1}]);
    }
  };

  const removeProduct = (product: Product) => {
    const exist = cart.find((item) => item.id === product.id);
    if (exist) {
      if (exist.count === 1) {
        setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
      } else {
        setCart((prevCart) => prevCart.map((item) => item.id === product.id ? {...exist, count: exist.count! - 1} : item));
      }
    }
  }

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((a, b) => a + (b.price * b.count), 0).toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2});

  return (
    <CartContext.Provider value={{cart, addProduct, removeProduct, clearCart, total}}>
      {children}
    </CartContext.Provider>
  );
};
