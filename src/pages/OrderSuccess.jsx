import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <>
      <Header />
      <section className="min-h-[70vh] bg-[#f6f3eb] flex items-center justify-center px-4">
        <div className="bg-white border border-[#e7dcc3] rounded-2xl shadow-sm p-8 max-w-[600px] w-full text-center">
          <h1 className="text-[32px] font-semibold text-[#2f5d3a]">
            Payment Successful
          </h1>
          <p className="mt-4 text-[#456b3d] leading-7">
            Thank you for your order. Your payment has been received successfully.
          </p>

          <Link
            to="/shop"
            className="inline-block mt-6 bg-[#2f5d3a] text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}