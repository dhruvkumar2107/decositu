"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  variantId: string;
  variantLabel: string;
  size: string;
  color: string;
  sku: string;
  unitPrice: number;
  compareAtPrice: number | null;
  quantity: number;
  stock: number;
};

export type WishlistItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice: number | null;
  categoryName: string;
};

type StoreContextValue = {
  cart: CartItem[];
  wishlist: WishlistItem[];
  cartCount: number;
  wishlistCount: number;
  subtotal: number;
  isReady: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  toggleWishlist: (item: WishlistItem) => void;
  removeWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const CART_KEY = "decoritu-cart-v1";
const WISHLIST_KEY = "decoritu-wishlist-v1";

function readStorage<T>(key: string): T | null {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedCart = readStorage<CartItem[]>(CART_KEY);
    const storedWishlist = readStorage<WishlistItem[]>(WISHLIST_KEY);
    if (Array.isArray(storedCart)) setCart(storedCart);
    if (Array.isArray(storedWishlist)) setWishlist(storedWishlist);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, isReady]);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, isReady]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((line) => line.variantId === item.variantId);
      if (existing) {
        return current.map((line) =>
          line.variantId === item.variantId
            ? {
                ...line,
                quantity: Math.min(line.quantity + quantity, item.stock),
              }
            : line,
        );
      }
      return [...current, { ...item, quantity: Math.min(quantity, item.stock) }];
    });
    toast.success("Added to your bag", {
      description: `${item.name} · ${item.variantLabel}`,
    });
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setCart((current) =>
      current
        .map((line) =>
          line.variantId === variantId
            ? { ...line, quantity: Math.max(0, Math.min(quantity, line.stock)) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setCart((current) => current.filter((line) => line.variantId !== variantId));
    toast("Removed from your bag");
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setWishlist((current) => {
      const exists = current.some((entry) => entry.productId === item.productId);
      if (exists) {
        toast("Removed from saved pieces");
        return current.filter((entry) => entry.productId !== item.productId);
      }
      toast.success("Saved for later", { description: item.name });
      return [...current, item];
    });
  }, []);

  const removeWishlist = useCallback((productId: string) => {
    setWishlist((current) => current.filter((entry) => entry.productId !== productId));
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.some((entry) => entry.productId === productId),
    [wishlist],
  );

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    return {
      cart,
      wishlist,
      cartCount,
      wishlistCount: wishlist.length,
      subtotal,
      isReady,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      toggleWishlist,
      removeWishlist,
      isWishlisted,
    };
  }, [
    cart,
    wishlist,
    isReady,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    toggleWishlist,
    removeWishlist,
    isWishlisted,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
