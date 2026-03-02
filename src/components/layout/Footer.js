import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">ShopEase</h3>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for all your needs. Quality products at
              affordable prices.
            </p>
            <div className="flex space-x-4 mt-4">
              <button className="text-gray-400 hover:text-white transition bg-none border-none cursor-pointer p-0">
                <FaFacebook className="text-xl" />
              </button>
              <button className="text-gray-400 hover:text-white transition bg-none border-none cursor-pointer p-0">
                <FaTwitter className="text-xl" />
              </button>
              <button className="text-gray-400 hover:text-white transition bg-none border-none cursor-pointer p-0">
                <FaInstagram className="text-xl" />
              </button>
              <button className="text-gray-400 hover:text-white transition bg-none border-none cursor-pointer p-0">
                <FaLinkedin className="text-xl" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-white transition"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-gray-400 hover:text-white transition"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="text-gray-400 hover:text-white transition"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-400 hover:text-white transition bg-none border-none cursor-pointer p-0 text-left">
                  Contact Us
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition bg-none border-none cursor-pointer p-0 text-left">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition bg-none border-none cursor-pointer p-0 text-left">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition bg-none border-none cursor-pointer p-0 text-left">
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers and updates.
            </p>
            <form className="flex w-full max-w-full overflow-hidden">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary-600 px-4 py-2 rounded-r-lg hover:bg-primary-700 transition whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
