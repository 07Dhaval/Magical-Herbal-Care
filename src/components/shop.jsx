import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const shopProducts = [
  {
    id: 1,
    name: "Magical Herbal Care",
    category: "Hari Care",
    image: "/magicalherbalcare_logo.jpeg",
    price: "MRP Rs. 249.00",
    description: [
      "Freshiya Premium Hair Fall Shampoo is designed to help reduce hair fall and support healthier-looking hair.",
      "Made for silky and conditioning care, suitable for all hair types.",
      "Its nourishing formula helps cleanse the scalp while keeping hair soft and manageable.",
      "A daily-use hair care essential for stronger, smoother, and refreshed hair.",
    ],
  },
  {
    id: 2,
    name: "Vitamin C+ Niacinamide Brightening Face Wash",
    category: "Skin Care",
    image: "/s1.jpeg",
    price: "MRP Rs. 199.00",
    description: [
      "A premium brightening face wash enriched with Vitamin C+ and Niacinamide for radiant-looking skin.",
      "Helps remove impurities and supports a fresh, clean, and glowing appearance.",
      "Designed for all skin types with a gentle yet effective cleansing experience.",
      "A refreshing skincare essential for daily brightening and healthy-looking skin.",
    ],
  },
  {
    id: 3,
    name: "Celebrity Choose Sanitary Napkin",
    category: "Personal Care",
    image: "/s2.jpeg",
    price: "MRP Rs. 149.00",
    description: [
      "Freshiya ultra-thin sanitary napkins with gel technology and anti-leak protection.",
      "Designed for extra comfort, extra protection, and long-lasting dry feel.",
      "Soft, skin-friendly, and made for day and night confidence.",
      "A reliable personal care product created for hygiene, comfort, and protection.",
    ],
  },
];

function ShopCard({ item }) {
  return (
    <Link
      to={`/product/${item.id}`}
      state={{ product: item }}
      className="block text-center group"
    >
      <div className="w-full max-w-[280px] h-[390px] mx-auto bg-white border border-[#e7dcc3] rounded-[20px] flex items-center justify-center overflow-hidden shadow-sm transition duration-300 group-hover:shadow-md">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain transition duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <h3 className="mt-4 text-[17px] sm:text-[16px] text-[#b48a2c] leading-none">
        {item.name}
      </h3>

      <p className="mt-2 text-[12px] text-[#2f4f2f] leading-none">
        {item.category}
      </p>
    </Link>
  );
}

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    return ["All", ...new Set(shopProducts.map((item) => item.category))];
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return shopProducts;
    return shopProducts.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section className="bg-[#f8f4ea] min-h-screen py-6 sm:py-8 md:py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center">
          <h1 className="text-[34px] sm:text-[42px] md:text-[50px] font-semibold tracking-wide uppercase text-[#b48a2c] leading-none">
            Shop All
          </h1>

          <p className="mt-4 text-[10px] sm:text-[11px] md:text-[12px] text-[#2f4f2f]">
            Explore our premium Freshiya collection across home care, hair care,
            skin care, personal care, and wellness products.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => {
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-5 py-2 text-[12px] sm:text-[13px] md:text-[14px] rounded-full border transition duration-300 ${
                  isActive
                    ? "bg-[#2f4f2f] text-white border-[#2f4f2f]"
                    : "bg-white text-[#b48a2c] border-[#e7dcc3] hover:bg-[#b48a2c] hover:text-white hover:border-[#b48a2c]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 sm:gap-x-5 md:gap-x-2 gap-y-8 sm:gap-y-10">
          {filteredProducts.map((item) => (
            <ShopCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
