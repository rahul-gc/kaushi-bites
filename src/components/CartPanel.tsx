import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const CartPanel = () => {
  const { items, isOpen, setOpen, removeItem, updateQty, getTotal } = useCartStore();
  const { user, setLoginOpen } = useAuthStore();
  const navigate = useNavigate();
  const total = getTotal();

  const handleCheckout = () => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    setOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-background shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display text-xl font-bold text-foreground">Your Cart</h2>
              <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <p className="font-display text-lg text-muted-foreground">Your cart is empty</p>
                  <p className="font-body text-sm text-muted-foreground/70 mt-1">Add some delicious items to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div key={item.id} layout className="flex gap-3 p-3 rounded-lg bg-secondary/50">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-body text-sm font-semibold text-foreground truncate">{item.name}</h4>
                        <p className="font-body text-sm text-muted-foreground">Rs. {item.price}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-body text-sm font-semibold w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <span className="font-body text-sm font-bold text-foreground">Rs. {item.price * item.quantity}</span>
                        <button onClick={() => removeItem(item.id)} className="p-1 rounded-full hover:bg-destructive/10 text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-border space-y-3">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">Rs. {total}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-body text-lg border-t border-border pt-3">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-primary">Rs. {total}</span>
                </div>
                <button onClick={handleCheckout} className="w-full py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold hover:bg-primary-dark transition-colors">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartPanel;
