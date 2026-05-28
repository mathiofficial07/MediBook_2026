import { motion } from "framer-motion";
import { CalendarCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroDoctor from "@/assets/hero-doctor.png";

const HeroSection = () => (
  <section id="home" className="relative pt-16 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-background -z-10" />
    <div className="container mx-auto px-4 py-20 lg:py-28">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <CalendarCheck className="h-4 w-4" /> Trusted by 10,000+ patients
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground mb-6">
            Book Appointments with{" "}
            <span className="text-gradient">Trusted Doctors</span> Easily
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mb-8">
            Find top-rated doctors near you, check availability in real time,
            and book your appointment in just a few clicks.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/doctors">
              <Button size="lg" className="gap-2">
                Book Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/doctors">
              <Button size="lg" variant="outline">
                Browse Doctors
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 max-w-md">
            {[
              { value: "200+", label: "Doctors" },
              { value: "50k+", label: "Appointments" },
              { value: "4.9★", label: "Rating" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-4 hero-gradient rounded-full blur-3xl opacity-20" />
            <img
              src={heroDoctor}
              alt="Trusted doctor ready to help"
              className="relative w-full h-auto drop-shadow-2xl"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
