import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <section className="bg-[#f6f3eb] min-h-screen py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[900px] mx-auto bg-white border border-[#e7dcc3] rounded-2xl shadow-sm p-6 sm:p-10">
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#6b4b1f] mb-6">
            Privacy Policy
          </h1>

          <div className="text-[15px] leading-8 text-[#456b3d] space-y-4">
            <p>
              At Magical Herbal Care by Swati Tiwari, we respect and protect your privacy.
            </p>
            <p>
              We collect personal information (Name, Contact, Address) only to
              process your orders smoothly.
            </p>
            <p>
              Your data is stored securely and never sold or shared with third parties.
            </p>
            <p>
              We may use your contact details to send order updates, offers, or
              important notifications.
            </p>
            <p>
              Our payment partners ensure safe and encrypted transactions.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}