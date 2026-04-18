import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ShippingPolicy() {
  return (
    <>
      <Header />
      <section className="bg-[#f6f3eb] min-h-screen py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[900px] mx-auto bg-white border border-[#e7dcc3] rounded-2xl shadow-sm p-6 sm:p-10">
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#6b4b1f] mb-6">
            Shipping Policy
          </h1>

          <div className="text-[15px] leading-8 text-[#456b3d] space-y-4">
            <p>Orders are processed within 1–3 working days.</p>
            <p>
              Delivery time: 3–7 working days (may vary based on location).
            </p>
            <p>
              Tracking details will be shared once the order is dispatched.
            </p>
            <p>
              Any delay caused by courier/logistics is beyond our control.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}