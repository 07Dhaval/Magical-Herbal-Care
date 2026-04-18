import { useEffect, useState } from "react";
import s3 from "../assets/hand.png";
import { Link } from "react-router-dom";

const heroSlides = [
  {
    id: 1,
    title: (
      <>
        Perfect
        <br />
        You’re Unique
      </>
    ),
    desc: "Your Health must be taken care of every day.",
    image: s3,
  },
  {
    id: 2,
    title: (
      <>
        Nature’s
        <br />
        Magic Care
      </>
    ),
    desc: "Pure herbal wellness inspired by nature and beauty.",
    image: s3,
  },
  {
    id: 3,
    title: (
      <>
        Herbal
        <br />
        Everyday Glow
      </>
    ),
    desc: "Premium care products for your daily healthy lifestyle.",
    image: s3,
  },
];

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
  // {
  //   id: 3,
  //   name: "Sanitary Napkin",
  //   image: "/s2.jpeg",
  // },
  // {
  //   id: 4,
  //   name: "Premium Essentials Combo",
  //   image: "/s3.jpeg",
  // },
  // {
  //   id: 5,
  //   name: "Premium Tea",
  //   image: "/s4.jpeg",
  // },
];

export default function HomePage1() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="bg-[#f6f3eb] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-0">
          <div className="relative min-h-[500px] lg:min-h-[600px]">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`grid grid-cols-1 md:grid-cols-2 items-center min-h-[500px] lg:min-h-[600px] gap-8 lg:gap-10 transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0 relative"
                    : "opacity-0 translate-x-8 absolute inset-0 pointer-events-none"
                }`}
              >
                {/* Left Content */}
                <div className="flex flex-col justify-center pb-10 md:pb-16">
                  <h1 className="text-[48px] sm:text-[58px] lg:text-[78px] leading-[0.95] font-serif text-[#6b4b1f] uppercase">
                    {slide.title}
                  </h1>

                  <p className="mt-8 text-[#456b3d] text-[16px] sm:text-[18px] max-w-md">
                    {slide.desc}
                  </p>

                  <Link to="/shop">
                    <button className="mt-8 w-fit bg-[#2f5d3a] text-white font-semibold text-[14px] px-8 py-4 rounded-full uppercase hover:bg-[#6b4b1f] transition">
                      Explore Now
                    </button>
                  </Link>

                  {/* Dots */}
                  <div className="flex items-center gap-3 mt-8">
                    {heroSlides.map((_, dotIndex) => (
                      <button
                        key={dotIndex}
                        onClick={() => setCurrentSlide(dotIndex)}
                        className={`h-3 rounded-full transition-all duration-300 ${
                          currentSlide === dotIndex
                            ? "w-8 bg-[#b48a2c]"
                            : "w-3 bg-[#cdbf9c]"
                        }`}
                        aria-label={`Go to slide ${dotIndex + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Image */}
                <div className="relative mt-2 mb-4 w-full h-[420px] sm:h-[520px] lg:h-[650px] flex items-center justify-center md:justify-end">
                  <div className="w-full h-full max-w-[700px] bg-[#fffdf8] rounded-[30px] border border-[#e7dcc3] shadow-sm flex items-center justify-center p-4 sm:p-6">
                    <img
                      src={slide.image}
                      alt="Product"
                      className="w-full h-full object-contain object-center"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-10 bg-[#d8c38a]" />
      </section>

      <section className="py-14 bg-[#f6f3eb]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center">
            <h2 className="font-serif text-[30px] sm:text-[36px] text-[#6b4b1f]">
              You Might Like
            </h2>
            <p className="text-sm text-[#456b3d] mt-2">
              Your Health must be taken care of every day.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 items-start">
            {categories.map((item) => (
              <div key={item.id} className="text-center">
                <div className="overflow-hidden bg-[#fffdf8] border border-[#e7dcc3] shadow-sm rounded-[18px] flex items-center justify-center p-2 transition hover:shadow-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-auto object-contain"
                  />
                </div>

                <h3 className="mt-4 text-[16px] sm:text-[18px] font-medium text-[#2f5d3a]">
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