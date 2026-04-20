import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Checkout() {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(false);

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
    const buyNowItem =
      JSON.parse(localStorage.getItem("buyNowItem")) || null;
    const cartItems =
      JSON.parse(localStorage.getItem("cartItems")) || [];

    if (buyNowItem && buyNowItem.length > 0) {
      setCheckoutItems(buyNowItem);
    } else {
      setCheckoutItems(cartItems);
    }
  }, []);

  const parsePrice = (price) => {
    if (!price) return 0;
    const match = String(price).replace(/,/g, "").match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const totalPrice = useMemo(() => {
    return checkoutItems.reduce((sum, item) => sum + parsePrice(item.price), 0);
  }, [checkoutItems]);

  const formatPrice = (amount) => `Rs. ${amount.toFixed(2)}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, email, phone, address, city, state, pincode } = formData;

    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      alert("Please fill all checkout details.");
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

  const handlePayment = async () => {
    if (!validateForm()) return;
    if (checkoutItems.length === 0) {
      alert("No items found for checkout.");
      return;
    }

    try {
      setLoading(true);

      const orderRes = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert("Failed to create Razorpay order.");
        setLoading(false);
        return;
      }

      const options = {
        key: "rzp_test_your_key_id",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Magical Herbal Care",
        description: "Order Payment",
        image: "/magicalherbalcare_logo.jpeg",
        order_id: orderData.order.id,
        handler: async function (response) {
          const saveRes = await fetch("http://localhost:5000/api/payment-success", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...response,
              customer: formData,
              items: checkoutItems,
              total: totalPrice,
            }),
          });

          const saveData = await saveRes.json();

          if (saveData.success) {
            localStorage.removeItem("buyNowItem");
            localStorage.removeItem("cartItems");
            window.dispatchEvent(new Event("cartUpdated"));
            alert("Payment successful!");
            window.location.href = "/order-success";
          } else {
            alert("Payment succeeded but order saving failed.");
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
          color: "#2f4f2f", // herbal green
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while starting payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <section className="min-h-screen bg-[#f8f4ea] py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <h1 className="text-[30px] sm:text-[38px] font-semibold text-center text-[#b48a2c] mb-10">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
            
            {/* FORM */}
            <div className="bg-white rounded-2xl border border-[#e7dcc3] shadow-sm p-5 sm:p-7">
              <h2 className="text-[22px] font-semibold text-[#b48a2c] mb-6">
                Billing Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="input" />
                <input name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="input" />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="input" />
                <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="input" />
                <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="input" />
                <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" className="input" />
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

            {/* SUMMARY */}
            <div className="bg-white rounded-2xl border border-[#e7dcc3] shadow-sm p-5 sm:p-6 h-fit sticky top-24">
              <h2 className="text-[22px] font-semibold text-[#b48a2c] mb-5">
                Order Summary
              </h2>

              <div className="space-y-4">
                {checkoutItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 border-b border-[#f0eadc] pb-3"
                  >
                    <div className="flex-1">
                      <p className="text-[15px] font-medium text-[#b48a2c]">
                        {item.name}
                      </p>
                      <p className="text-[13px] text-[#7c8a72]">
                        {item.category}
                      </p>
                    </div>

                    <p className="text-[14px] font-semibold text-[#b48a2c] whitespace-nowrap">
                      {formatPrice(parsePrice(item.price))}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-[#e7dcc3] flex items-center justify-between">
                <span className="text-[17px] font-semibold text-[#b48a2c]">
                  Total
                </span>
                <span className="text-[18px] font-bold text-[#b48a2c]">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-[#2f4f2f] text-white py-3.5 font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? "Processing..." : "Pay with Razorpay"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
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