import { useEffect, useState } from "react";

const getApiBaseUrl = () => {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const localUrl = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5000";
  const renderUrl =
    import.meta.env.VITE_RENDER_API_URL ||
    "https://magical-herbal-care.onrender.com";

  return (isLocal ? localUrl : renderUrl).replace(/\/$/, "");
};

const API_BASE_URL = getApiBaseUrl();

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOrderId = (order) => order?._id || order?.id;

  const getPrice = (value) => {
    if (typeof value === "number") return value;
    if (!value) return 0;

    const match = String(value).replace(/,/g, "").match(/\d+(\.\d+)?/);
    return match ? Number(match[0]) : 0;
  };

  const getOrderTotal = (order) => {
    const savedTotal = getPrice(order?.totalAmount || order?.total || order?.amount);

    if (savedTotal > 0) return savedTotal;

    return (order?.items || []).reduce((sum, item) => {
      return sum + getPrice(item.price) * Number(item.quantity || 1);
    }, 0);
  };

  const formatPrice = (amount) => {
    return `Rs. ${Number(amount || 0).toFixed(2)}`;
  };

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
      console.error("Admin orders fetch error:", error);
      setOrders([]);
      alert("Backend not connected. Please check server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, orderStatus) => {
    if (!id) return;

    try {
      let res = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus }),
      });

      if (!res.ok) {
        res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderStatus }),
        });
      }

      const data = await res.json();

      if (res.ok && data.success) {
        fetchOrders();
      } else {
        alert(data.message || "Status update failed");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Status update failed");
    }
  };

  const getPaymentBadge = (status) => {
    if (status === "Paid") return "bg-green-100 text-green-700";
    if (status === "Failed") return "bg-red-100 text-red-700";
    return "bg-[#f8f4ea] text-[#2f4f2f]";
  };

  const getOrderBadge = (status) => {
    if (status === "Delivered") return "bg-green-100 text-green-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    if (status === "Processing") return "bg-yellow-100 text-yellow-700";
    if (status === "Shipped") return "bg-blue-100 text-blue-700";
    return "bg-[#f8f4ea] text-[#2f4f2f]";
  };

  const printInvoice = (order) => {
    const invoiceWindow = window.open("", "_blank");

    if (!invoiceWindow) {
      alert("Please allow popup to print invoice.");
      return;
    }

    const orderTotal = getOrderTotal(order);

    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              background: #f8f4ea;
              color: #2f4f2f;
            }
            .box {
              background: white;
              padding: 25px;
              border-radius: 12px;
            }
            h1 {
              color: #b48a2c;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            th {
              background: #f1e6ce;
              color: #b48a2c;
            }
            .total {
              color: #b48a2c;
              margin-top: 20px;
            }
            @media print {
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>Magical Herbal Care</h1>
            <h2>Invoice</h2>

            <p><b>Order ID:</b> ${order.orderNumber || getOrderId(order) || "-"}</p>
            <p><b>Customer:</b> ${order.customer?.name || ""}</p>
            <p><b>Email:</b> ${order.customer?.email || ""}</p>
            <p><b>Phone:</b> ${order.customer?.phone || ""}</p>
            <p><b>Address:</b> ${[
              order.customer?.address,
              order.customer?.city,
              order.customer?.state,
              order.customer?.pincode,
            ]
              .filter(Boolean)
              .join(", ")}</p>
            <p><b>Payment:</b> ${order.paymentMethod || "Razorpay"} / ${
      order.paymentStatus || "Pending"
    }</p>
            <p><b>Status:</b> ${order.orderStatus || "Pending"}</p>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                ${(order.items || [])
                  .map((item) => {
                    const price = getPrice(item.price);
                    const qty = Number(item.quantity || 1);

                    return `
                      <tr>
                        <td>${item.name || "Product"}</td>
                        <td>${qty}</td>
                        <td>Rs. ${price.toFixed(2)}</td>
                        <td>Rs. ${(price * qty).toFixed(2)}</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>

            <h2 class="total">Total: Rs. ${orderTotal.toFixed(2)}</h2>

            <button onclick="window.print()">Print Invoice</button>
          </div>
        </body>
      </html>
    `);

    invoiceWindow.document.close();
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-[30px] font-bold text-[#b48a2c]">Orders</h1>

        <p className="mt-1 text-sm text-[#2f4f2f]">
          Manage customer orders and download invoices
        </p>
      </div>

      <div className="w-full rounded-2xl border border-[#e7dcc3] bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1150px] text-left text-sm">
            <thead className="bg-[#f1e6ce] text-[#b48a2c]">
              <tr>
                <th className="px-4 py-4">Order ID</th>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Products</th>
                <th className="px-4 py-4">Total</th>
                <th className="px-4 py-4">Payment</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Update</th>
                <th className="px-4 py-4">Invoice</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-[#2f4f2f]">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-[#2f4f2f]">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={getOrderId(order)}
                    className="border-t border-[#e7dcc3] text-[#2f4f2f]"
                  >
                    <td className="px-4 py-4 font-medium">
                      {order.orderNumber || getOrderId(order)}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-semibold">
                        {order.customer?.name || "Customer"}
                      </p>
                      <p className="text-xs">{order.customer?.phone || "-"}</p>
                    </td>

                    <td className="px-4 py-4">
                      {(order.items || []).length > 0 ? (
                        order.items.map((item, index) => (
                          <p key={index} className="text-xs mb-1">
                            {item.name || "Product"} × {item.quantity || 1}
                          </p>
                        ))
                      ) : (
                        <p className="text-xs">No products</p>
                      )}
                    </td>

                    <td className="px-4 py-4 font-semibold text-[#b48a2c]">
                      {formatPrice(getOrderTotal(order))}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getPaymentBadge(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus || "Pending"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getOrderBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus || "Pending"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={order.orderStatus || "Pending"}
                        onChange={(e) =>
                          updateStatus(getOrderId(order), e.target.value)
                        }
                        className="rounded-lg border border-[#e7dcc3] px-3 py-2"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => printInvoice(order)}
                        className="rounded-lg bg-[#2f4f2f] px-4 py-2 text-white hover:opacity-90"
                      >
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}