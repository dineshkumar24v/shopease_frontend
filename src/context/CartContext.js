import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/cart");
      setCart(response.data.cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return { success: false };
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/cart", { productId, quantity });
      setCart(response.data.cart);
      toast.success("Item added to cart!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add item");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/cart/${productId}`, { quantity });
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`/api/cart/${productId}`);
      setCart(response.data.cart);
      toast.success("Item removed from cart");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await axios.delete("/api/cart");
      setCart({ items: [], total: 0 });
      return { success: true };
    } catch (error) {
      toast.error("Failed to clear cart", error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const getCartCount = () => {
    return cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getCartTotal = () => {
    return (
      cart.items?.reduce((total, item) => {
        return total + (item.product?.price || 0) * item.quantity;
      }, 0) || 0
    );
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
