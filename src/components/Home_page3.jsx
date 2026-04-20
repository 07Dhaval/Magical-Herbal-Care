import React from "react";
import { Link } from "react-router-dom";

const sellingProducts = [
  {
    id: 1,
    category: "Hair Care",
    name: "Hair Fall Shampoo",
    price: "580.00",
    image: "/m2.png",
  },
  {
    id: 2,
    category: "Hair Care",
    name: "Hair Fall Shampoo",
    price: "580.00",
    image: "/m1.png",
  },
];

const followImages = ["/m1.png", "/m2.png"];

function ProductCard({ item }) {
  return (
    <div className="text-center flex flex-col items-center">
      <Link to={`/product/${item.id}`} className="w-full flex justify-center">
        <div className="overflow-hidden bg-[#fffef9] border border-[#e4d8b4] rounded-[20px] shadow-sm flex items-center justify-center w-full max-w-[260px]">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-auto object-contain mx-auto"
          />
        </div>
      </Link>

      <p className="mt-4 text-xs text-[#9a7b2f] uppercase tracking-[1.2px]">
        {item.category}
      </p>
      <h3 className="text-[15px] sm:text-base text-[#2f5b2f] font-medium">
        {item.name}
      </h3>
      <div className="mt-1 text-[#c39a32] text-sm">★★★★★</div>
      <p className="mt-1 font-medium text-[#b48a2c]">{item.price}</p>
    </div>
  );
}

export default function HomePage3() {
  return (
    <div>
      <section className="py-14 bg-[#f7f3e8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          
          {/* TOP SELLING */}
          <div className="text-center">
            <h2 className="font-serif text-[30px] sm:text-[36px] text-[#b48a2c]">
              Top Selling
            </h2>
            <p className="text-sm text-[#456b3d] mt-2">
              Here’s some of our most popular products people are in love with.
            </p>
          </div>

          {/* ✅ CENTERED PRODUCTS */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 lg:gap-4">
            {sellingProducts.map((item) => (
              <div key={item.id} className="w-full sm:w-[260px] flex justify-center">
                <ProductCard item={item} />
              </div>
            ))}
          </div>

          <div className="mt-16 border-t border-[#dccfa9]" />

          {/* FOLLOW US */}
          <div className="pt-14">
            <div className="text-center">
              <h2 className="font-serif text-[30px] sm:text-[36px] text-[#b48a2c]">
                Follow Us
              </h2>
              <p className="text-sm text-[#456b3d] mt-2">
                Inspire and let yourself be inspired.
              </p>
            </div>

            {/* ✅ CENTERED FOLLOW IMAGES */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {followImages.map((img, index) => (
                <div
                  key={index}
                  className="w-[48%] sm:w-[180px] overflow-hidden bg-[#fffef9] border border-[#e4d8b4] rounded-[18px] shadow-sm flex items-center justify-center"
                >
                  <img
                    src={img}
                    alt={`Follow us ${index + 1}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}