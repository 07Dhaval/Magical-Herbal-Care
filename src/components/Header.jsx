import { Search, Heart, Menu, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { products } from "../data/products";

const safeJsonParse = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};

const getProductId = (item) => item?._id || item?.id || item?.productId;

export default function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const updateCounts = () => {
    const wishlistItems = safeJsonParse("wishlistItems", []);
    const cartItems = safeJsonParse("cartItems", []);

    setWishlistCount(wishlistItems.length);

    const totalCartCount = cartItems.reduce(
      (sum, item) => sum + Number(item.quantity || 1),
      0
    );

    setCartCount(totalCartCount);
  };

  useEffect(() => {
    updateCounts();

    window.addEventListener("wishlistUpdated", updateCounts);
    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("storage", updateCounts);

    return () => {
      window.removeEventListener("wishlistUpdated", updateCounts);
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("storage", updateCounts);
    };
  }, []);

  const filteredSuggestions = useMemo(() => {
    const value = searchText.trim().toLowerCase();

    if (!value) return [];

    return products.filter((item) =>
      item.name?.toLowerCase().includes(value)
    );
  }, [searchText]);

  const closeSearch = () => {
    setShowSearch(false);
    setSearchText("");
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchText.trim() !== "") {
      navigate(`/shop?search=${encodeURIComponent(searchText.trim())}`);
      closeSearch();
      setMobileMenu(false);
    }
  };

  const handleSuggestionClick = (item) => {
    const productId = getProductId(item);

    if (!productId) return;

    navigate(`/product/${productId}`, { state: { product: item } });
    closeSearch();
    setMobileMenu(false);
  };

  return (
    <header className="w-full bg-[#f6f6f3] shadow-sm border-b border-[#e5e5dc]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/">
            <img
              src="/magical-logo1.png"
              alt="Magical Herbal Care Logo"
              className="h-[150px] w-[250px] object-contain"
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-12 px-10 py-4 bg-[#e5e5e0] rounded-full text-[15px] font-medium text-[#2f4f2f]">
          <Link to="/" className="hover:text-[#b48a2c] transition">
            Home
          </Link>
          <Link to="/shop" className="hover:text-[#b48a2c] transition">
            Shop
          </Link>
          <Link to="/about" className="hover:text-[#b48a2c] transition">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-[#b48a2c] transition">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-5 text-[#2f4f2f] relative">
          <h1 className="text-[10px] sm:text-[20px] font-serif tracking-wider text-[#2f4f2f]">
            ~ Swati Tiwari ~
          </h1>

          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setShowSearch((prev) => !prev)}
              className="flex items-center justify-center"
            >
              <Search
                className="cursor-pointer hover:text-[#b48a2c]"
                size={20}
              />
            </button>

            {showSearch && (
              <div className="absolute right-0 top-[38px] w-[280px] bg-white border border-[#e5e5dc] rounded-2xl shadow-xl z-50 overflow-hidden">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  autoFocus
                  className="w-full px-2 py-3 text-[15px] text-[#2f4f2f] outline-none border-b border-[#f0ede4] placeholder:text-[#8a8a7a]"
                />

                {searchText.trim() !== "" && (
                  <div className="max-h-[240px] overflow-y-auto">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((item) => (
                        <button
                          key={getProductId(item)}
                          onClick={() => handleSuggestionClick(item)}
                          className="w-full text-left px-4 py-3 text-sm text-[#2f4f2f] hover:bg-[#f6f6f3] transition border-b border-[#f7f3ea] last:border-b-0"
                        >
                          {item.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No product found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <Link to="/wishlist" className="relative">
            <Heart className="cursor-pointer hover:text-[#b48a2c]" size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#b48a2c] text-white text-[10px] flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative">
            <ShoppingCart
              className="cursor-pointer hover:text-[#b48a2c]"
              size={20}
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#2f4f2f] text-white text-[10px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <a
            href="https://wa.me/917042779784"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#2f4f2f] hover:bg-[#3f6b3f] text-white px-3 py-2 rounded-full transition"
          >
            <FaWhatsapp size={18} />
            <span className="hidden sm:inline text-[13px]">Enquiry</span>
          </a>

          <Menu
            className="md:hidden cursor-pointer text-[#2f4f2f]"
            size={22}
            onClick={() => setMobileMenu((prev) => !prev)}
          />
        </div>
      </div>

      {mobileMenu && (
        <div className="md:hidden bg-[#f6f6f3] border-t border-[#e5e5dc] px-6 pb-4">
          <div className="mt-4 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full px-4 py-3 text-[15px] text-[#2f4f2f] outline-none border border-[#e5e5dc] rounded-xl bg-white placeholder:text-[#8a8a7a]"
              />

              {searchText.trim() !== "" && (
                <div className="mt-2 bg-white border border-[#e5e5dc] rounded-xl shadow-md overflow-hidden">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((item) => (
                      <button
                        key={getProductId(item)}
                        onClick={() => handleSuggestionClick(item)}
                        className="w-full text-left px-4 py-3 text-sm text-[#2f4f2f] hover:bg-[#f6f6f3] transition border-b border-[#f7f3ea] last:border-b-0"
                      >
                        {item.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No product found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <nav className="flex flex-col gap-4 text-[#2f4f2f] font-medium">
            <Link to="/" onClick={() => setMobileMenu(false)}>
              Home
            </Link>
            <Link to="/shop" onClick={() => setMobileMenu(false)}>
              Shop
            </Link>
            <Link to="/about" onClick={() => setMobileMenu(false)}>
              About Us
            </Link>
            <Link to="/contact" onClick={() => setMobileMenu(false)}>
              Contact
            </Link>
            <Link to="/wishlist" onClick={() => setMobileMenu(false)}>
              Wishlist
            </Link>
            <Link to="/cart" onClick={() => setMobileMenu(false)}>
              Cart
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}