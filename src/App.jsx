import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ShopAll from "./pages/shop_all";
import Product from "./pages/product";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/ScrollToTop";
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* 🔥 THIS LINE */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopAll />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </Router>
  );
}

export default App;