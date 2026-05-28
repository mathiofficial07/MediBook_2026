import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CarouselSection from "@/components/CarouselSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <CarouselSection />
    <FeaturesSection />
    <TestimonialsSection />
    <Footer />
  </div>
);

export default Index;
