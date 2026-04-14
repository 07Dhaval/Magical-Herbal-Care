import { Search, User, Heart, Menu, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

export default function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateWishlistCount = () => {
      const wishlistItems =
        JSON.parse(localStorage.getItem("wishlistItems")) || [];
      setWishlistCount(wishlistItems.length);
    };

    const updateCartCount = () => {
      const cartItems =
        JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartCount(cartItems.length);
    };

    updateWishlistCount();
    updateCartCount();

    window.addEventListener("wishlistUpdated", updateWishlistCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  return (
    <header className="w-full bg-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/">
            <img
              src="/freshiya_logo.png"
              alt="Freshiya Logo"
              className="h-[85px] w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12 text-[16px] font-medium text-black/80">
          <Link to="/" className="hover:text-black transition">Home</Link>
          <Link to="/shop" className="hover:text-black transition">Shop</Link>
          <Link to="/about" className="hover:text-black transition">About Us</Link>
          <Link to="/contact" className="hover:text-black transition">Contact</Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-5 text-gray-700">
          <Search className="cursor-pointer hover:text-black" size={20} />
          
          {/* Wishlist */}
          <Link to="/wishlist" className="relative">
            <Heart className="cursor-pointer hover:text-black" size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#103258] text-white text-[10px] flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="cursor-pointer hover:text-black" size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-full transition"
          >
            <FaWhatsapp size={18} />
            <span className="hidden sm:inline text-[13px]">Enquiry</span>
          </a>

          <Menu
            className="md:hidden cursor-pointer"
            size={22}
            onClick={() => setMobileMenu(!mobileMenu)}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-white border-t px-6 pb-4">
          <nav className="flex flex-col gap-4 text-gray-700 font-medium">
            <Link to="/" onClick={() => setMobileMenu(false)}>Home</Link>
            <Link to="/shop" onClick={() => setMobileMenu(false)}>Shop</Link>
            <Link to="/about" onClick={() => setMobileMenu(false)}>About Us</Link>
            <Link to="/contact" onClick={() => setMobileMenu(false)}>Contact</Link>
            <Link to="/wishlist" onClick={() => setMobileMenu(false)}>Wishlist</Link>
            <Link to="/cart" onClick={() => setMobileMenu(false)}>Cart</Link>
          </nav>
        </div>
      )}
    </header>
  );
}