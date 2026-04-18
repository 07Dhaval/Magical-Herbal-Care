import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Disclaimer() {
  return (
    <>
      <Header />
      <section className="bg-[#f6f3eb] min-h-screen py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[900px] mx-auto bg-white border border-[#e7dcc3] rounded-2xl shadow-sm p-6 sm:p-10">
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#6b4b1f] mb-6">
            Disclaimer
          </h1>

          <div className="text-[15px] leading-8 text-[#456b3d] space-y-4">
            <p>
              Our products are made using herbal/natural ingredients, but results
              may vary for each individual.
            </p>
            <p>We recommend doing a patch test before full use.</p>
            <p>
              This product is not intended to diagnose, treat, or cure any medical condition.
            </p>
            <p>
              In case of irritation, discontinue use and consult a professional.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}