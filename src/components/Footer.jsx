import { MessageCircle } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#f6f3eb] border-t border-[#e7dcc3]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] gap-10 lg:gap-12">
          
          {/* Logo + About */}
          <div>
            <Link to="/" className="inline-block">
              
              {/* 👇 LOGO BACKGROUND FIX */}
              <div className="bg-[#fffdf7] p-3 rounded-xl shadow-sm inline-block">
                <img
                  src="/magicalherbalcare_logo.jpeg"
                  alt="Magical Herbal Care Logo"
                  className="h-20 sm:h-24 w-auto object-contain"
                />
              </div>

            </Link>

            <p className="mt-5 text-[14px] sm:text-[15px] leading-7 text-[#456b3d] max-w-[340px]">
              Serving international markets with quality products. Trusted by
              clients with a focus on care, reliability, and premium everyday
              essentials.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-[#e7dcc3] flex items-center justify-center text-[#2f5d3a] hover:bg-[#2f5d3a] hover:text-white transition"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-[#e7dcc3] flex items-center justify-center text-[#2f5d3a] hover:bg-[#2f5d3a] hover:text-white transition"
              >
                <FaFacebookF size={16} />
              </a>

              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-[#e7dcc3] flex items-center justify-center text-[#2f5d3a] hover:bg-[#2f5d3a] hover:text-white transition"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[18px] font-semibold text-[#6b4b1f] mb-4">
              Company
            </h3>

            <ul className="space-y-3 text-[14px] sm:text-[15px] text-[#456b3d]">
              <li>
                <Link to="/" className="hover:text-[#b48a2c] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#b48a2c] transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#b48a2c] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#b48a2c] transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[18px] font-semibold text-[#6b4b1f] mb-4">
              Support
            </h3>

            <ul className="space-y-3 text-[14px] sm:text-[15px] text-[#456b3d]">
              <li className="hover:text-[#b48a2c] transition cursor-pointer">
                Size Guide
              </li>
              <li className="hover:text-[#b48a2c] transition cursor-pointer">
                FAQs
              </li>
              <li className="hover:text-[#b48a2c] transition cursor-pointer">
                Shipping
              </li>
              <li className="hover:text-[#b48a2c] transition cursor-pointer">
                Returns
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[18px] font-semibold text-[#6b4b1f] mb-4">
              Contact Info
            </h3>

            <div className="space-y-3 text-[14px] sm:text-[15px] text-[#456b3d] leading-7">
              <p>Magical Herbal Care</p>
              <p>info@magicalherbalcare.com</p>
              <p>+91 98765 43210</p>
              <p>India</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-[#e7dcc3] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] sm:text-[13px] text-[#456b3d] text-center sm:text-left">
            © 2026 Magical Herbal Care. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-[12px] sm:text-[13px] text-[#456b3d]">
            <span className="hover:text-[#b48a2c] transition cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-[#b48a2c] transition cursor-pointer">
              Terms & Conditions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}