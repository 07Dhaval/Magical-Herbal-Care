import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCart);
  }, []);

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ✅ Buy Now Function
  const handleBuyNow = (item) => {
    localStorage.setItem("buyNowItem", JSON.stringify([item]));
    navigate("/checkout");
  };

  return (
    <>
      <Header />

      <section className="bg-[#f3f3f3] -mb-36 min-h-screen py-10">
        <div className="max-w-[1400px] mx-auto px-4">

          <h1 className="text-[32px] text-center font-semibold mb-8">
            Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-[220px] object-contain"
                  />

                  <h3 className="mt-4 text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>

                  <p className="mt-2 text-[#0f4f8b] font-semibold">
                    {item.price}
                  </p>

                  {/* ✅ UPDATED BUTTON SECTION */}
                  <div className="mt-4 flex items-center justify-between">

                    {/* Buy Now (LEFT) */}
                    <button
                      onClick={() => handleBuyNow(item)}
                      className="text-white bg-[#0f4f8b] px-4 py-2 text-sm"
                    >
                      Buy Now
                    </button>

                    {/* Remove (RIGHT) */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 text-sm"
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