import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, X } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const LOGIN_DURATION = 5 * 60 * 1000;

const getRegisteredUser = () => {
  const savedUser = JSON.parse(localStorage.getItem("registeredUser"));

  if (!savedUser) return null;

  if (Date.now() > savedUser.expiryTime) {
    localStorage.removeItem("registeredUser");
    return null;
  }

  return savedUser;
};

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState(getRegisteredUser());
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    otp: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCart);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginData.email }),
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
        headers: { "Content-Type": "application/json" },
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

      setOtpSent(false);
      setLoginData({
        name: "",
        email: "",
        otp: "",
      });

      if (pendingCheckout) {
        setPendingCheckout(false);
        navigate("/checkout");
      }
    } catch (error) {
      alert(error.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleCheckout = () => {
    const user = getRegisteredUser();

    if (!user) {
      setUserData(null);
      setPendingCheckout(true);
      setShowLoginForm(true);
      return;
    }

    navigate("/checkout");
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleBuyNow = (item) => {
    localStorage.setItem("buyNowItem", JSON.stringify([item]));

    const user = getRegisteredUser();

    if (!user) {
      setUserData(null);
      setPendingCheckout(true);
      setShowLoginForm(true);
      return;
    }

    navigate("/checkout");
  };

  const closeOtpPopup = () => {
    setShowLoginForm(false);
    setPendingCheckout(false);
    setOtpSent(false);
    setLoginData({
      name: "",
      email: "",
      otp: "",
    });
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

          <h1 className="text-[30px] sm:text-[38px] font-semibold text-center text-[#b48a2c] mb-10">
            Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center text-[#2f4f2f] text-[16px]">
              Your cart is empty.
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-10 items-start">
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
                  onClick={handleCheckout}
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
              Please verify your email before checkout.
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
                  {otpLoading ? "Verifying..." : "Verify & Checkout"}
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