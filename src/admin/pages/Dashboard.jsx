import { useEffect, useState } from "react";

const LOCAL_API =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const RENDER_API =
  import.meta.env.VITE_RENDER_API_BASE_URL ||
  "https://magical-herbal-care.onrender.com";

const API_BASE_URL = (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? LOCAL_API
    : RENDER_API
).replace(/\/$/, "");

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/orders`);
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (item) => item.orderStatus === "Pending"
  ).length;

  const processingOrders = orders.filter(
    (item) => item.orderStatus === "Processing"
  ).length;

  const deliveredOrders = orders.filter(
    (item) => item.orderStatus === "Delivered"
  ).length;

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-[#2f4f2f] mb-6">
        Dashboard
      </h1>

      {loading ? (
        <p className="text-[#2f4f2f]">Loading dashboard...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#b48a2c] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[#2f4f2f] text-lg">Total Orders</h3>
            <p className="text-3xl font-bold text-[#b48a2c] mt-2">
              {totalOrders}
            </p>
          </div>

          <div className="bg-white border border-[#b48a2c] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[#2f4f2f] text-lg">Pending Orders</h3>
            <p className="text-3xl font-bold text-[#b48a2c] mt-2">
              {pendingOrders}
            </p>
          </div>

          <div className="bg-white border border-[#b48a2c] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[#2f4f2f] text-lg">Processing Orders</h3>
            <p className="text-3xl font-bold text-[#b48a2c] mt-2">
              {processingOrders}
            </p>
          </div>

          <div className="bg-white border border-[#b48a2c] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[#2f4f2f] text-lg">Delivered Orders</h3>
            <p className="text-3xl font-bold text-[#b48a2c] mt-2">
              {deliveredOrders}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}