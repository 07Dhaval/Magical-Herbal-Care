import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import InvoiceButton from "../components/InvoiceButton";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch(`${API_BASE_URL}/api/orders`);
    const data = await res.json();

    if (data.success) setOrders(data.orders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchOrders();
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#b48a2c] mb-6">Orders</h1>

      <div className="overflow-x-auto bg-white border rounded-2xl">
        <table className="w-full min-w-[900px]">
          <thead className="bg-[#f3ead7] text-[#b48a2c]">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
              <th>Invoice</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="p-3">{order.orderId}</td>
                <td className="p-3">{order.customer?.name || "N/A"}</td>
                <td className="p-3 text-[#b48a2c]">₹{order.total}</td>
                <td className="p-3">
                  <span className="text-green-600">Paid</span>
                </td>
                <td className="p-3">
                  <span className="bg-yellow-100 px-3 py-1 rounded">
                    {order.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => updateStatus(order._id, "Delivered")}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Delivered
                  </button>

                  <button
                    onClick={() => updateStatus(order._id, "Cancelled")}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </td>
                <td className="p-3">
                  <InvoiceButton order={order} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
