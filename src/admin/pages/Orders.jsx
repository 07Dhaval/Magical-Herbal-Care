import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import ordersData from "../data/ordersData";

export default function Orders() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(ordersData.map((item) => item.category))];

  const filteredOrders =
    selectedCategory === "All"
      ? ordersData
      : ordersData.filter((item) => item.category === selectedCategory);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        
        <h1 className="text-3xl font-bold text-[#b48a2c]">
          Orders
        </h1>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-[#e7dcc3] rounded-xl px-4 py-3 bg-white outline-none text-[#2f4f2f] focus:border-[#b48a2c]"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white border border-[#e7dcc3] rounded-2xl shadow-sm">
        <table className="w-full min-w-[900px]">
          
          <thead className="bg-[#f3ead7]">
            <tr className="text-left text-[#b48a2c]">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-[#e7dcc3] text-[#2f4f2f] hover:bg-[#f9f6ef] transition"
              >
                <td className="px-4 py-3">{order.id}</td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3">{order.productName}</td>
                <td className="px-4 py-3">{order.category}</td>
                <td className="px-4 py-3">{order.quantity}</td>
                <td className="px-4 py-3">₹{order.price}</td>
                <td className="px-4 py-3 font-medium text-[#b48a2c]">
                  ₹{order.total}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                      order.status === "Delivered"
                        ? "bg-[#e6f4ea] text-[#2f6f3e]"
                        : "bg-[#fff4e5] text-[#b48a2c]"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">{order.date}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </AdminLayout>
  );
}