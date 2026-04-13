import React from "react";

const sellingProducts = [
  {
    id: 1,
    category: "Hair Care",
    name: "Hair Fall Shampoo",
    price: "₹249.00",
    image: "/s8.jpeg",
  },
  {
    id: 2,
    category: "Skin Care",
    name: "Vitamin C Face Wash",
    price: "₹199.00",
    image: "/s1.jpeg",
  },
  {
    id: 3,
    category: "Personal Care",
    name: "Sanitary Napkin",
    price: "₹149.00",
    image: "/s2.jpeg",
  },
  {
    id: 4,
    category: "Combo Pack",
    name: "Premium Essentials Combo",
    price: "₹899.00",
    image: "/s3.jpeg",
  },
];

const followImages = [
  "/s1.jpeg",
  "/s2.jpeg",
  "/s3.jpeg",
  "/s4.jpeg",
  "/s5.jpeg",
  "/s6.jpeg",
];

function ProductCard({ item }) {
  return (
    <div className="text-center">
      {/* IMAGE CARD (AUTO HEIGHT) */}
      <div className="overflow-hidden bg-white flex items-center justify-center">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-auto object-contain"
        />
      </div>

      <p className="mt-4 text-xs text-[#0000008F]">{item.category}</p>
      <h3 className="text-[15px] sm:text-base text-[#000000B5]">
        {item.name}
      </h3>
      <div className="mt-1 text-black text-sm">★★★★★</div>
      <p className="mt-1 font-medium text-[#000000B5]">{item.price}</p>
    </div>
  );
}

export default function HomePage3() {
  return (
    <div>
      {/* Top Selling */}
      <section className="py-14 bg-[#f3f3f3]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">

          <div className="text-center">
            <h2 className="font-serif text-[30px] sm:text-[36px] text-[#2f2f2f]">
              Top Selling
            </h2>
            <p className="text-sm text-[#555] mt-2">
              Here’s some of our most popular products people are in love with.
            </p>
          </div>

          {/* GRID */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 items-start">
            {sellingProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-16 border-t border-[#d8d8d8]" />

          {/* Follow Us */}
          <div className="pt-14">
            <div className="text-center">
              <h2 className="font-serif text-[30px] sm:text-[36px] text-[#2f2f2f]">
                Follow Us
              </h2>
              <p className="text-sm text-[#555] mt-2">
                Inspire and let yourself be inspired.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-start">
              {followImages.map((img, index) => (
                <div
                  key={index}
                  className="overflow-hidden bg-white flex items-center justify-center"
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