import { Leaf, ShieldCheck, Truck, Users } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    id: 1,
    icon: Leaf,
    title: "Pure & Trusted Products",
    desc: "We focus on quality products designed for everyday wellness, home care, and personal care with a trusted standard.",
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "Quality Commitment",
    desc: "Every product is selected with care to ensure reliability, safety, and premium value for our customers.",
  },
  {
    id: 3,
    icon: Truck,
    title: "Fast & Reliable Service",
    desc: "We aim to deliver a smooth shopping experience with dependable support and efficient service.",
  },
  {
    id: 4,
    icon: Users,
    title: "Customer First",
    desc: "Our priority is building long-term relationships through honest service, helpful support, and satisfaction.",
  },
];

export default function AboutSection() {
  return (
    <section className="bg-[#f8f4ea] py-14 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <p className="text-[13px] uppercase tracking-[0.2em] text-[#2f4f2f] font-medium">
              About Magical Herbal Care
            </p>

            <h1 className="mt-4 font-serif text-[34px] sm:text-[42px] lg:text-[58px] leading-[1.02] text-[#b48a2c]">
              Perfect care,
              <br />
              trusted for every home
            </h1>

            <p className="mt-6 text-[#2f4f2f] text-[15px] sm:text-[16px] leading-8 max-w-[620px]">
              We are a passionate herbal care brand dedicated to providing
              natural and effective solutions for your hair and skin. Ouyr
              products are carefully crafted using high-quality herbal
              ingredients, keeping traditional remedies and modern needs in
              mind. We believe in the power of nature and aim to create safe,
              gentle, and chemical-free products that suit all age groups. Each
              product is made with care to deliver the best results while
              maintaining purity and authenticity. Our mission is to promote
              healthy self-care with products you can trust. We focus on
              quality, honesty, and customer satisfaction in everything we do
            </p>

            <Link to="/shop">
              <button
                className="mt-8 w-fit bg-[#2f4f2f] text-white font-semibold
                text-[14px] px-8 py-4 rounded-full uppercase hover:opacity-90 transition"
              >
                Explore Now
              </button>
            </Link>
          </div>

          <div className="rounded-[24px] overflow-hidden bg-white shadow-sm border border-[#e7dcc3]">
            <img
              src="/fabout.png"
              alt="About Herbal Care"
              className="w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover"
            />
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="rounded-[24px] bg-white p-6 sm:p-8 lg:p-10 shadow-sm border border-[#e7dcc3]">
            <h2 className="font-serif text-[28px] sm:text-[34px] text-[#b48a2c]">
              Our Story
            </h2>

            <p className="mt-5 text-[#2f4f2f] text-[15px] sm:text-[16px] leading-8">
              Freshiya was built with a simple goal — to bring trusted products
              into one clean and premium shopping experience. We want customers
              to discover products that feel useful, reliable, and right for
              everyday life.
            </p>

            <p className="mt-4 text-[#2f4f2f] text-[15px] sm:text-[16px] leading-8">
              From home essentials to personal care, we continue to grow with a
              strong focus on quality, presentation, and customer satisfaction.
            </p>
          </div>

          <div className="rounded-[24px] bg-[#e7dcc3] p-6 sm:p-8 lg:p-10 shadow-sm">
            <h2 className="font-serif text-[28px] sm:text-[34px] text-[#b48a2c]">
              Our Mission
            </h2>

            <p className="mt-5 text-[#2f4f2f] text-[15px] sm:text-[16px] leading-8">
              To offer quality-focused products with a smooth, trustworthy, and
              customer-friendly shopping experience.
            </p>

            <h2 className="mt-8 font-serif text-[28px] sm:text-[34px] text-[#b48a2c]">
              Our Vision
            </h2>

            <p className="mt-5 text-[#2f4f2f] text-[15px] sm:text-[16px] leading-8">
              To become a dependable name for premium daily-use products that
              customers can trust and return to with confidence.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <div className="text-center">
            <h2 className="font-serif text-[30px] sm:text-[36px] lg:text-[44px] text-[#b48a2c]">
              Why Choose Us
            </h2>
            <p className="text-sm text-[#2f4f2f] mt-2">
              Quality, care, and trust in every product.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="rounded-[22px] bg-white p-6 sm:p-7 text-center shadow-sm border border-[#e7dcc3]"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#2f4f2f]/10 flex items-center justify-center">
                    <Icon className="text-[#2f4f2f]" size={26} />
                  </div>

                  <h3 className="mt-5 text-[18px] sm:text-[20px] font-medium text-[#b48a2c]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[14px] sm:text-[15px] leading-7 text-[#5b5b5b]">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
