import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

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

  return (
    <section className="bg-[#f3f3f3] min-h-screen py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <h1 className="text-[32px] sm:text-[40px] font-semibold text-[#1D1D1D] mb-8">
          Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <p className="text-[#666] text-[16px]">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white p-4 shadow-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-[260px] object-contain"
                />

                <h3 className="mt-4 text-[18px] font-medium text-[#222]">
                  {item.name}
                </h3>

                <p className="mt-1 text-[14px] text-[#666]">{item.category}</p>
                <p className="mt-2 text-[18px] text-[#0f4f8b] font-medium">
                  {item.price}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    to={`/product/${item.id}`}
                    state={{ product: item }}
                    className="text-[#0f4f8b] text-[14px] font-medium"
                  >
                    View Product
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}