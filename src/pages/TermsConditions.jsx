import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TermsConditions() {
  return (
    <>
      <Header />
      <section className="bg-[#f6f3eb] min-h-screen py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[900px] mx-auto bg-white border border-[#e7dcc3] rounded-2xl shadow-sm p-6 sm:p-10">
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#6b4b1f] mb-6">
            Terms & Conditions
          </h1>

          <div className="text-[15px] leading-8 text-[#456b3d] space-y-4">
            <p>
              Welcome to Magical Herbal Care by Swati Tiwari. By accessing our
              website and purchasing from us, you agree to the following terms:
            </p>
            <p>
              All products are subject to availability and may be withdrawn anytime
              without prior notice.
            </p>
            <p>
              We reserve the right to update prices, offers, and policies at any time.
            </p>
            <p>
              Customers must provide correct and complete information while placing orders.
            </p>
            <p>
              Any fraudulent activity, misuse, or unauthorized use of this website
              may result in legal action.
            </p>
            <p>
              All content including logos, images, and text are the intellectual
              property of Magical Herbal Care by Swati Tiwari and cannot be reused
              without permission.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}