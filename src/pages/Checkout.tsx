import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod } from '@/types/order';
import { Lock, CreditCard, Wallet, Banknote } from 'lucide-react';

const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { id: 'cod', label: 'Cash on Delivery', icon: <Banknote className="w-5 h-5" /> },
  { id: 'esewa', label: 'eSewa', icon: <Wallet className="w-5 h-5" /> },
  { id: 'khalti', label: 'Khalti', icon: <CreditCard className="w-5 h-5" /> },
];

const CheckoutPage = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { addOrder } = useAdminStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('cod');

  const total = getTotal();

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!/^98\d{8}$/.test(phone) && !/^97\d{8}$/.test(phone)) {
      toast({ title: '❌ Invalid phone', description: 'Enter a valid 10-digit Nepali number.', variant: 'destructive' });
      return;
    }

    const order = {
      id: Date.now().toString(),
      orderNumber: `#${1000 + Math.floor(Math.random() * 9000)}`,
      customerName: name,
      customerEmail: user?.email || '',
      items: items.map(i => ({ menuItemId: i.id, name: i.name, price: i.price, quantity: i.quantity, subtotal: i.price * i.quantity })),
      total,
      status: 'confirmed' as const,
      address,
      phone,
      paymentMethod: payment,
      notes,
      createdAt: new Date().toISOString(),
    };
    addOrder(order);
    clearCart();
    navigate('/order-success', { state: { order } });
  };

  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-10 bg-background">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8 text-center">Checkout</h1>
        <form onSubmit={handleOrder} className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground">Delivery Details</h2>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-2.5 rounded-lg border border-input bg-background font-body text-sm focus:ring-2 focus:ring-ring outline-none" required />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (e.g. 98XXXXXXXX)" className="w-full px-4 py-2.5 rounded-lg border border-input bg-background font-body text-sm focus:ring-2 focus:ring-ring outline-none" required />
              <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address (Ward, Tole, Landmark)" className="w-full px-4 py-2.5 rounded-lg border border-input bg-background font-body text-sm focus:ring-2 focus:ring-ring outline-none" required />
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Delivery notes (optional)" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background font-body text-sm focus:ring-2 focus:ring-ring outline-none resize-none" />
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
              <h2 className="font-display text-lg font-semibold text-foreground">Payment Method</h2>
              {paymentMethods.map(pm => (
                <label key={pm.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${payment === pm.id ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30'}`}>
                  <input type="radio" name="payment" value={pm.id} checked={payment === pm.id} onChange={() => setPayment(pm.id)} className="accent-primary" />
                  <span className="text-muted-foreground">{pm.icon}</span>
                  <span className="font-body text-sm font-medium text-foreground">{pm.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl border border-border p-6 lg:sticky lg:top-24 space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground">Order Summary</h2>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="font-body text-xs text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <span className="font-body text-sm font-semibold text-foreground shrink-0">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Subtotal</span><span>Rs. {total}</span></div>
                <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Delivery</span><span className="text-green-600">Free</span></div>
                <div className="flex justify-between font-body text-lg font-bold border-t border-border pt-2"><span>Total</span><span className="text-primary">Rs. {total}</span></div>
              </div>
              <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold hover:bg-primary-dark transition-colors">
                ✓ Place Order
              </button>
              <p className="font-body text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Secure & safe ordering
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
