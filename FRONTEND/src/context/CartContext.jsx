import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('guest_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Fetch cart items from backend for logged in user
  const fetchCartFromBackend = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const { data } = await axiosInstance.get('/cart');
      if (data.success && data.cart) {
        const formatted = (data.cart.items || [])
          .filter((item) => item && item.product)
          .map((item) => {
            const p = item.product;
            const img = (p.images && p.images.length > 0)
              ? (typeof p.images[0] === 'string' ? p.images[0] : p.images[0].url)
              : '';
            const price = (p.salePrice && p.salePrice < p.price)
              ? p.salePrice
              : (p.price || item.price || 0);
            const pId = p._id ? p._id.toString() : (p.id || p);

            return {
              id: pId,
              _id: pId,
              name: p.name || item.name || 'Product',
              price: price,
              image: img,
              quantity: item.quantity || 1,
              stock: p.stock,
            };
          });
        setCartItems(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch cart from backend:", error);
    }
  }, []);

  // Sync guest cart to backend upon login without wiping existing DB cart
  const syncLocalCartToBackend = useCallback(async (localItems) => {
    try {
      if (localItems && localItems.length > 0) {
        for (const item of localItems) {
          const prodId = getMongoIdFromMockId(item.id || item._id);
          if (prodId) {
            await axiosInstance.post('/cart', {
              productId: prodId,
              quantity: item.quantity || 1,
            });
          }
        }
        localStorage.removeItem('guest_cart');
      }
    } catch (error) {
      console.error("Failed to sync cart to backend:", error);
    } finally {
      await fetchCartFromBackend();
    }
  }, [fetchCartFromBackend]);

  // Synchronize cart when user authentication state changes
  useEffect(() => {
    if (user && (user.role === 'customer' || !user.role)) {
      const guestCartRaw = localStorage.getItem('guest_cart');
      let guestCart = [];
      try {
        if (guestCartRaw) guestCart = JSON.parse(guestCartRaw);
      } catch (e) {
        console.error(e);
      }

      if (guestCart && guestCart.length > 0) {
        syncLocalCartToBackend(guestCart);
      } else {
        fetchCartFromBackend();
      }
    } else if (!user) {
      const guestCartRaw = localStorage.getItem('guest_cart');
      if (guestCartRaw) {
        try {
          setCartItems(JSON.parse(guestCartRaw));
        } catch (e) {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  }, [user, syncLocalCartToBackend, fetchCartFromBackend]);

  const addToCart = (product, qty = 1) => {
    const quantityToAdd = typeof qty === 'number' && qty > 0 ? qty : 1;
    const productId = product.id || product._id;
    const productName = product.name;
    const productPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price || 0);
    const productImage = product.image || (product.images && product.images[0] ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url) : '');

    const newItem = {
      id: productId,
      _id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: quantityToAdd,
      stock: product.stock,
    };

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item.id === productId || item._id === productId) && item.name === productName
      );
      let updated;
      if (existingIndex > -1) {
        updated = prevItems.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      } else {
        updated = [...prevItems, newItem];
      }

      if (!user) {
        localStorage.setItem('guest_cart', JSON.stringify(updated));
      }
      return updated;
    });

    // If user is logged in, sync in backend
    if (user && (user.role === 'customer' || !user.role)) {
      const mongoId = getMongoIdFromMockId(productId);
      if (mongoId) {
        axiosInstance.post('/cart', {
          productId: mongoId,
          quantity: quantityToAdd,
        })
        .then(() => fetchCartFromBackend())
        .catch(err => console.error("Error adding to DB cart:", err));
      }
    }

    // Open the cart automatically when an item is added
    openCart();
  };

  const removeFromCart = (id, name) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter(
        (item) => !((item.id === id || item._id === id) && (!name || item.name === name))
      );
      if (!user) {
        localStorage.setItem('guest_cart', JSON.stringify(updated));
      }
      return updated;
    });

    // If user is logged in, sync in background
    if (user && (user.role === 'customer' || !user.role)) {
      const mongoId = getMongoIdFromMockId(id);
      if (mongoId) {
        axiosInstance.delete(`/cart/${mongoId}`)
          .then(() => fetchCartFromBackend())
          .catch(err => console.error("Error removing from DB cart:", err));
      }
    }
  };

  const updateQuantity = (id, name, quantity) => {
    if (quantity < 1) return;
    setCartItems((prevItems) => {
      const updated = prevItems.map((item) =>
        (item.id === id || item._id === id) && (!name || item.name === name)
          ? { ...item, quantity }
          : item
      );
      if (!user) {
        localStorage.setItem('guest_cart', JSON.stringify(updated));
      }
      return updated;
    });

    // If user is logged in, sync in background
    if (user && (user.role === 'customer' || !user.role)) {
      const mongoId = getMongoIdFromMockId(id);
      if (mongoId) {
        axiosInstance.put(`/cart/${mongoId}`, { quantity })
          .then(() => fetchCartFromBackend())
          .catch(err => console.error("Error updating DB cart quantity:", err));
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('guest_cart');

    // If user is logged in, sync in background
    if (user && (user.role === 'customer' || !user.role)) {
      axiosInstance.delete('/cart')
        .catch(err => console.error("Error clearing DB cart:", err));
    }
  };

  const cartTotalCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

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
        fetchCartFromBackend,
        cartTotalCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

