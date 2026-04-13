import React from "react";
import s8 from "../assets/s8.jpeg";
import { Link } from "react-router-dom";

const offerProducts = [
  {
    id: 1,
    category: "Hair Care",
    name: "Hair Fall Shampoo",
    price: "MRP Rs. 249.00",
    image: "/s8.jpeg",
  },
  {
    id: 2,
    category: "Skin Care",
    name: "Vitamin C+ Face Wash",
    price: "MRP Rs. 199.00",
    image: "/s1.jpeg",
  },
  {
    id: 3,
    category: "Personal Care",
    name: "Sanitary Napkin",
    price: "MRP Rs. 149.00",
    image: "/s2.jpeg",
  },
  {
    id: 4,
    category: "Combo Pack",
    name: "Premium Essentials Combo",
    price: "MRP Rs. 899.00",
    image: "/s3.jpeg",
  },
];

function ProductCard({ item }) {
  return (
    <div className="text-center flex flex-col items-center">
      {/* IMAGE CARD (AUTO SIZE) */}
      <div className="bg-white flex items-center justify-center p-3 max-w-[260px] w-full">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-auto object-contain"
        />
      </div>

      <p className="mt-4 text-xs text-[#0000008F]">{item.category}</p>

      <h3 className="mt-1 text-[15px] sm:text-[16px] text-[#000000]">
        {item.name}
      </h3>

      <div className="mt-1 text-black text-sm tracking-[2px]">★★★★★</div>

      <p className="mt-1 font-medium text-[#000000]">{item.price}</p>
    </div>
  );
}

export default function HomePage2() {
  return (
    <>
      {/* Top Offers */}
      <section className="py-14 bg-[#f3f3f3]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center">
            <h2 className="font-serif text-[30px] sm:text-[36px] text-[#2f2f2f]">
              Top Offers
            </h2>

            <p className="text-sm text-[#555] mt-2">
              Here’s some of our most popular products people are in love with.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
            {offerProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-[#F4E9D6]">
        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
          {/* LEFT */}
          <div className="flex flex-col justify-center items-center text-center px-6 py-16 bg-[#e6dcc6]">
            <img src="/a.png" alt="Authentic" className="w-[160px] mb-6" />

            <h2 className="font-serif text-[36px] text-[#000000]">
              Make You’re Unique
            </h2>

            <p className="mt-3 text-[#000000]">
              Your Health must be taken care of every day.
            </p>

            <Link to="/shop">
              <button className="mt-8 bg-black text-white px-7 py-3 rounded-full uppercase tracking-wide">
                Explore Now
              </button>
            </Link>
          </div>

          {/* RIGHT */}
          <div className="h-[520px] w-full bg-[#f4e9d6] flex items-center justify-center">
            <img
              src={s8}
              alt="Promo"
              className="w-full h-full object-contain p-6"
            />
          </div>
        </div>
      </section>
    </>
  );
}
