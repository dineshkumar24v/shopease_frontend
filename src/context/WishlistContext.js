import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const WishlistContext = createContext();

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist({ products: [] });
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("/api/wishlist");
      setWishlist(response.data.wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      return { success: false };
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/wishlist", { productId });
      setWishlist(response.data.wishlist);
      toast.success("Added to wishlist!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to wishlist");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`/api/wishlist/${productId}`);
      setWishlist(response.data.wishlist);
      toast.success("Removed from wishlist");
      return { success: true };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove from wishlist"
      );
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return (
      wishlist.products?.some((item) => item.product?._id === productId) ||
      false
    );
  };

  const moveToCart = async (productId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/wishlist/${productId}/move-to-cart`
      );
      setWishlist(response.data.wishlist);
      toast.success("Moved to cart!");
      return { success: true, cart: response.data.cart };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to move to cart");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    setLoading(true);
    try {
      await axios.delete("/api/wishlist");
      setWishlist({ products: [] });
      toast.success("Wishlist cleared");
      return { success: true };
    } catch (error) {
      toast.error("Failed to clear wishlist", error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const getWishlistCount = () => {
    return wishlist.products?.length || 0;
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    moveToCart,
    clearWishlist,
    fetchWishlist,
    getWishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
