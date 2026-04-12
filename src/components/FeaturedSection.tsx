import { motion } from 'framer-motion';
import FoodCard from './FoodCard';
import { Link } from 'react-router-dom';
import { useAdminStore } from '@/store/adminStore';

const FeaturedSection = () => {
  const { menuItems } = useAdminStore();
  const featured = menuItems.filter(i => i.isFeatured && i.isAvailable).slice(0, 4);

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Popular Dishes</h2>
          <p className="font-body text-muted-foreground">Our customers' favorite picks</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <FoodCard item={item} />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/menu" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary font-body font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
            View Full Menu →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
