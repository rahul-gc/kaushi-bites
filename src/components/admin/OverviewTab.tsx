import { ShoppingBag, DollarSign, UtensilsCrossed, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

const OverviewTab = () => {
  const { orders, menuItems } = useAdminStore();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed');

  const stats = [
    { label: 'Orders Today', value: todayOrders.length, icon: ShoppingBag, trend: '+12%', up: true },
    { label: 'Revenue Today', value: `Rs. ${todayRevenue}`, icon: DollarSign, trend: '+8%', up: true },
    { label: 'Menu Items', value: menuItems.length, icon: UtensilsCrossed, trend: '', up: true },
    { label: 'Pending Orders', value: pendingOrders.length, icon: Clock, trend: '-3%', up: false },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-admin-text mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-admin-card rounded-xl border border-admin-border p-5">
            <div className="flex items-center justify-between mb-3">
              <s.icon className="w-5 h-5 text-admin-accent" />
              {s.trend && (
                <span className={`flex items-center gap-0.5 text-xs font-body font-semibold ${s.up ? 'text-green-400' : 'text-red-400'}`}>
                  {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.trend}
                </span>
              )}
            </div>
            <p className="font-display text-2xl font-bold text-admin-text">{s.value}</p>
            <p className="font-body text-xs text-admin-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders table */}
      <div className="bg-admin-card rounded-xl border border-admin-border overflow-hidden">
        <div className="p-5 border-b border-admin-border">
          <h2 className="font-display text-lg font-semibold text-admin-text">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-admin-border">
                <th className="px-5 py-3 font-body text-xs text-admin-muted font-medium">Order</th>
                <th className="px-5 py-3 font-body text-xs text-admin-muted font-medium">Customer</th>
                <th className="px-5 py-3 font-body text-xs text-admin-muted font-medium">Items</th>
                <th className="px-5 py-3 font-body text-xs text-admin-muted font-medium">Total</th>
                <th className="px-5 py-3 font-body text-xs text-admin-muted font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map(o => (
                <tr key={o.id} className="border-b border-admin-border/50">
                  <td className="px-5 py-3 font-body text-sm text-admin-text">{o.orderNumber}</td>
                  <td className="px-5 py-3 font-body text-sm text-admin-text">{o.customerName}</td>
                  <td className="px-5 py-3 font-body text-sm text-admin-muted">{o.items.length} items</td>
                  <td className="px-5 py-3 font-body text-sm text-admin-text">Rs. {o.total}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    confirmed: 'bg-blue-500/20 text-blue-400',
    preparing: 'bg-orange-500/20 text-orange-400',
    ready: 'bg-green-500/20 text-green-400',
    delivered: 'bg-green-600/20 text-green-300',
    cancelled: 'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full font-body text-xs font-semibold capitalize ${colors[status] || ''}`}>
      {status}
    </span>
  );
};

export default OverviewTab;
