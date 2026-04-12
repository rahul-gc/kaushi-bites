import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';

const CustomersTab = () => {
  const { registeredUsers } = useAuthStore();
  const { orders } = useAdminStore();

  const customers = registeredUsers.map(u => {
    const userOrders = orders.filter(o => o.customerEmail === u.email);
    return {
      name: u.name,
      email: u.email,
      orders: userOrders.length,
      totalSpent: userOrders.reduce((s, o) => s + o.total, 0),
    };
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-admin-text mb-6">Customers ({customers.length})</h1>
      <div className="bg-admin-card rounded-xl border border-admin-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-admin-border">
                <th className="px-5 py-3 font-body text-xs text-admin-muted font-medium">Name</th>
                <th className="px-5 py-3 font-body text-xs text-admin-muted font-medium">Email</th>
                <th className="px-5 py-3 font-body text-xs text-admin-muted font-medium">Orders</th>
                <th className="px-5 py-3 font-body text-xs text-admin-muted font-medium">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center font-body text-sm text-admin-muted">No customers yet.</td></tr>
              ) : (
                customers.map(c => (
                  <tr key={c.email} className="border-b border-admin-border/50">
                    <td className="px-5 py-3 font-body text-sm text-admin-text font-medium">{c.name}</td>
                    <td className="px-5 py-3 font-body text-sm text-admin-muted">{c.email}</td>
                    <td className="px-5 py-3 font-body text-sm text-admin-text">{c.orders}</td>
                    <td className="px-5 py-3 font-body text-sm text-admin-text">Rs. {c.totalSpent}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersTab;
