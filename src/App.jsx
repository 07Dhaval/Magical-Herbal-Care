import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ShopAll from "./pages/shop_all";
import Product from "./pages/product";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundReturn from "./pages/RefundReturn";
import ShippingPolicy from "./pages/ShippingPolicy";
import Disclaimer from "./pages/Disclaimer";

import ScrollToTop from "./components/ScrollToTop";

// Admin imports
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import Orders from "./admin/pages/Orders";
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>

        {/* WEBSITE */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopAll />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* POLICY PAGES */}
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-return" element={<RefundReturn />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <Dashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute>
              <Orders />
            </ProtectedAdminRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;