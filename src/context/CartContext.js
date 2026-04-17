'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const { isLoaded, isSignedIn, user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    setIsAdmin(user?.role === 'ADMIN');

    if (!isSignedIn) {
      setCart([]);
      setIsInitialized(true);
      return;
    }

    const key = `santiago-cart-${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch { setCart([]); }
    } else {
      setCart([]);
    }
    setIsInitialized(true);
  }, [isLoaded, isSignedIn, user?.id]);

  useEffect(() => {
    if (isInitialized && isSignedIn && user) {
      localStorage.setItem(`santiago-cart-${user.id}`, JSON.stringify(cart));
    }
  }, [cart, isInitialized, isSignedIn, user?.id]);

  const addToCart = (product) => {
    if (!isSignedIn) {
      toast.error('Please log in to add items to your cart.', { description: 'Your cart is tied to your account.' });
      return;
    }
    if (isAdmin) {
      toast.error('Admins cannot add items to cart.');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        toast.info(`${product.name} quantity updated`);
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      toast.success(`${product.name} added to cart`);
      return [...prev, { ...product, quantity: 1, status: 'in-cart' }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    toast.error('Item removed from cart');
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (!item) return prev;
      const newQty = item.quantity + delta;
      if (newQty <= 0) return prev.filter((i) => i.id !== productId);
      return prev.map((i) => i.id === productId ? { ...i, quantity: newQty } : i);
    });
  };

  const updateStatus = (productId, newStatus) => {
    setCart((prev) => prev.map((item) => item.id === productId ? { ...item, status: newStatus } : item));
    toast.success(`Item status updated to ${newStatus}`);
  };

  const clearCart = () => {
    setCart([]);
    if (user) localStorage.removeItem(`santiago-cart-${user.id}`);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateStatus, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
}
