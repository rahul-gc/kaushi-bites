import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, UtensilsCrossed, Clock, ShoppingBag } from 'lucide-react';

const stats = [
  { icon: Star, label: 'Rating', value: '4.9★' },
  { icon: UtensilsCrossed, label: 'Dishes', value: '50+' },
  { icon: Clock, label: 'Delivery', value: '30min' },
  { icon: ShoppingBag, label: 'Orders', value: '1500+' },
];

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop"
        alt="Nepali food spread"
        className="w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
    </div>

    {/* Content */}
    <div className="relative z-10 container mx-auto px-4 text-center text-white pt-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-body mb-6">
          🍜 Authentic Nepali Cuisine · Baglung
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-4 leading-tight">
          Taste the Flavors<br />
          <span className="text-primary">of Nepal</span>
        </h1>
        <p className="font-body text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-8">
          Fresh ingredients, traditional recipes, and a love for authentic Nepali taste — delivered to your door.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/menu" className="px-8 py-3 rounded-full bg-primary text-white font-body font-semibold text-lg hover:bg-primary-dark transition-colors shadow-lg">
            Order Now
          </Link>
          <a href="tel:+9779800000000" className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white font-body font-semibold text-lg hover:bg-white/20 transition-colors">
            📞 Call Us
          </a>
        </div>
      </motion.div>
    </div>

    {/* Stats Bar */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4"
    >
      <div className="grid grid-cols-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 py-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center text-white">
            <s.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="font-body text-lg font-bold">{s.value}</p>
            <p className="font-body text-xs opacity-70">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  </section>
);

export default HeroSection;
