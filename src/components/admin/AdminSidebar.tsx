import { BarChart3, ClipboardList, UtensilsCrossed, Users, Settings, LogOut } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import kaushiLogo from '@/assets/kaushi-logo.png';

const navItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'products', label: 'Menu / Products', icon: UtensilsCrossed },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AdminSidebar = () => {
  const { activeTab, setActiveTab, logoutAdmin } = useAdminStore();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-admin-sidebar border-r border-admin-border flex-col hidden md:flex z-50">
      <div className="p-6 border-b border-admin-border">
        <div className="flex items-center gap-2">
          <img src={kaushiLogo} alt="Kaushi" className="h-8 w-8 rounded-full object-cover" />
          <h2 className="font-display text-lg font-bold text-admin-text">Kaushi</h2>
        </div>
        <p className="font-body text-xs text-admin-accent">Admin Dashboard</p>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-body text-sm transition-colors ${
              activeTab === item.id
                ? 'bg-admin-accent/10 text-admin-accent border-l-2 border-admin-accent'
                : 'text-admin-muted hover:text-admin-text hover:bg-admin-bg/50'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-admin-border">
        <button onClick={logoutAdmin} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-body text-sm text-red-400 hover:bg-red-400/10 transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
