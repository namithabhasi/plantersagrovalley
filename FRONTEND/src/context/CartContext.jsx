import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

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
    // Open the cart automatically when an item is added
    openCart();
  };

  const removeFromCart = (id, name) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => !(item.id === id && item.name === name))
    );
  };

  const updateQuantity = (id, name, quantity) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.name === name ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
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
        cartTotalCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
