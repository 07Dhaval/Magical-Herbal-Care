import Header from "../components/Header";
import HomePage1 from "../components/Home_page1";
import HomePage2 from "../components/Home_page2";
import HomePage3 from "../components/Home_page3";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-[#f3f3f3] min-h-screen">
      <Header />
      <HomePage1 />
      <HomePage2 />
      <HomePage3 />
      <Footer />
    </div>
  );
}