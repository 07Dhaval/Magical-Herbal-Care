import React from "react";
import { Star } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";

const allProducts = [
  {
    id: 1,
    name: "Dhup Con",
    category: "Home Care",
    image: "/home_care.png",
    price: "MRP Rs. 145.00",
    description: [
      "Natural fragrance product crafted for a calm and refreshing home atmosphere.",
      "Made with quality ingredients for long-lasting aroma and daily use.",
      "Perfect for creating a soothing and premium experience in your space.",
      "Easy to use and ideal for regular home care needs.",
    ],
  },
  {
    id: 2,
    name: "Premium Tea",
    category: "Home Care",
    image: "/home1_care.png",
    price: "MRP Rs. 220.00",
    description: [
      "Premium tea blend with rich taste and refreshing aroma.",
      "Carefully selected ingredients for a smooth and comforting experience.",
      "Ideal for daily enjoyment with family and guests.",
      "A premium addition to your home essentials collection.",
    ],
  },
  {
    id: 3,
    name: "Bath Soap Combo",
    category: "Home Care",
    image: "/home2_care.png",
    price: "MRP Rs. 199.00",
    description: [
      "Bath soap combo designed for gentle cleansing and freshness.",
      "Helps maintain soft and healthy-feeling skin after every wash.",
      "Made for regular family use with a premium quality finish.",
      "Suitable for daily care and personal hygiene.",
    ],
  },
  {
    id: 4,
    name: "Senetary Nepkin",
    category: "Home Care",
    image: "/home3_care.png",
    price: "MRP Rs. 125.00",
    description: [
      "Comfortable and reliable sanitary care product for everyday use.",
      "Designed for softness, protection, and confidence throughout the day.",
      "Made with care for better hygiene and comfort.",
      "A practical and essential home care product.",
    ],
  },
  {
    id: 5,
    name: "Fiber Fit",
    category: "Home Care",
    image: "/home4_care.png",
    price: "MRP Rs. 320.00",
    description: [
      "Fiber supplement product made to support daily wellness routines.",
      "Easy to include in a balanced lifestyle and health-conscious routine.",
      "Premium quality formula for regular use.",
      "A simple way to add more care to your daily essentials.",
    ],
  },
  {
    id: 6,
    name: "Hairfall Kit",
    category: "Home Care",
    image: "/home5_care.png",
    price: "MRP Rs. 499.00",
    description: [
      "Hairfall care kit created to support stronger and healthier-looking hair.",
      "Includes essential care benefits for regular hair maintenance.",
      "Designed for a simple and effective home care routine.",
      "Ideal for people looking for complete hair care support.",
    ],
  },
  {
    id: 7,
    name: "Hair Shampoo",
    category: "Home Care",
    image: "/home6_care.png",
    price: "MRP Rs. 189.00",
    description: [
      "Hair shampoo for deep cleansing and refreshing scalp care.",
      "Helps remove buildup while keeping hair feeling fresh and soft.",
      "Suitable for regular use in your daily hair care routine.",
      "A premium personal care essential for every home.",
    ],
  },
  {
    id: 8,
    name: "Hair Conditioner",
    category: "Home Care",
    image: "/home7_care.png",
    price: "MRP Rs. 210.00",
    description: [
      "Hair conditioner designed to smooth and soften hair after washing.",
      "Helps improve manageability and overall hair feel.",
      "A perfect companion to your shampoo for complete hair care.",
      "Made for simple, effective, and premium daily use.",
    ],
  },
];

export default function ProductDetails() {
  const location = useLocation();
  const { id } = useParams();

  const stateProduct = location.state?.product;
  const product =
    stateProduct ||
    allProducts.find((item) => item.id === Number(id)) ||
    allProducts[0];

  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  const handleAddToWishlist = () => {
    const existingWishlist =
      JSON.parse(localStorage.getItem("wishlistItems")) || [];

    const alreadyExists = existingWishlist.some(
      (item) => item.id === product.id
    );

    if (!alreadyExists) {
      const updatedWishlist = [...existingWishlist, product];
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event("wishlistUpdated"));
      alert("Product added to wishlist");
    } else {
      alert("Product already in wishlist");
    }
  };

  // ✅ ADDED ONLY THIS FUNCTION
  const handleAddToCart = () => {
    const existingCart =
      JSON.parse(localStorage.getItem("cartItems")) || [];

    const alreadyExists = existingCart.some(
      (item) => item.id === product.id
    );

    if (!alreadyExists) {
      const updatedCart = [...existingCart, product];
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Product added to cart");
    } else {
      alert("Product already in cart");
    }
  };

  return (
    <section className="bg-[#f3f3f3] min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          <div>
            <div className="relative overflow-hidden bg-white flex items-center justify-center">
              <span className="absolute top-4 left-4 z-10 bg-[#d98b57] text-white text-[12px] px-3 py-1 rounded-full">
                -24%
              </span>

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[400px] sm:h-[520px] lg:h-[620px] object-contain"
              />
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto">
              {productImages.map((img, index) => (
                <div
                  key={index}
                  className="min-w-[110px] sm:min-w-[130px] h-[100px] sm:h-[120px] border border-[#d9d9d9] bg-white flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <h1 className="text-[28px] sm:text-[34px] lg:text-[42px] text-[#1D1D1D] leading-tight font-semibold">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-[#d07b47]">
                <Star size={14} fill="currentColor" strokeWidth={0} />
                <Star size={14} fill="currentColor" strokeWidth={0} />
                <Star size={14} fill="currentColor" strokeWidth={0} />
                <Star size={14} fill="currentColor" strokeWidth={0} />
                <Star size={14} className="text-[#d8d8d8]" />
              </div>
              <span className="text-[12px] text-[#666]">(15)</span>
            </div>

            <p className="mt-6 text-[22px] sm:text-[28px] text-[#0f4f8b] font-medium">
              {product.price}
            </p>

            <ul className="mt-5 space-y-2 text-[15px] sm:text-[16px] text-[#555] leading-8 list-disc pl-5">
              {product.description.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>

            <div className="mt-4">
              <button className="border border-[#d9d9d9] bg-white text-[#333] text-[13px] px-6 py-3">
                500 GM
              </button>
            </div>

            {/* ✅ ONLY THIS PART CHANGED */}
            <div className="mt-4 flex gap-4 flex-wrap">
              <button
                onClick={handleAddToCart}
                className="bg-black hover:opacity-90 transition text-white text-[13px] uppercase px-10 py-4"
              >
                Add to Cart
              </button>

              <button
                onClick={handleAddToWishlist}
                className="bg-[#0f4f8b] hover:opacity-90 transition text-white text-[13px] uppercase px-10 py-4"
              >
                Add to Wishlist
              </button>
            </div>

            <div className="mt-6 text-[13px] text-[#666] leading-7">
              <p>
                <span className="text-[#333]">Category:</span> {product.category}
              </p>
              <p>
                <span className="text-[#333]">Tags:</span> Premium, Modern, Daily Use
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}