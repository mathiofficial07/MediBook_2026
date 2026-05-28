import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Patient",
    text: "MediBook made it incredibly easy to find a specialist. I booked my appointment in under 2 minutes!",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Dr. Michael Chen",
    role: "Cardiologist",
    text: "As a doctor, this platform streamlined my schedule beautifully. I can focus more on patients now.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Patient",
    text: "The real-time availability feature is a game changer. No more phone tag with clinics!",
    rating: 5,
    avatar: "ER",
  },
];

const TestimonialsSection = () => (
  <section className="py-20 section-alt">
    <div className="container mx-auto px-4">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          What People Say
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Trusted by thousands of patients and healthcare professionals
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="bg-card rounded-2xl p-6 card-shadow"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, idx) => (
                <Star key={idx} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-foreground mb-6 leading-relaxed">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full hero-gradient flex items-center justify-center text-primary-foreground text-sm font-bold">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t.name}
                </p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
