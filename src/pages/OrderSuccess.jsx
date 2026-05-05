import { Link } from "react-router-dom";

const safeJsonParse = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};

const getPrice = (value) => {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const match = String(value).replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

const formatPrice = (amount) => {
  return `Rs. ${Number(amount || 0).toFixed(2)}`;
};

const getOrderTotal = (order) => {
  const savedTotal = getPrice(order?.totalAmount || order?.total || order?.amount);

  if (savedTotal > 0) return savedTotal;

  return (order?.items || []).reduce((sum, item) => {
    return sum + getPrice(item.price) * Number(item.quantity || 1);
  }, 0);
};

export default function OrderSuccess() {
  const order =
    safeJsonParse("lastOrder", null) ||
    safeJsonParse("invoiceData", null) ||
    safeJsonParse("orderData", null);

  const customer = order?.customer || {};

  const downloadInvoice = () => {
    window.print();
  };

  return (
    <section className="min-h-screen bg-[#f8f4ea] flex items-center justify-center px-4 py-16">
      <div className="invoice-box bg-white border border-[#e7dcc3] rounded-2xl shadow-sm max-w-[760px] w-full p-8 text-center">
        <h1 className="text-[34px] font-semibold text-[#b48a2c]">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 text-[#2f4f2f]">
          Thank you for shopping with Magical Herbal Care.
        </p>

        {order ? (
          <div className="mt-6 text-left border border-[#e7dcc3] rounded-xl p-5">
            <div className="flex justify-between gap-4 flex-wrap">
              <p className="text-[#2f4f2f]">
                <strong>Order No:</strong>{" "}
                {order.orderNumber || order._id || order.id || "-"}
              </p>

              <p className="text-[#2f4f2f]">
                <strong>Date:</strong>{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-IN")
                  : new Date().toLocaleDateString("en-IN")}
              </p>
            </div>

            <p className="text-[#2f4f2f] mt-2">
              <strong>Payment:</strong> {order.paymentMethod || "Razorpay"} /{" "}
              {order.paymentStatus || "Paid"}
            </p>

            <p className="text-[#2f4f2f] mt-2">
              <strong>Order Status:</strong> {order.orderStatus || "Pending"}
            </p>

            {customer?.name && (
              <div className="mt-4 border-t border-[#eee] pt-4">
                <strong className="text-[#b48a2c]">Customer Details:</strong>

                <p className="text-[#2f4f2f] mt-2">
                  {customer.name}
                  {customer.phone ? ` | ${customer.phone}` : ""}
                </p>

                {customer.email && (
                  <p className="text-[#2f4f2f] mt-1">{customer.email}</p>
                )}

                {(customer.address || customer.city || customer.state || customer.pincode) && (
                  <p className="text-[#2f4f2f] mt-1">
                    {[customer.address, customer.city, customer.state, customer.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}

            <div className="mt-4 border-t border-[#eee] pt-4">
              <strong className="text-[#b48a2c]">Products:</strong>

              {(order.items || []).length > 0 ? (
                order.items.map((item, index) => {
                  const price = getPrice(item.price);
                  const quantity = Number(item.quantity || 1);

                  return (
                    <div
                      key={index}
                      className="mt-3 flex justify-between gap-4 border-b border-[#eee] pb-2"
                    >
                      <span className="text-[#2f4f2f]">
                        {item.name || "Product"} × {quantity}
                      </span>

                      <span className="text-[#2f4f2f] whitespace-nowrap">
                        {formatPrice(price * quantity)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="mt-3 text-[#2f4f2f]">No products found.</p>
              )}
            </div>

            <div className="mt-5 flex justify-between items-center text-[18px] font-semibold text-[#b48a2c]">
              <span>Total</span>
              <span>{formatPrice(getOrderTotal(order))}</span>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-[#2f4f2f] border border-[#e7dcc3] rounded-xl p-5">
            No order data found.
          </div>
        )}

        <div className="action-buttons mt-7 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={downloadInvoice}
            disabled={!order}
            className="bg-[#2f4f2f] text-white px-7 py-3 rounded-full hover:opacity-90 transition disabled:opacity-60"
          >
            Download Invoice
          </button>

          <Link
            to="/shop"
            className="bg-[#b48a2c] text-white px-7 py-3 rounded-full hover:opacity-90 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }

          .invoice-box,
          .invoice-box * {
            visibility: visible;
          }

          .invoice-box {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
            box-shadow: none !important;
            border: none !important;
          }

          .action-buttons {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}