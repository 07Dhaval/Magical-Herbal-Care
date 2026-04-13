import AboutSection from "../components/AboutSection";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
        <div className="bg-[#f3f3f3] min-h-screen">
          <Header />
          <AboutSection />
          <Footer />
        </div>
      );
}