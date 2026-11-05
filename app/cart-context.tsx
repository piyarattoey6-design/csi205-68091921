'use client';
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchProducts, Product } from '@/data/products';

export type CartItem = Product & { quantity: number };

type CartCtx = {
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: number) => void;
};

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchProducts()
      .then((data: Product[]) => setProducts(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.id === p.id);
      if (existing) {
        return prev.map((x) =>
          x.id === p.id ? { ...x, quantity: x.quantity + 1 } : x
        );
      }
      return [...prev, { ...p, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((x) => x.id !== id));

  return (
    <CartContext.Provider
      value={{ products, loading, error, reload, cart, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};