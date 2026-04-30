import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPrice = (value) => {
    if (typeof value === "number") return value;
    if (!value) return 0;
    const match = String(value).replace(/,/g, "").match(/\d+(\.\d+)?/);
    return match ? Number(match[0]) : 0;
  };

  const getOrderTotal = (order) => {
    const savedTotal = getPrice(order.totalAmount || order.total || order.amount);

    if (savedTotal > 0) return savedTotal;

    return (order.items || []).reduce((sum, item) => {
      return sum + getPrice(item.price) * (item.quantity || 1);
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

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Admin orders fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, orderStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus }),
      });

      const data = await res.json();

      if (data.success) {
        fetchOrders();
      } else {
        alert(data.message || "Status update failed");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Status update failed");
    }
  };

  const printInvoice = (order) => {
    const invoiceWindow = window.open("", "_blank");
    const orderTotal = getOrderTotal(order);

    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.orderNumber || order._id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f8f4ea;
              color: #2f4f2f;
              padding: 30px;
            }

            .invoice-box {
              max-width: 850px;
              margin: auto;
              background: #fff;
              padding: 30px;
              border-radius: 16px;
              border: 1px solid #e7dcc3;
            }

            .top {
              text-align: center;
              border-bottom: 1px solid #e7dcc3;
              padding-bottom: 18px;
              margin-bottom: 20px;
            }

            h1 {
              color: #b48a2c;
              margin: 0;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }

            th, td {
              border: 1px solid #e7dcc3;
              padding: 12px;
              text-align: left;
              font-size: 14px;
            }

            th {
              background: #f1e6ce;
              color: #b48a2c;
            }

            .info {
              line-height: 1.8;
            }

            .total {
              text-align: right;
              font-size: 20px;
              font-weight: bold;
              color: #b48a2c;
              margin-top: 20px;
            }

            .btn {
              margin-top: 24px;
              background: #2f4f2f;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 10px;
              cursor: pointer;
            }

            @media print {
              body {
                background: white;
              }

              .btn {
                display: none;
              }
            }
          </style>
        </head>

        <body>
          <div class="invoice-box">
            <div class="top">
              <h1>Magical Herbal Care</h1>
              <h2>Invoice</h2>
            </div>

            <div class="info">
              <p><b>Order ID:</b> ${order.orderNumber || order._id}</p>
              <p><b>Date:</b> ${
                order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : ""
              }</p>
              <p><b>Customer:</b> ${order.customer?.name || ""}</p>
              <p><b>Email:</b> ${order.customer?.email || ""}</p>
              <p><b>Phone:</b> ${order.customer?.phone || ""}</p>
              <p><b>Address:</b> ${order.customer?.address || ""}, ${
      order.customer?.city || ""
    }, ${order.customer?.state || ""} - ${order.customer?.pincode || ""}</p>
              <p><b>Payment:</b> ${order.paymentStatus || ""}</p>
              <p><b>Status:</b> ${order.orderStatus || ""}</p>
            </div>

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
                    const qty = item.quantity || 1;

                    return `
                      <tr>
                        <td>${item.name || ""}</td>
                        <td>${qty}</td>
                        <td>Rs. ${price.toFixed(2)}</td>
                        <td>Rs. ${(price * qty).toFixed(2)}</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>

            <div class="total">
              Grand Total: Rs. ${orderTotal.toFixed(2)}
            </div>

            <button class="btn" onclick="window.print()">Print / Download Invoice</button>
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
                    key={order._id}
                    className="border-t border-[#e7dcc3] align-top text-[#2f4f2f]"
                  >
                    <td className="px-4 py-4 font-medium">
                      {order.orderNumber || order._id}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-semibold">
                        {order.customer?.name || "Customer"}
                      </p>
                      <p className="text-xs">{order.customer?.phone}</p>
                      <p className="text-xs">{order.customer?.email}</p>
                    </td>

                    <td className="px-4 py-4">
                      {(order.items || []).map((item, index) => (
                        <p key={index} className="mb-1 text-xs">
                          {item.name} × {item.quantity || 1}
                        </p>
                      ))}
                    </td>

                    <td className="px-4 py-4 font-semibold text-[#b48a2c]">
                      {formatPrice(getOrderTotal(order))}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#f8f4ea] px-3 py-1 text-xs font-medium">
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#f8f4ea] px-3 py-1 text-xs font-medium">
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={order.orderStatus || "Pending"}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className="rounded-lg border border-[#e7dcc3] bg-white px-3 py-2 outline-none"
                      >
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
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