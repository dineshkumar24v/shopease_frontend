import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_API_URL;

const CartContext = createContext();

// Helper function to create an axios instance with auth token
const axiosAuth = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: API,
    headers: { Authorization: `Bearer ${token}` },
  });
};

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

  // Fetch cart
  const fetchCart = async () => {
    try {
      const response = await axiosAuth().get("/api/cart");
      setCart(response.data.cart);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        setCart({ items: [], total: 0 });
        // Optionally call logout() from AuthContext
      } else {
        console.error("Error fetching cart:", error);
      }
    }
  };

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return { success: false };
    }
    setLoading(true);
    try {
      const response = await axiosAuth().post("/api/cart", {
        productId,
        quantity,
      });
      setCart(response.data.cart);
      toast.success("Item added to cart!");
      return { success: true };
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        setCart({ items: [], total: 0 });
      } else {
        toast.error(error.response?.data?.message || "Failed to add item");
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      const response = await axiosAuth().put(`/api/cart/${productId}`, {
        quantity,
      });
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Remove item
  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const response = await axiosAuth().delete(`/api/cart/${productId}`);
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

  // Clear cart
  const clearCart = async () => {
    setLoading(true);
    try {
      await axiosAuth().delete("/api/cart");
      setCart({ items: [], total: 0 });
      return { success: true };
    } catch (error) {
      toast.error("Failed to clear cart");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const getCartCount = () =>
    cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const getCartTotal = () =>
    cart.items?.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0,
    ) || 0;

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
