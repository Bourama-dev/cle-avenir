import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';

const CartContext = createContext(undefined);

/**
 * CartProvider Component
 * Manages the shopping cart state and provides methods to manipulate it.
 * Note: Toast notifications should be handled by the consuming components, not the provider.
 */
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('cart_items');
        return saved ? JSON.parse(saved) : [];
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart_items', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = useCallback((item) => {
    if (!item || !item.id) {
      console.error('Invalid item added to cart:', item);
      return;
    }

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems((prevItems) => {
      return prevItems.filter((item) => item.id !== itemId);
    });
  }, []);

  const updateQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cart_items');
  }, []);

  const getCartTotal = useCallback(() => {
    const total = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      return sum + (price * item.quantity);
    }, 0);
    return total.toFixed(2) + " €";
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};