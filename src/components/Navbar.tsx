import { useState, useRef, useCallback } from 'react';
import { ShoppingCart, Phone, User, LogOut, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { getCount, setOpen: setCartOpen } = useCartStore();
  const { user, logout, setLoginOpen } = useAuthStore();
  const { setAdminLoginOpen } = useAdminStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Secret admin trigger
  const clickTimestamps = useRef<number[]>([]);
  const handleLogoClick = useCallback(() => {
    const now = Date.now();
    clickTimestamps.current = [...clickTimestamps.current.filter(t => now - t < 2000), now];
    if (clickTimestamps.current.length >= 5) {
      clickTimestamps.current = [];
      setAdminLoginOpen(true);
    }
  }, [setAdminLoginOpen]);

  // Scroll shadow
  useState(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  });

  const cartCount = getCount();
  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : isHome ? 'bg-transparent' : 'bg-background/95 backdrop-blur-md'}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button onClick={handleLogoClick} className="flex items-center gap-2 select-none cursor-pointer">
          <span className="text-2xl">🍜</span>
          <span className="font-display text-xl font-bold text-primary">Kaushi</span>
          <span className="font-display text-sm text-muted-foreground hidden sm:inline">Restaurant</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={`font-body text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-foreground'}`}>Home</Link>
          <Link to="/menu" className={`font-body text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/menu' ? 'text-primary' : 'text-foreground'}`}>Menu</Link>
          <a href="tel:+9779800000000" className="font-body text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
            <Phone className="w-3.5 h-3.5" /> Call Us
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-full hover:bg-secondary transition-colors">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {cartCount > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </motion.span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="font-body text-sm text-foreground">{user.name}</span>
              <button onClick={logout} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <button onClick={() => setLoginOpen(true)} className="hidden md:flex items-center gap-1 px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary-dark transition-colors">
              <User className="w-4 h-4" /> Login
            </button>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden bg-background border-t border-border overflow-hidden">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="font-body text-sm font-medium py-2">Home</Link>
              <Link to="/menu" onClick={() => setMobileOpen(false)} className="font-body text-sm font-medium py-2">Menu</Link>
              <a href="tel:+9779800000000" className="font-body text-sm font-medium py-2 flex items-center gap-2"><Phone className="w-4 h-4" /> Call Us</a>
              {user ? (
                <button onClick={() => { logout(); setMobileOpen(false); }} className="font-body text-sm font-medium py-2 text-left flex items-center gap-2 text-destructive">
                  <LogOut className="w-4 h-4" /> Logout ({user.name})
                </button>
              ) : (
                <button onClick={() => { setLoginOpen(true); setMobileOpen(false); }} className="font-body text-sm font-medium py-2 text-primary flex items-center gap-2">
                  <User className="w-4 h-4" /> Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
