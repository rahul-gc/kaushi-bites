import { motion } from 'framer-motion';
import { categories } from '@/data/menuData';
import { useNavigate } from 'react-router-dom';

const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Explore Our Menu</h2>
          <p className="font-body text-muted-foreground">Choose a category to explore</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 max-w-3xl mx-auto">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              onClick={() => navigate(`/menu?category=${cat.slug}`)}
              className="group flex flex-col items-center gap-2"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-3 border-transparent group-hover:border-primary transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lg">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                />
              </div>
              <span className="font-body text-xs md:text-sm font-medium text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
