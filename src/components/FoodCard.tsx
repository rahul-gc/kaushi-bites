import { motion } from 'framer-motion';
import { Star, Plus } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

interface FoodCardProps {
  item: MenuItem;
}

const FoodCard = ({ item }: FoodCardProps) => {
  const { addItem } = useCartStore();
  const { user, setLoginOpen } = useAuthStore();
  const { toast } = useToast();

  const handleAdd = () => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    addItem(item);
    toast({
      title: '🛒 Added to cart!',
      description: `${item.name} has been added.`,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="group rounded-lg overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
        />
        {item.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-body font-semibold">
            {item.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-display text-lg font-semibold text-foreground leading-tight">{item.name}</h3>
          <div className="flex items-center gap-0.5 text-accent shrink-0 ml-2">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-body text-xs font-semibold">{item.rating}</span>
          </div>
        </div>
        <p className="font-body text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-body text-lg font-bold text-foreground">Rs. {item.price}</span>
          <motion.button
            whileTap={{ scale: 1.15 }}
            onClick={handleAdd}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" /> Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
