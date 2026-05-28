import { motion } from "framer-motion";
import { CalendarCheck, ShieldCheck, UserCheck, Clock } from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    description:
      "Book appointments in seconds with our streamlined scheduling system.",
  },
  {
    icon: UserCheck,
    title: "Verified Doctors",
    description:
      "All doctors are thoroughly verified with credentials and patient reviews.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description:
      "Your health data is encrypted and protected with enterprise-grade security.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Find available slots any time — no more waiting on hold or callbacks.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Why Choose <span className="text-gradient">MediBook</span>?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          We make healthcare accessible, transparent, and hassle-free
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow duration-300"
          >
            <div className="h-12 w-12 rounded-xl hero-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <f.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {f.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {f.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
