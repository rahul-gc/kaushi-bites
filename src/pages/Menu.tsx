import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';
import { categories } from '@/data/menuData';
import { useAdminStore } from '@/store/adminStore';
import FoodCard from '@/components/FoodCard';
import Footer from '@/components/Footer';

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [search, setSearch] = useState('');
  const { menuItems } = useAdminStore();

  const filtered = useMemo(() => {
    let items = menuItems.filter(i => i.isAvailable);
    if (activeCategory !== 'all') items = items.filter(i => i.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    return items;
  }, [menuItems, activeCategory, search]);

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    setSearchParams(slug === 'all' ? {} : { category: slug });
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero bar */}
      <div className="bg-gradient-to-r from-primary to-primary-dark py-10 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Our Menu</h1>
          <p className="font-body text-primary-foreground/80">Discover authentic Nepali flavors</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-input bg-background font-body text-sm focus:ring-2 focus:ring-ring outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`shrink-0 px-5 py-2 rounded-full font-body text-sm font-medium transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-primary/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Item count */}
        <p className="font-body text-sm text-muted-foreground mb-4">{filtered.length} items found</p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <FoodCard item={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <UtensilsCrossed className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="font-display text-xl text-muted-foreground">No dishes found</p>
            <p className="font-body text-sm text-muted-foreground/70 mt-1">Try a different search or category</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MenuPage;
