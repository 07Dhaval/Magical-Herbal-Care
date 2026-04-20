import React, { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";

const allProducts = [
  {
    id: 1,
    name: "Magical Herbal Hair Oil (Sun-Infused)",
    category: "Hair Care",
    image: "/m1.png",
    images: ["/m1.png", "/m2.png", "/m3.png"],
    price: "MRP Rs. 580.00",
    description: {
      intro:
        "This is a unique handcrafted herbal oil made using a blend of powerful traditional ingredients, naturally infused under sunlight for 25 days to enhance its potency and effectiveness.",

      ingredients: [
        "Bhringraj – supports hair growth & strengthens roots",
        "Cardamom – improves scalp health & adds natural freshness",
        "Walnut – rich in nutrients for stronger, healthier hair",
        "Kalonji (Black Seed) – reduces hair fall & promotes regrowth",
        "Fenugreek (Methi) – adds shine & helps control dandruff",
      ],

      process:
        "The oil is slowly sun-infused for 25 days, allowing the herbs to release their full benefits naturally without any chemicals or artificial processing.",

      benefits: [
        "Helps reduce hair fall",
        "Supports natural hair growth",
        "Improves thickness & strength",
        "Nourishes scalp deeply",
        "Adds natural shine and softness",
      ],

      note:
        "This product is 100% natural, chemical-free, and handmade in small batches with proper care.",

      suitable: "Suitable for all hair types.",
    },
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

  const productImages = useMemo(() => {
    if (product.images && product.images.length > 0) return product.images;
    return [product.image];
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(productImages[0]);

  React.useEffect(() => {
    setSelectedImage(productImages[0]);
  }, [productImages]);

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

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];

    const alreadyExists = existingCart.some((item) => item.id === product.id);

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
    <section className="bg-[#f8f4ea] min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="relative overflow-hidden bg-white flex items-center justify-center border border-[#e7dcc3] rounded-[20px]">
              <span className="absolute top-4 left-4 z-10 bg-[#b48a2c] text-white text-[12px] px-3 py-1 rounded-full">
                -24%
              </span>

              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[400px] sm:h-[520px] lg:h-[620px] object-contain"
              />
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`min-w-[110px] sm:min-w-[130px] h-[100px] sm:h-[120px] border bg-white flex items-center justify-center overflow-hidden rounded-[12px] transition ${
                    selectedImage === img
                      ? "border-[#b48a2c] ring-2 ring-[#b48a2c]/20"
                      : "border-[#e7dcc3]"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <h1 className="text-[28px] sm:text-[34px] lg:text-[42px] text-[#b48a2c] leading-tight font-semibold">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-[#e0b85a]">
                <Star size={14} fill="currentColor" strokeWidth={0} />
                <Star size={14} fill="currentColor" strokeWidth={0} />
                <Star size={14} fill="currentColor" strokeWidth={0} />
                <Star size={14} fill="currentColor" strokeWidth={0} />
                <Star size={14} className="text-[#ddd]" />
              </div>
              <span className="text-[12px] text-[#666]">(15)</span>
            </div>

            <p className="mt-6 text-[22px] sm:text-[28px] text-[#2f4f2f] font-medium">
              {product.price}
            </p>

            {Array.isArray(product.description) ? (
              <ul className="mt-5 space-y-2 text-[15px] sm:text-[16px] text-[#555] leading-8 list-disc pl-5">
                {product.description.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            ) : (
              <div className="mt-5 text-[15px] sm:text-[16px] text-[#555] leading-8">
                {product.description?.intro && (
                  <p className="mb-4">{product.description.intro}</p>
                )}

                {product.description?.ingredients && (
                  <div className="mb-5">
                    <h3 className="text-[#b48a2c] font-semibold mb-2">
                      Key Ingredients
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.description.ingredients.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.description?.process && (
                  <div className="mb-5">
                    <h3 className="text-[#b48a2c] font-semibold mb-2">
                      Process
                    </h3>
                    <p>{product.description.process}</p>
                  </div>
                )}

                {product.description?.benefits && (
                  <div className="mb-5">
                    <h3 className="text-[#b48a2c] font-semibold mb-2">
                      Benefits
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.description.benefits.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.description?.note && (
                  <p className="mt-4 font-medium text-[#2f4f2f]">
                    {product.description.note}
                  </p>
                )}

                {product.description?.suitable && (
                  <p className="mt-2 text-[#2f4f2f]">
                    {product.description.suitable}
                  </p>
                )}
              </div>
            )}

            <div className="mt-4">
              <button className="border border-[#e7dcc3] bg-white text-[#b48a2c] text-[13px] px-6 py-3 rounded-full">
                200 ML
              </button>
            </div>

            <div className="mt-4 flex gap-4 flex-wrap">
              <button
                onClick={handleAddToCart}
                className="bg-[#2f4f2f] hover:opacity-90 transition text-white text-[13px] uppercase px-10 py-4 rounded-full"
              >
                Add to Cart
              </button>

              <button
                onClick={handleAddToWishlist}
                className="bg-[#b48a2c] hover:opacity-90 transition text-white text-[13px] uppercase px-10 py-4 rounded-full"
              >
                Add to Wishlist
              </button>
            </div>

            <div className="mt-6 text-[13px] text-[#666] leading-7">
              <p>
                <span className="text-[#b48a2c]">Category:</span>{" "}
                {product.category}
              </p>
              <p>
                <span className="text-[#b48a2c]">Tags:</span> Premium, Herbal,
                Daily Use
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}