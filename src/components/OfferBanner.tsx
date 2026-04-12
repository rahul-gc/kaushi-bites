import { Link } from 'react-router-dom';

const OfferBanner = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=400&fit=crop"
          alt="Special offer"
          className="w-full h-56 md:h-72 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent flex items-center">
          <div className="p-8 md:p-12 max-w-lg">
            <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-body font-bold mb-3">LIMITED OFFER</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">20% Off Your First Order!</h3>
            <p className="font-body text-white/80 text-sm mb-4">Use code <span className="font-bold text-accent">KAUSHI20</span> at checkout.</p>
            <Link to="/menu" className="inline-block px-6 py-2.5 rounded-full bg-primary text-white font-body font-semibold hover:bg-primary-dark transition-colors">
              Grab the Deal
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default OfferBanner;
