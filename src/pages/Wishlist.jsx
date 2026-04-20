import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlistItems")) || [];
    setWishlistItems(savedWishlist);
  }, []);

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const addToCart = (item) => {
    const existingCart =
      JSON.parse(localStorage.getItem("cartItems")) || [];

    const alreadyExists = existingCart.some(
      (cartItem) => cartItem.id === item.id
    );

    if (!alreadyExists) {
      const updatedCart = [...existingCart, item];
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Added to cart");
    } else {
      alert("Already in cart");
    }
  };

  return (
    <>
      <Header />

      <section className="bg-[#f8f4ea] min-h-screen pt-10 pb-28">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <h1 className="text-[36px] sm:text-[48px] text-center font-semibold text-[#b48a2c] mb-10">
            Your Wishlist
          </h1>

          {wishlistItems.length === 0 ? (
            <p className="text-[#2f4f2f] text-[16px] text-center">
              Your wishlist is empty.
            </p>
          ) : (
            <div className="flex flex-wrap gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="w-[260px] bg-white rounded-[14px] border border-[#e7dcc3] shadow-sm overflow-hidden"
                >
                  <div className="w-full h-[250px] bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-3"
                    />
                  </div>

                  <div className="px-4 pt-4 pb-3">
                    <h3 className="text-[18px] leading-[1.25] font-semibold text-[#b48a2c]">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-[14px] text-[#2f4f2f]">
                      {item.category}
                    </p>

                    <p className="mt-3 text-[18px] leading-none font-semibold text-[#2f4f2f]">
                      {item.price}
                    </p>
                  </div>

                  <div className="px-4 py-3 border-t border-[#e7dcc3] flex items-center justify-between">
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-[#2f4f2f] hover:opacity-90 transition text-white text-[13px] font-medium px-5 py-2.5 rounded-[8px] flex items-center gap-2"
                    >
                      Add to Cart <ShoppingCart size={16} />
                    </button>

                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-[#b23a3a] text-[16px] font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}