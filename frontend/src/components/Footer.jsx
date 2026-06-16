import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer id="contact" className="bg-foreground text-primary-foreground">
    <div className="container mx-auto px-4 py-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-lg hero-gradient flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MediBook</span>
          </div>
          <p className="text-sm text-primary-foreground/60 leading-relaxed">
            Making healthcare accessible for everyone. Book appointments with
            trusted doctors in just a few clicks.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/60">
            {["Find Doctors", "Specializations", "How It Works", "Pricing"].map(
              (l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/60">
            {["FAQ", "Privacy Policy", "Terms of Service", "Help Center"].map(
              (l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/60">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> myazhagan907@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> +1 (555) 123-4567
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Coimbatore, NY 10001
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/40">
        © {new Date().getFullYear()} MediBook. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
