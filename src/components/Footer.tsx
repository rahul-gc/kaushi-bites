import { Phone, MapPin, Clock } from 'lucide-react';
import kaushiLogo from '@/assets/kaushi-logo.png';

const Footer = () => (
  <footer className="bg-foreground text-background py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={kaushiLogo} alt="Kaushi Restaurant" className="h-10 w-10 rounded-full object-cover" />
            <h3 className="font-display text-xl font-bold">Kaushi Restaurant</h3>
          </div>
          <p className="font-body text-sm opacity-80">Authentic Nepali cuisine crafted with love and tradition. Serving the best flavors of Nepal since 2020.</p>
        </div>
        <div>
          <h4 className="font-body font-semibold mb-3">Contact</h4>
          <div className="space-y-2 text-sm opacity-80">
            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +977 98-0000-0000</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Baglung Bazaar, Baglung, Nepal</p>
            <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> 8:00 AM – 9:00 PM</p>
          </div>
        </div>
        <div>
          <h4 className="font-body font-semibold mb-3">Quick Links</h4>
          <div className="space-y-2 text-sm opacity-80">
            <p><a href="/" className="hover:text-primary transition-colors">Home</a></p>
            <p><a href="/menu" className="hover:text-primary transition-colors">Full Menu</a></p>
          </div>
        </div>
      </div>
      <div className="border-t border-background/20 mt-8 pt-6 text-center text-sm opacity-60 font-body">
        © 2025 Kaushi Restaurant. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
