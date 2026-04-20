import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCart);
  }, []);

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleBuyNow = (item) => {
    localStorage.setItem("buyNowItem", JSON.stringify([item]));
    navigate("/checkout");
  };

  const parsePrice = (price) => {
    if (!price) return 0;
    const match = String(price)
      .replace(/,/g, "")
      .match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0);
  }, [cartItems]);

  const formatPrice = (amount) => {
    return `Rs. ${amount.toFixed(2)}`;
  };

  return (
    <>
      <Header />

      <section className="bg-[#f8f4ea] min-h-screen pt-10 pb-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <h1 className="text-[30px] sm:text-[38px] font-semibold text-center text-[#b48a2c] mb-10">
            Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center text-[#2f4f2f] text-[16px]">
              Your cart is empty.
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-10 items-start">
              {/* CART ITEMS */}
              <div className="flex flex-wrap gap-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="w-[260px] bg-white rounded-[14px] shadow-sm overflow-hidden border border-[#e7dcc3]"
                  >
                    <div className="bg-white h-[240px] flex items-center justify-center p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="px-3 pt-3 pb-2">
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
                        onClick={() => handleBuyNow(item)}
                        className="bg-[#2f4f2f] hover:opacity-90 transition text-white text-[13px] font-medium px-5 py-2.5 rounded-[8px]"
                      >
                        Buy Now
                      </button>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#b23a3a] text-[16px] font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sticky top-24 bg-white rounded-[14px] shadow-sm border border-[#e7dcc3] p-5">
                <h2 className="text-[20px] font-semibold text-[#b48a2c] mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 text-[14px] text-[#555]"
                    >
                      <p className="line-clamp-1 flex-1">{item.name}</p>
                      <p className="whitespace-nowrap font-medium text-[#2f4f2f]">
                        {formatPrice(parsePrice(item.price))}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="my-5 border-t border-[#e7dcc3]" />

                <div className="flex items-center justify-between text-[16px] font-semibold text-[#b48a2c]">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-5 w-full bg-[#b48a2c] hover:opacity-90 transition text-white rounded-[10px] py-3.5 text-[15px] font-medium flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={17} />
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
