import React from "react";
import { Link } from "react-router-dom";

const shopProducts = [
  {
    id: 1,
    name: "Hair Fall Shampoo",
    category: "Hair Care",
    image: "/s8.jpeg",
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
  {
    id: 4,
    name: "Freshiya Premium Essentials Combo",
    category: "Combo Pack",
    image: "/s3.jpeg",
    price: "MRP Rs. 899.00",
    description: [
      "A complete Freshiya essentials combo featuring multiple premium household and personal care products.",
      "Perfect for customers who want a convenient selection of Freshiya bestsellers in one pack.",
      "Combines fragrance, hygiene, hair care, and wellness products for everyday use.",
      "An ideal premium combo for families, gifting, or first-time product exploration.",
    ],
  },
  {
    id: 5,
    name: "Premium Tea",
    category: "Beverages",
    image: "/s4.jpeg",
    price: "MRP Rs. 275.00",
    description: [
      "Freshiya Premium Tea offers a rich taste and refreshing aroma for a delightful tea experience.",
      "Crafted for tea lovers who enjoy a comforting and premium daily beverage.",
      "Perfect for morning freshness, evening relaxation, or sharing with family.",
      "A flavorful tea blend designed to bring warmth, freshness, and satisfaction in every cup.",
    ],
  },
  {
    id: 6,
    name: "Premium Dhup Con",
    category: "Fragrance & Spiritual Care",
    image: "/s5.jpeg",
    price: "MRP Rs. 180.00",
    description: [
      "Freshiya Premium Dhup Con is made to create a pure, aromatic, and calming atmosphere.",
      "Its rich fragrance helps enhance spiritual rituals, prayer spaces, and home freshness.",
      "Ideal for daily pooja, meditation, and creating a peaceful environment.",
      "A premium incense cone product that brings fragrance, warmth, and devotional comfort.",
    ],
  },
  {
    id: 7,
    name: "Machhar Agarbatti",
    category: "Home Care",
    image: "/s6.jpeg",
    price: "MRP Rs. 165.00",
    description: [
      "Freshiya Premium Machhar Agarbatti is designed for strong and effective mosquito protection.",
      "Made for safer home use with a practical and convenient incense-stick format.",
      "Helps create a more comfortable indoor environment while supporting daily protection needs.",
      "A reliable home care solution for households seeking effective mosquito control.",
    ],
  },
  {
    id: 8,
    name: "Brightening Face Wash",
    category: "Skin Care",
    image: "/s7.jpeg",
    price: "MRP Rs. 210.00",
    description: [
      "Freshiya Brightening Face Wash helps revive dull skin and support a fresh, radiant glow.",
      "Infused with brightening care benefits for a clean, healthy-looking appearance.",
      "Suitable for regular daily use and designed for all skin types.",
      "A simple skincare essential for brighter, smoother, and refreshed skin.",
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
      {/* IMAGE CARD */}
      <div className="w-full max-w-[280px] h-[390px] mx-auto bg-white flex items-center justify-center overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain transition duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <h3 className="mt-4 text-[17px] sm:text-[16px] text-[#000000E5] leading-none">
        {item.name}
      </h3>

      <p className="mt-2 text-[12px] text-[#000000B2] leading-none">
        {item.category}
      </p>
    </Link>
  );
}

export default function Shop() {
  return (
    <section className="bg-[#f3f3f3] min-h-screen py-6 sm:py-8 md:py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center">
          <h1 className="text-[34px] sm:text-[42px] md:text-[50px] font-semibold tracking-wide uppercase text-black leading-none">
            Shop All
          </h1>

          <p className="mt-4 text-[10px] sm:text-[11px] md:text-[12px] text-[#444444]">
            Explore our premium Freshiya collection across home care, hair care,
            skin care, personal care, and wellness products.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 sm:gap-x-5 md:gap-x-2 gap-y-8 sm:gap-y-10">
          {shopProducts.map((item) => (
            <ShopCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}