import { Link } from "react-router-dom";

export default function OrderSuccess() {
  const order = JSON.parse(localStorage.getItem("lastOrder"));

  const downloadInvoice = () => {
    window.print();
  };

  return (
    <section className="min-h-screen bg-[#f8f4ea] flex items-center justify-center px-4 py-16">
      <div className="bg-white border border-[#e7dcc3] rounded-2xl shadow-sm max-w-[700px] w-full p-8 text-center">
        <h1 className="text-[34px] font-semibold text-[#b48a2c]">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 text-[#2f4f2f]">
          Thank you for shopping with Magical Herbal Care.
        </p>

        {order && (
          <div className="mt-6 text-left border border-[#e7dcc3] rounded-xl p-5">
            <p className="text-[#2f4f2f]">
              <strong>Order No:</strong> {order.orderNumber || order._id}
            </p>

            <p className="text-[#2f4f2f] mt-2">
              <strong>Payment:</strong> {order.paymentMethod} /{" "}
              {order.paymentStatus}
            </p>

            <p className="text-[#2f4f2f] mt-2">
              <strong>Total:</strong> Rs. {Number(order.totalAmount || 0).toFixed(2)}
            </p>

            <div className="mt-4">
              <strong className="text-[#b48a2c]">Products:</strong>

              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="mt-3 flex justify-between border-b border-[#eee] pb-2"
                >
                  <span className="text-[#2f4f2f]">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="text-[#2f4f2f]">
                    Rs. {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={downloadInvoice}
            className="bg-[#2f4f2f] text-white px-7 py-3 rounded-full hover:opacity-90 transition"
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
    </section>
  );
}