import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPrice = (value) => {
    if (typeof value === "number") return value;
    if (!value) return 0;

    const match = String(value).replace(/,/g, "").match(/\d+(\.\d+)?/);
    return match ? Number(match[0]) : 0;
  };

  const formatPrice = (amount) => {
    return `Rs. ${Number(amount || 0).toFixed(2)}`;
  };

  const getOrderTotal = (orderData) => {
    const savedTotal = getPrice(
      orderData?.totalAmount || orderData?.total || orderData?.amount
    );

    if (savedTotal > 0) return savedTotal;

    return (orderData?.items || []).reduce((sum, item) => {
      return sum + getPrice(item.price) * Number(item.quantity || 1);
    }, 0);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE_URL}/api/orders/${id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch order");
        }

        setOrder(data.order);
      } catch (error) {
        console.error("Order details fetch error:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full">
        <p className="text-[#2f4f2f]">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full">
        <h1 className="text-3xl font-bold text-[#2f4f2f] mb-6">
          Order Details
        </h1>

        <div className="bg-white border border-[#e7dcc3] rounded-2xl p-6 text-[#2f4f2f]">
          Order not found.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#2f4f2f]">
          Order Details
        </h1>

        <Link
          to="/admin/orders"
          className="bg-[#2f4f2f] text-white px-5 py-2.5 rounded-xl hover:bg-[#b48a2c] transition"
        >
          Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e7dcc3] rounded-2xl p-6 text-[#2f4f2f]">
          <h2 className="text-xl font-semibold text-[#b48a2c] mb-4">
            Customer Details
          </h2>

          <p><b>Name:</b> {order.customer?.name || "-"}</p>
          <p><b>Email:</b> {order.customer?.email || "-"}</p>
          <p><b>Phone:</b> {order.customer?.phone || "-"}</p>
          <p>
            <b>Address:</b>{" "}
            {order.customer?.address || "-"}, {order.customer?.city || ""},{" "}
            {order.customer?.state || ""} - {order.customer?.pincode || ""}
          </p>
        </div>

        <div className="bg-white border border-[#e7dcc3] rounded-2xl p-6 text-[#2f4f2f]">
          <h2 className="text-xl font-semibold text-[#b48a2c] mb-4">
            Order Info
          </h2>

          <p><b>Order ID:</b> {order.orderNumber || order._id}</p>
          <p><b>Payment Method:</b> {order.paymentMethod || "-"}</p>
          <p><b>Payment Status:</b> {order.paymentStatus || "Pending"}</p>
          <p><b>Order Status:</b> {order.orderStatus || "Pending"}</p>
          <p>
            <b>Date:</b>{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "-"}
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white border border-[#e7dcc3] rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-[#b48a2c] mb-4">
          Products
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-[#f1e6ce] text-[#b48a2c]">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Price</th>
                <th className="p-4">Total</th>
              </tr>
            </thead>

            <tbody>
              {(order.items || []).map((item, index) => {
                const price = getPrice(item.price);
                const qty = Number(item.quantity || 1);

                return (
                  <tr key={index} className="border-t border-[#e7dcc3]">
                    <td className="p-4 text-[#2f4f2f]">
                      {item.name || "Product"}
                    </td>
                    <td className="p-4 text-[#2f4f2f]">{qty}</td>
                    <td className="p-4 text-[#2f4f2f]">
                      {formatPrice(price)}
                    </td>
                    <td className="p-4 text-[#b48a2c] font-semibold">
                      {formatPrice(price * qty)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-5 text-right text-xl font-bold text-[#b48a2c]">
          Grand Total: {formatPrice(getOrderTotal(order))}
        </div>
      </div>
    </div>
  );
}