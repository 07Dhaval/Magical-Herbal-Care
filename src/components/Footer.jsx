import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#f6f3eb] border-t border-[#e7dcc3]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 pb-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] gap-10 lg:gap-16">

          
          <div>
            <Link to="/" className="inline-block">
              <div className="bg-[#fffdf7] p-3 rounded-2xl shadow-sm border border-[#ece3d0] inline-block">
                <img
                  src="/magicalherbalcare_logo.jpeg"
                  alt="logo"
                  className="h-20 sm:h-24 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="mt-7 max-w-[340px] text-[15px] leading-[1.9] text-[#456b3d]">
              Serving international markets with quality products. Trusted by
              clients with a focus on care, reliability, and premium everyday essentials.
            </p>

            <div className="flex items-center gap-4 mt-8">
              <a href="https://instagram.com" target="_blank" className="icon">
                <FaInstagram size={16} />
              </a>
              <a href="https://facebook.com" target="_blank" className="icon">
                <FaFacebookF size={14} />
              </a>
              <a href="https://wa.me/919999999999" target="_blank" className="icon">
                <FaWhatsapp size={16} />
              </a>
            </div>
          </div>

          
          <div>
            <h3 className="footer-title">Company</h3>

            <ul className="footer-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          
          <div>
            <h3 className="footer-title">Policies</h3>

            <ul className="footer-list">
              <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/refund-return">Refund & Return Policy</Link></li>
              <li><Link to="/shipping-policy">Shipping Policy</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>

          
          <div>
            <h3 className="footer-title">Contact Info</h3>

            <div className="space-y-5 text-[15px] text-[#456b3d]">
              <p>Magical Herbal Care</p>
              <p>info@magicalherbalcare.com</p>
              <p>+91 98765 43210</p>
              <p>India</p>
            </div>
          </div>

        </div>

        
        <div className="mt-10 pt-7 border-t border-[#ded3bc] flex justify-center items-center text-center">
  
  <p className="text-[13px] text-[#456b3d]">
    © 2026 Magical Herbal Care. All rights reserved.
  </p>

</div>
      </div>

     
      <style jsx>{`
        .footer-title {
          font-size: 18px;
          font-weight: 600;
          color: #8b5a12;
          margin-bottom: 16px;
        }

        .footer-list li {
          margin-bottom: 12px;
          color: #456b3d;
          cursor: pointer;
          transition: 0.3s;
        }

        .footer-list li:hover {
          color: #8b5a12;
        }

        .icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d8cdb6;
          border-radius: 50%;
          background: #fdfbf6;
          color: #456b3d;
          transition: 0.3s;
        }

        .icon:hover {
          background: #456b3d;
          color: white;
        }
      `}</style>
    </footer>
  );
}