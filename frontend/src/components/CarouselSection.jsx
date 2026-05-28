import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import carouselConsultation from "@/assets/carousel-consultation.jpg";
import carouselSurgery from "@/assets/carousel-surgery.jpg";
import carouselCare from "@/assets/carousel-care.jpg";

const slides = [
  {
    image: carouselConsultation,
    title: "Expert Doctor Consultations",
    description: "Connect with verified specialists across 30+ medical fields.",
  },
  {
    image: carouselSurgery,
    title: "Advanced Medical Facilities",
    description: "Our network includes hospitals with world-class equipment.",
  },
  {
    image: carouselCare,
    title: "Compassionate Patient Care",
    description:
      "Experience healthcare with empathy and personalized attention.",
  },
];

const CarouselSection = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((p) => (p + 1) % slides.length),
    [],
  );
  const prev = useCallback(
    () => setCurrent((p) => (p - 1 + slides.length) % slides.length),
    [],
  );

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="py-20 section-alt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Our Medical Services
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive healthcare services tailored to your needs
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden card-shadow">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.45 }}
              className="relative aspect-video"
            >
              <img
                src={slides[current].image}
                alt={slides[current].title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                  {slides[current].title}
                </h3>
                <p className="text-primary-foreground/80 max-w-lg">
                  {slides[current].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur rounded-full p-2 hover:bg-card transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur rounded-full p-2 hover:bg-card transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current
                    ? "w-8 bg-primary"
                    : "w-2 bg-primary-foreground/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;
