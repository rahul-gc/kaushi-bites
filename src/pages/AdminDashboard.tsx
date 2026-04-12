import { useAdminStore } from '@/store/adminStore';
import AdminSidebar from '@/components/admin/AdminSidebar';
import OverviewTab from '@/components/admin/OverviewTab';
import OrdersTab from '@/components/admin/OrdersTab';
import ProductsTab from '@/components/admin/ProductsTab';
import CustomersTab from '@/components/admin/CustomersTab';
import SettingsTab from '@/components/admin/SettingsTab';

const AdminDashboard = () => {
  const { activeTab } = useAdminStore();

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'orders': return <OrdersTab />;
      case 'products': return <ProductsTab />;
      case 'customers': return <CustomersTab />;
      case 'settings': return <SettingsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-admin-bg">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-60 p-6 overflow-y-auto">
        {renderTab()}
      </main>
    </div>
  );
};

export default AdminDashboard;
