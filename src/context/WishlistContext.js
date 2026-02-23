import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_API_URL;

const WishlistContext = createContext();

// Helper for Axios with auth token
const axiosAuth = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: API,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist({ products: [] });
    }
  }, [isAuthenticated]);

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      const response = await axiosAuth().get("/api/wishlist");
      setWishlist(response.data.wishlist);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        setWishlist({ products: [] });
        // Optional: call logout() from AuthContext
      } else {
        console.error("Error fetching wishlist:", error);
      }
    }
  };

  // Add product to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      return { success: false };
    }

    setLoading(true);
    try {
      const response = await axiosAuth().post("/api/wishlist", { productId });
      setWishlist(response.data.wishlist);
      toast.success("Added to wishlist!");
      return { success: true };
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        setWishlist({ products: [] });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to add to wishlist",
        );
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    setLoading(true);
    try {
      const response = await axiosAuth().delete(`/api/wishlist/${productId}`);
      setWishlist(response.data.wishlist);
      toast.success("Removed from wishlist");
      return { success: true };
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        setWishlist({ products: [] });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to remove from wishlist",
        );
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Move product from wishlist to cart
  const moveToCart = async (productId) => {
    setLoading(true);
    try {
      const response = await axiosAuth().post(
        `/api/wishlist/${productId}/move-to-cart`,
      );
      setWishlist(response.data.wishlist);
      toast.success("Moved to cart!");
      return { success: true, cart: response.data.cart };
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        setWishlist({ products: [] });
      } else {
        toast.error(error.response?.data?.message || "Failed to move to cart");
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    setLoading(true);
    try {
      await axiosAuth().delete("/api/wishlist");
      setWishlist({ products: [] });
      toast.success("Wishlist cleared");
      return { success: true };
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        setWishlist({ products: [] });
      } else {
        toast.error("Failed to clear wishlist");
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return (
      wishlist.products?.some((item) => item.product?._id === productId) ||
      false
    );
  };

  // Get wishlist count
  const getWishlistCount = () => wishlist.products?.length || 0;

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    clearWishlist,
    isInWishlist,
    fetchWishlist,
    getWishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
