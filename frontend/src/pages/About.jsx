import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  HeartPulse,
  Award,
  Clock,
  Globe,
} from "lucide-react";

const values = [
  {
    icon: HeartPulse,
    title: "Patient-First Care",
    desc: "Every feature is designed with patient well-being at the center of everything we do.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Security",
    desc: "Your health data is protected with industry-leading encryption and privacy standards.",
  },
  {
    icon: Users,
    title: "Verified Doctors",
    desc: "All doctors on our platform are thoroughly vetted and credentialed professionals.",
  },
  {
    icon: Award,
    title: "Excellence",
    desc: "We strive for the highest standards in healthcare accessibility and service quality.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    desc: "Book appointments anytime, anywhere — our platform never sleeps.",
  },
  {
    icon: Globe,
    title: "Accessible Healthcare",
    desc: "Breaking barriers to make quality healthcare available to everyone, everywhere.",
  },
];

const stats = [
  { value: "200+", label: "Verified Doctors" },
  { value: "50,000+", label: "Appointments Booked" },
  { value: "4.9★", label: "Average Rating" },
  { value: "98%", label: "Patient Satisfaction" },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="pt-24 pb-16 bg-gradient-to-br from-accent via-background to-background">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-foreground mb-6"
        >
          About <span className="text-gradient">MediBook</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground"
        >
          We're on a mission to make healthcare accessible, transparent, and
          hassle-free. MediBook connects patients with trusted doctors through a
          seamless digital booking experience.
        </motion.p>
      </div>
    </section>

    {/* Stats */}
    <section className="py-12 border-b border-border">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-3xl font-bold text-primary">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Our Story */}
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            MediBook was founded with a simple belief: booking a doctor's
            appointment shouldn't be complicated. We noticed that patients often
            struggled with long wait times, lack of transparency, and difficulty
            finding the right specialist.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our team of healthcare professionals and technologists came together
            to build a platform that puts patients first. Today, MediBook serves
            thousands of patients, connecting them with over 200 verified
            doctors across multiple specializations — all with just a few
            clicks.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Values */}
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">
          Our Values
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                <v.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
