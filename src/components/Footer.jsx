import { MessageCircle } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#F4E9D6] border-t border-black/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] gap-10 lg:gap-12">
          {/* Left */}
          <div>
            <Link to="/" className="inline-block">
              <img
                src="/freshiya_logo.png"
                alt="Freshiya Logo"
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 text-[14px] sm:text-[15px] leading-7 text-gray-700 max-w-[340px]">
              Serving international markets with quality products. Trusted by
              clients with a focus on care, reliability, and premium everyday
              essentials.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#103258] hover:bg-[#103258] hover:text-white transition"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#103258] hover:bg-[#103258] hover:text-white transition"
              >
                <FaFacebookF size={16} />
              </a>

              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#103258] hover:bg-[#103258] hover:text-white transition"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[18px] font-semibold text-[#2f2f2f] mb-4">
              Company
            </h3>

            <ul className="space-y-3 text-[14px] sm:text-[15px] text-gray-700">
              <li>
                <Link to="/" className="hover:text-[#103258] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#103258] transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#103258] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#103258] transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[18px] font-semibold text-[#2f2f2f] mb-4">
              Support
            </h3>

            <ul className="space-y-3 text-[14px] sm:text-[15px] text-gray-700">
              <li className="hover:text-[#103258] transition cursor-pointer">
                Size Guide
              </li>
              <li className="hover:text-[#103258] transition cursor-pointer">
                FAQs
              </li>
              <li className="hover:text-[#103258] transition cursor-pointer">
                Shipping
              </li>
              <li className="hover:text-[#103258] transition cursor-pointer">
                Returns
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[18px] font-semibold text-[#2f2f2f] mb-4">
              Contact Info
            </h3>

            <div className="space-y-3 text-[14px] sm:text-[15px] text-gray-700 leading-7">
              <p>Freshiya Trading Company</p>
              <p>info@freshiya.com</p>
              <p>+91 98765 43210</p>
              <p>India</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] sm:text-[13px] text-gray-700 text-center sm:text-left">
            © 2026 Freshiya Trading Company. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-[12px] sm:text-[13px] text-gray-700">
            <span className="hover:text-[#103258] transition cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-[#103258] transition cursor-pointer">
              Terms & Conditions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}