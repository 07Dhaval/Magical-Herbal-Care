import React, { useEffect, useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

const LOGIN_DURATION = 5 * 60 * 1000;

const getProductId = (item) => {
  return String(item?._id || item?.id || item?.productId || "");
};

const parsePrice = (price) => {
  if (typeof price === "number") return price;
  if (!price) return 0;

  const match = String(price).replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
};

const normalizeProduct = (item) => {
  const productId = getProductId(item);

  return {
    ...item,
    _id: productId,
    id: productId,
    productId,
    name: item?.name || "Product",
    category: item?.category || "",
    image: item?.image || item?.images?.[0] || "",
    price: parsePrice(item?.price || item?.salePrice || 0),
    quantity: Number(item?.quantity) || 1,
  };
};

const getRegisteredUser = () => {
  const savedUser = JSON.parse(localStorage.getItem("registeredUser"));
  if (!savedUser) return null;

  if (Date.now() > savedUser.expiryTime) {
    localStorage.removeItem("registeredUser");
    return null;
  }

  return savedUser;
};

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [userData, setUserData] = useState(getRegisteredUser());

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    otp: "",
  });

  useEffect(() => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlistItems")) || [];

    const normalized = savedWishlist
      .map(normalizeProduct)
      .filter((item) => getProductId(item));

    setWishlistItems(normalized);
    localStorage.setItem("wishlistItems", JSON.stringify(normalized));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setUserData(getRegisteredUser());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("registeredUser");
    setUserData(null);
  };

  const formatPrice = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`;

  const saveWishlist = (updatedWishlist) => {
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const removeFromWishlist = (id) => {
    const productId = String(id);
    const updatedWishlist = wishlistItems.filter(
      (item) => getProductId(item) !== productId
    );

    saveWishlist(updatedWishlist);
  };

  const addItemToCart = (item) => {
    const normalizedItem = normalizeProduct(item);
    const productId = getProductId(normalizedItem);

    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const normalizedCart = existingCart
      .map(normalizeProduct)
      .filter((cartItem) => getProductId(cartItem));

    const alreadyExists = normalizedCart.some(
      (cartItem) => getProductId(cartItem) === productId
    );

    let updatedCart;

    if (alreadyExists) {
      updatedCart = normalizedCart.map((cartItem) =>
        getProductId(cartItem) === productId
          ? {
              ...cartItem,
              quantity: Number(cartItem.quantity || 1) + 1,
            }
          : cartItem
      );

      alert("Product quantity updated in cart");
    } else {
      updatedCart = [...normalizedCart, normalizedItem];
      alert("Added to cart");
    }

    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const addToCart = (item) => {
    const user = getRegisteredUser();

    if (user) {
      setUserData(user);
      addItemToCart(item);
      return;
    }

    setPendingItem(item);
    setShowLoginForm(true);
  };

  const sendOtp = async () => {
    if (!loginData.name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(loginData.email)) {
      alert("Enter valid email address");
      return;
    }

    try {
      setOtpLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpSent(true);
      alert("OTP sent successfully");
    } catch (error) {
      alert(error.message || "OTP send failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!loginData.otp.trim()) {
      alert("Please enter OTP");
      return;
    }

    try {
      setOtpLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          otp: loginData.otp,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid OTP");
      }

      const user = {
        name: loginData.name,
        email: loginData.email,
        expiryTime: Date.now() + LOGIN_DURATION,
      };

      localStorage.setItem("registeredUser", JSON.stringify(user));
      setUserData(user);
      setShowLoginForm(false);

      if (pendingItem) {
        addItemToCart(pendingItem);
      }

      setPendingItem(null);
      setOtpSent(false);
      setLoginData({
        name: "",
        email: "",
        otp: "",
      });
    } catch (error) {
      alert(error.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const closeOtpPopup = () => {
    setShowLoginForm(false);
    setOtpSent(false);
    setPendingItem(null);
    setLoginData({
      name: "",
      email: "",
      otp: "",
    });
  };

  return (
    <>
      <Header />

      <section className="bg-[#f8f4ea] min-h-screen pt-10 pb-28">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          {userData && (
            <div className="mb-6 flex justify-end items-center gap-3 text-[#2f4f2f] font-medium">
              <span>Welcome, {userData.name}</span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-[#b48a2c] text-white text-[13px] hover:opacity-90 transition"
              >
                Logout
              </button>
            </div>
          )}

          <h1 className="text-[36px] sm:text-[48px] text-center font-semibold text-[#b48a2c] mb-10">
            Your Wishlist
          </h1>

          {wishlistItems.length === 0 ? (
            <p className="text-[#2f4f2f] text-[16px] text-center">
              Your wishlist is empty.
            </p>
          ) : (
            <div className="flex flex-wrap gap-6">
              {wishlistItems.map((item) => {
                const itemId = getProductId(item);

                return (
                  <div
                    key={itemId}
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
                        {formatPrice(item.price)}
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
                        onClick={() => removeFromWishlist(itemId)}
                        className="text-[#b23a3a] text-[16px] font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {showLoginForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="relative w-full max-w-[420px] bg-white rounded-2xl border border-[#e7dcc3] shadow-xl p-6">
            <button
              onClick={closeOtpPopup}
              className="absolute top-4 right-4 text-[#2f4f2f]"
            >
              <X size={20} />
            </button>

            <h2 className="text-[24px] font-semibold text-[#b48a2c] mb-2">
              Email OTP Verification
            </h2>

            <p className="text-[14px] text-[#666] mb-5">
              Please verify your email before adding product to cart.
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter Your Name"
                value={loginData.name}
                disabled={otpSent}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full border border-[#e7dcc3] rounded-xl px-4 py-3 outline-none text-[#2f4f2f] disabled:bg-gray-100"
              />

              <input
                type="email"
                placeholder="Enter Email Address"
                value={loginData.email}
                disabled={otpSent}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full border border-[#e7dcc3] rounded-xl px-4 py-3 outline-none text-[#2f4f2f] disabled:bg-gray-100"
              />

              {otpSent && (
                <input
                  type="tel"
                  placeholder="Enter OTP"
                  value={loginData.otp}
                  maxLength="6"
                  onChange={(e) =>
                    setLoginData((prev) => ({
                      ...prev,
                      otp: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  className="w-full border border-[#e7dcc3] rounded-xl px-4 py-3 outline-none text-[#2f4f2f]"
                />
              )}

              {!otpSent ? (
                <button
                  onClick={sendOtp}
                  disabled={otpLoading}
                  className="w-full bg-[#2f4f2f] text-white rounded-xl py-3 font-medium hover:opacity-90 transition disabled:opacity-60"
                >
                  {otpLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              ) : (
                <button
                  onClick={verifyOtp}
                  disabled={otpLoading}
                  className="w-full bg-[#2f4f2f] text-white rounded-xl py-3 font-medium hover:opacity-90 transition disabled:opacity-60"
                >
                  {otpLoading ? "Verifying..." : "Verify & Add to Cart"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}