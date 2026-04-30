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

import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import Orders from "./admin/pages/Orders";
import Products from "./admin/pages/Products";
import AddProduct from "./admin/pages/AddProduct";
import EditProduct from "./admin/pages/EditProduct";
import OrderDetails from "./admin/pages/OrderDetails";
import AdminLayout from "./admin/components/AdminLayout";
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

        {/* POLICY */}
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-return" element={<RefundReturn />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ADMIN PANEL */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;