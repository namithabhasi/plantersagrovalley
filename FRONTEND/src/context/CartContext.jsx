import React, { createContext, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axiosInstance';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Helper to generate deterministic MongoId from mockId string
export const getMongoIdFromMockId = (mockId) => {
  if (!mockId) return "";
  // If it's already a valid MongoId, return as is
  if (/^[0-9a-fA-F]{24}$/.test(mockId)) return mockId;
  
  let hex = "";
  for (let i = 0; i < mockId.length; i++) {
    hex += mockId.charCodeAt(i).toString(16);
  }
  return hex.padEnd(24, "0").slice(0, 24);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Sync guest cart to backend upon login
  const syncLocalCartToBackend = async (localItems) => {
    try {
      // Clear DB cart first
      await axiosInstance.delete('/cart');
      // Upload each local item
      for (const item of localItems) {
        await axiosInstance.post('/cart', {
          productId: getMongoIdFromMockId(item.id),
          quantity: item.quantity,
        });
      }
    } catch (error) {
      console.error("Failed to sync cart to backend:", error);
    }
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id && item.name === product.name);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });

    // If user is logged in, sync in background
    if (user && user.role === 'customer') {
      axiosInstance.post('/cart', {
        productId: getMongoIdFromMockId(product.id),
        quantity: 1
      }).catch(err => console.error("Error adding to DB cart:", err));
    }

    // Open the cart automatically when an item is added
    openCart();
  };

  const removeFromCart = (id, name) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => !(item.id === id && item.name === name))
    );

    // If user is logged in, sync in background
    if (user && user.role === 'customer') {
      axiosInstance.delete(`/cart/${getMongoIdFromMockId(id)}`)
        .catch(err => console.error("Error removing from DB cart:", err));
    }
  };

  const updateQuantity = (id, name, quantity) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.name === name ? { ...item, quantity } : item
      )
    );

    // If user is logged in, sync in background
    if (user && user.role === 'customer') {
      axiosInstance.put(`/cart/${getMongoIdFromMockId(id)}`, { quantity })
        .catch(err => console.error("Error updating DB cart quantity:", err));
    }
  };

  const clearCart = () => {
    setCartItems([]);

    // If user is logged in, sync in background
    if (user && user.role === 'customer') {
      axiosInstance.delete('/cart')
        .catch(err => console.error("Error clearing DB cart:", err));
    }
  };

  const cartTotalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        syncLocalCartToBackend,
        cartTotalCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
