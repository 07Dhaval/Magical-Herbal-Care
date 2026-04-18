import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RefundReturn() {
  return (
    <>
      <Header />
      <section className="bg-[#f6f3eb] min-h-screen py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[900px] mx-auto bg-white border border-[#e7dcc3] rounded-2xl shadow-sm p-6 sm:p-10">
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#6b4b1f] mb-6">
            Refund & Return
          </h1>

          <div className="text-[15px] leading-8 text-[#456b3d] space-y-4">
            <p>We aim for 100% customer satisfaction.</p>
            <p>
              Returns are accepted only for damaged, defective, or incorrect products.
            </p>
            <p>
              Request must be raised within 48 hours of delivery with proper proof
              (photo/video).
            </p>
            <p>Product should be unused and in original packaging.</p>
            <p>
              Once approved, refund will be processed within 5–7 business days.
            </p>
            <p>No return/refund for used products or change of mind.</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}