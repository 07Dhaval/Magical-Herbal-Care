import s3 from "../assets/s3.jpeg";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Hair Fall Shampoo",
    image: "/s8.jpeg",
  },
  {
    id: 2,
    name: "Vitamin C+ Face Wash",
    image: "/s1.jpeg",
  },
  {
    id: 3,
    name: "Sanitary Napkin",
    image: "/s2.jpeg",
  },
  {
    id: 4,
    name: "Premium Essentials Combo",
    image: "/s3.jpeg",
  },
  {
    id: 5,
    name: "Premium Tea",
    image: "/s4.jpeg",
  },
];

export default function HomePage1() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#f3f3f3] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-[500px] lg:min-h-[600px] gap-8 lg:gap-10">
            {/* Left Content */}
            <div className="flex flex-col justify-center pb-10 md:pb-16">
              <h1 className="text-[48px] sm:text-[58px] lg:text-[78px] leading-[0.95] font-serif text-[#000000BF] uppercase">
                Perfect
                <br />
                You’re Unique
              </h1>

              <p className="mt-8 text-[#5b5b5b] text-[16px] sm:text-[18px] max-w-md">
                Your Health must be taken care of every day.
              </p>

              <Link to="/shop">
                <button className="mt-8 w-fit bg-[#103258] text-white text-[14px] px-8 py-4 rounded-full uppercase hover:opacity-90 transition">
                  Explore Now
                </button>
              </Link>
            </div>

            {/* Right Image */}
            <div className="relative mt-2 mb-4 w-full h-[420px] sm:h-[520px] lg:h-[650px] flex items-center justify-center md:justify-end">
              <img
                src={s3}
                alt="Product"
                className="w-full h-full max-w-[700px] object-contain object-center"
              />
            </div>
          </div>
        </div>

        <div className="h-10 bg-[#E5D3AC]" />
      </section>

      {/* You Might Like */}
      <section className="py-14 bg-[#f3f3f3]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center">
            <h2 className="font-serif text-[30px] sm:text-[36px] text-[#2f2f2f]">
              You Might Like
            </h2>
            <p className="text-sm text-[#555] mt-2">
              Your Health must be taken care of every day.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 items-start">
            {categories.map((item) => (
              <div key={item.id} className="text-center">
                <div className="overflow-hidden bg-white shadow-sm flex items-center justify-center p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-auto object-contain"
                  />
                </div>

                <h3 className="mt-4 text-[16px] sm:text-[18px] font-medium text-[#333]">
                  {item.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
