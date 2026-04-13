import Header from "../components/Header";
import Productpage from "../components/product_page";
import HomePage3 from "../components/Home_page3";
import Footer from "../components/Footer";

export default function ShopAll(){
  return (
    <div className="bg-[#f3f3f3] min-h-screen">
      <Header />
      <Productpage />
      <HomePage3 />
      <Footer />
    </div>
  );
}