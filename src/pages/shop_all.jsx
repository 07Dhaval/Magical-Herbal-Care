import Header from "../components/Header";
import Shop from "../components/shop";
import HomePage3 from "../components/Home_page3";
import Footer from "../components/Footer";

export default function ShopAll(){
  return (
    <div className="bg-[#f3f3f3] min-h-screen">
      <Header />
      <Shop />
      <HomePage3 />
      <Footer />
    </div>
  );
}