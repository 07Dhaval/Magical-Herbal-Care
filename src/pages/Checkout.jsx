import React, { useEffect, useMemo, useState } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

const normalizeCheckoutItem = (item) => {
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

export default function Checkout() {
  const navigate = useNavigate();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(getRegisteredUser());
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [pendingCOD, setPendingCOD] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    otp: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const checkoutMode = localStorage.getItem("checkoutMode");
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const buyNowItem = JSON.parse(localStorage.getItem("buyNowItem"));

    const normalizedCartItems = cartItems
      .map(normalizeCheckoutItem)
      .filter((item) => getProductId(item));

    if (checkoutMode === "cart") {
      setCheckoutItems(normalizedCartItems);
      localStorage.removeItem("buyNowItem");
      localStorage.setItem("cartItems", JSON.stringify(normalizedCartItems));
      return;
    }

    if (checkoutMode === "buyNow" && buyNowItem) {
      setCheckoutItems([normalizeCheckoutItem(buyNowItem)]);
      return;
    }

    if (normalizedCartItems.length > 0) {
      setCheckoutItems(normalizedCartItems);
      localStorage.removeItem("buyNowItem");
      localStorage.setItem("checkoutMode", "cart");
      localStorage.setItem("cartItems", JSON.stringify(normalizedCartItems));
      return;
    }

    if (buyNowItem) {
      setCheckoutItems([normalizeCheckoutItem(buyNowItem)]);
      localStorage.setItem("checkoutMode", "buyNow");
      return;
    }

    setCheckoutItems([]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setUserData(getRegisteredUser());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalPrice = useMemo(() => {
    return checkoutItems.reduce(
      (sum, item) => sum + parsePrice(item.price) * Number(item.quantity || 1),
      0
    );
  }, [checkoutItems]);

  const handleLogout = () => {
    localStorage.removeItem("registeredUser");
    setUserData(null);
  };

  const formatPrice = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`;

  const saveCheckoutItems = (items) => {
    const normalized = items
      .map(normalizeCheckoutItem)
      .filter((item) => getProductId(item));

    setCheckoutItems(normalized);

    const checkoutMode = localStorage.getItem("checkoutMode");

    if (normalized.length === 0) {
      localStorage.removeItem("cartItems");
      localStorage.removeItem("buyNowItem");
      localStorage.removeItem("checkoutMode");
      window.dispatchEvent(new Event("cartUpdated"));
      return;
    }

    if (checkoutMode === "cart") {
      localStorage.setItem("cartItems", JSON.stringify(normalized));
    }

    if (checkoutMode === "buyNow") {
      localStorage.setItem("buyNowItem", JSON.stringify(normalized[0]));
    }

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQty = (id) => {
    const updated = checkoutItems.map((item) =>
      getProductId(item) === id
        ? { ...item, quantity: Number(item.quantity || 1) + 1 }
        : item
    );

    saveCheckoutItems(updated);
  };

  const decreaseQty = (id) => {
    const updated = checkoutItems.map((item) =>
      getProductId(item) === id
        ? { ...item, quantity: Math.max(1, Number(item.quantity || 1) - 1) }
        : item
    );

    saveCheckoutItems(updated);
  };

  const removeCheckoutItem = (id) => {
    const updated = checkoutItems.filter((item) => getProductId(item) !== id);
    saveCheckoutItems(updated);
  };

  const fetchPincodeDetails = async (pincode) => {
    if (pincode.length !== 6) return;

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (data[0]?.Status === "Success") {
        const postOffice = data[0].PostOffice[0];

        setFormData((prev) => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State,
        }));
      }
    } catch (error) {
      console.error("Pincode fetch error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const cleanValue =
      name === "phone" || name === "pincode"
        ? value.replace(/\D/g, "")
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: cleanValue,
    }));

    if (name === "pincode") fetchPincodeDetails(cleanValue);
  };

  const validateForm = () => {
    const { name, email, phone, address, city, state, pincode } = formData;

    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      alert("Please fill all checkout details.");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Enter a valid email address.");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Enter a valid 10-digit phone number.");
      return false;
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert("Enter a valid 6-digit pincode.");
      return false;
    }

    return true;
  };

  const cleanItemsForOrder = () => {
    return checkoutItems.map((item) => ({
      productId: getProductId(item),
      name: item.name || "Product",
      category: item.category || "",
      image: item.image || "",
      price: parsePrice(item.price),
      quantity: Number(item.quantity) || 1,
    }));
  };

  const clearCartAndGoSuccess = (order) => {
    const finalOrder = {
      ...order,
      customer: order?.customer || formData,
      items:
        Array.isArray(order?.items) && order.items.length > 0
          ? order.items
          : cleanItemsForOrder(),
      totalAmount: order?.totalAmount || totalPrice,
      paymentMethod: order?.paymentMethod || "COD",
      paymentStatus: order?.paymentStatus || "Pending",
      orderStatus: order?.orderStatus || "Pending",
      createdAt: order?.createdAt || new Date().toISOString(),
    };

    localStorage.setItem("lastOrder", JSON.stringify(finalOrder));
    localStorage.setItem("invoiceData", JSON.stringify(finalOrder));
    localStorage.setItem("orderData", JSON.stringify(finalOrder));

    localStorage.removeItem("buyNowItem");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("checkoutMode");

    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/order-success");
  };

  const saveOrderToBackend = async (payload) => {
    const res = await fetch(`${API_BASE_URL}/api/orders/payment-success`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Order save failed");
    }

    return data.order;
  };

  const placeCODOrder = async () => {
    if (!validateForm()) return;

    if (checkoutItems.length === 0) {
      alert("No items found for checkout.");
      return;
    }

    try {
      setLoading(true);

      const savedOrder = await saveOrderToBackend({
        customer: formData,
        items: cleanItemsForOrder(),
        totalAmount: totalPrice,
        paymentMethod: "COD",
        paymentStatus: "Pending",
        orderStatus: "Pending",
        razorpayOrderId: "",
        razorpayPaymentId: "",
        razorpaySignature: "",
      });

      clearCartAndGoSuccess(savedOrder);
    } catch (error) {
      console.error("COD order error:", error);
      alert(error.message || "COD order failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCOD = async () => {
    const user = getRegisteredUser();

    if (!user) {
      setUserData(null);
      setPendingCOD(true);
      setShowLoginForm(true);
      return;
    }

    await placeCODOrder();
  };

  const sendOtp = async () => {
    if (!loginData.name.trim()) return alert("Please enter your name");

    if (!/^\S+@\S+\.\S+$/.test(loginData.email)) {
      return alert("Enter valid email address");
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
    if (!loginData.otp.trim()) return alert("Please enter OTP");

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
      setLoginData({ name: "", email: "", otp: "" });

      if (pendingCOD) {
        setPendingCOD(false);
        setTimeout(() => {
          placeCODOrder();
        }, 100);
      }
    } catch (error) {
      alert(error.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const closeOtpPopup = () => {
    setShowLoginForm(false);
    setOtpSent(false);
    setPendingCOD(false);
    setLoginData({ name: "", email: "", otp: "" });
  };

  const handlePayment = async () => {
    const user = getRegisteredUser();

    if (!user) {
      setUserData(null);
      setShowLoginForm(true);
      return;
    }

    if (!validateForm()) return;

    if (checkoutItems.length === 0) {
      alert("No items found for checkout.");
      return;
    }

    try {
      setLoading(true);

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load.");
      }

      const orderRes = await fetch(`${API_BASE_URL}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success || !orderData.order) {
        throw new Error(orderData?.message || "Failed to create Razorpay order.");
      }

      const options = {
        key: orderData.key || orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Magical Herbal Care",
        description: "Order Payment",
        order_id: orderData.order.id,

        handler: async function (response) {
          try {
            const savedOrder = await saveOrderToBackend({
              customer: formData,
              items: cleanItemsForOrder(),
              totalAmount: totalPrice,
              paymentMethod: "Razorpay",
              paymentStatus: "Paid",
              orderStatus: "Pending",
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            clearCartAndGoSuccess(savedOrder);
          } catch (error) {
            console.error("Payment save error:", error);
            alert(error.message || "Payment succeeded, but saving order failed.");
          }
        },

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },

        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        },

        theme: {
          color: "#2f4f2f",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response.error);
        alert(response.error?.description || "Payment failed.");
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment start error:", error);
      alert(error.message || "Something went wrong while starting payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <section className="min-h-screen bg-[#f8f4ea] py-10">
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
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
            <div className="bg-white rounded-2xl border border-[#e7dcc3] shadow-sm p-5 sm:p-7">
              <h2 className="text-[22px] font-semibold text-[#b48a2c] mb-6">
                Billing Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="input"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="input"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  maxLength="10"
                  className="input"
                />
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="input"
                />
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="input"
                />
                <input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  maxLength="6"
                  className="input"
                />
              </div>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full Address"
                rows="4"
                className="input mt-4 resize-none"
              />
            </div>

            <div className="bg-white rounded-2xl border border-[#e7dcc3] shadow-sm p-5 sm:p-6 h-fit sticky top-24">
              <h2 className="text-[22px] font-semibold text-[#b48a2c] mb-5">
                Order Summary
              </h2>

              {checkoutItems.length === 0 ? (
                <p className="text-[#2f4f2f] text-[14px]">
                  No items found for checkout.
                </p>
              ) : (
                <div className="space-y-4">
                  {checkoutItems.map((item) => {
                    const itemId = getProductId(item);

                    return (
                      <div
                        key={itemId}
                        className="flex items-start justify-between gap-3 border-b border-[#f0eadc] pb-3"
                      >
                        <div className="flex-1">
                          <p className="text-[15px] font-medium text-[#b48a2c]">
                            {item.name}
                          </p>

                          <p className="text-[13px] text-[#7c8a72]">
                            {item.category}
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => decreaseQty(itemId)}
                              className="w-7 h-7 rounded-full border border-[#e7dcc3] flex items-center justify-center text-[#2f4f2f] hover:bg-[#f8f4ea]"
                            >
                              <Minus size={13} />
                            </button>

                            <span className="min-w-[24px] text-center text-[13px] text-[#2f4f2f] font-semibold">
                              {item.quantity || 1}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQty(itemId)}
                              className="w-7 h-7 rounded-full border border-[#e7dcc3] flex items-center justify-center text-[#2f4f2f] hover:bg-[#f8f4ea]"
                            >
                              <Plus size={13} />
                            </button>

                            <button
                              type="button"
                              onClick={() => removeCheckoutItem(itemId)}
                              className="ml-2 w-7 h-7 rounded-full border border-red-200 flex items-center justify-center text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <p className="text-[14px] font-semibold text-[#b48a2c] whitespace-nowrap">
                          {formatPrice(
                            parsePrice(item.price) * Number(item.quantity || 1)
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-[#e7dcc3] flex items-center justify-between">
                <span className="text-[17px] font-semibold text-[#b48a2c]">
                  Total
                </span>
                <span className="text-[18px] font-bold text-[#b48a2c]">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={loading || checkoutItems.length === 0}
                  className="w-full rounded-xl bg-[#2f4f2f] text-white py-3.5 font-medium hover:opacity-90 transition disabled:opacity-60"
                >
                  {loading ? "Processing..." : "Pay with Razorpay"}
                </button>

              </div>
            </div>
          </div>
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
              Please verify your email before payment.
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
                  {otpLoading ? "Verifying..." : "Verify & Continue"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e7dcc3;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          color: #2f4f2f;
          outline: none;
          background: #fffdf8;
        }

        .input:focus {
          border-color: #b48a2c;
          box-shadow: 0 0 0 3px rgba(107, 74, 18, 0.12);
        }
      `}</style>
    </>
  );
}