import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useToast } from '@/hooks/use-toast';
import { OrderStatus } from '@/types/order';

const statusFilters: { id: string; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'delivered', label: 'Delivered' },
];

const OrdersTab = () => {
  const { orders, updateOrderStatus } = useAdminStore();
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const handleStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    toast({ title: `Order updated to ${status}` });
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    confirmed: 'bg-blue-500/20 text-blue-400',
    preparing: 'bg-orange-500/20 text-orange-400',
    ready: 'bg-green-500/20 text-green-400',
    delivered: 'bg-green-600/20 text-green-300',
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-admin-text mb-6">Orders</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {statusFilters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`shrink-0 px-4 py-2 rounded-lg font-body text-sm font-medium transition-colors ${filter === f.id ? 'bg-admin-accent text-white' : 'bg-admin-card text-admin-muted border border-admin-border hover:text-admin-text'}`}>
            {f.label} {f.id !== 'all' && `(${orders.filter(o => o.status === f.id).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(order => (
          <div key={order.id} className="bg-admin-card rounded-xl border border-admin-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <span className="font-body text-sm font-bold text-admin-text">{order.orderNumber}</span>
                <span className="font-body text-sm text-admin-muted ml-3">{order.customerName}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full font-body text-xs font-semibold capitalize ${statusColors[order.status] || ''}`}>
                {order.status}
              </span>
            </div>
            <div className="font-body text-sm text-admin-muted mb-2">
              {order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-body text-sm">
                <span className="text-admin-text font-semibold">Rs. {order.total}</span>
                <span className="text-admin-muted ml-3 capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
              </div>
              <div className="flex gap-2">
                {order.status === 'pending' && <button onClick={() => handleStatus(order.id, 'confirmed')} className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 font-body text-xs font-semibold hover:bg-blue-500/30 transition-colors">Confirm</button>}
                {order.status === 'confirmed' && <button onClick={() => handleStatus(order.id, 'preparing')} className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 font-body text-xs font-semibold hover:bg-orange-500/30 transition-colors">Start Prep</button>}
                {order.status === 'preparing' && <button onClick={() => handleStatus(order.id, 'delivered')} className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 font-body text-xs font-semibold hover:bg-green-500/30 transition-colors">Mark Delivered ✓</button>}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center font-body text-admin-muted py-10">No orders found.</p>}
      </div>
    </div>
  );
};

export default OrdersTab;
