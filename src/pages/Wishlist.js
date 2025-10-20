import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { FaHeart, FaShoppingCart, FaTrash, FaStar } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (productId) => {
    const result = await moveToCart(productId);
    if (!result.success) {
      // If move to cart fails, try adding directly
      await addToCart(productId, 1);
      await removeFromWishlist(productId);
    }
  };

  if (!wishlist.products || wishlist.products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <FaHeart className="mx-auto text-6xl text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-8">Save items you love for later!</p>
          <Link
            to="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <span className="text-gray-600">{wishlist.products.length} items</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.products.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-md overflow-hidden group relative"
          >
            <Link to={`/products/${item.product._id}`}>
              <div className="relative h-64 bg-gray-200">
                <img
                  src={
                    item.product.images?.[0] ||
                    "https://via.placeholder.com/400"
                  }
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                {item.product.stock_quantity === 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    Out of Stock
                  </div>
                )}
              </div>
            </Link>

            <div className="p-4">
              <Link to={`/products/${item.product._id}`}>
                <h3 className="text-lg font-semibold mb-2 hover:text-primary-600 line-clamp-1">
                  {item.product.name}
                </h3>
              </Link>

              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-primary-600">
                  ${item.product.price.toFixed(2)}
                </span>
                <div className="flex items-center text-yellow-500">
                  <FaStar />
                  <span className="ml-1 text-gray-600">
                    {item.product.ratings.average.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                Added {new Date(item.addedAt).toLocaleDateString()}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleMoveToCart(item.product._id)}
                  disabled={item.product.stock_quantity === 0}
                  className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <FaShoppingCart />
                  <span>Move to Cart</span>
                </button>
                <button
                  onClick={() => removeFromWishlist(item.product._id)}
                  className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/products"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          Continue Shopping →
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
