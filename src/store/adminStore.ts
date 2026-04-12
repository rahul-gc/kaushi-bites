import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderStatus } from '@/types/order';
import { MenuItem } from '@/types/menu';
import { menuItems as seedItems } from '@/data/menuData';

interface AdminStore {
  isAdmin: boolean;
  isAdminLoginOpen: boolean;
  activeTab: string;
  menuItems: MenuItem[];
  orders: Order[];
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  setAdminLoginOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAdmin: false,
      isAdminLoginOpen: false,
      activeTab: 'overview',
      menuItems: seedItems,
      orders: [
        {
          id: '1', orderNumber: '#1001', customerName: 'Ram Bahadur', customerEmail: 'ram@email.com',
          items: [{ menuItemId: '1', name: 'Steam Momo', price: 180, quantity: 2, subtotal: 360 }],
          total: 360, status: 'confirmed', address: 'Ward 3, Baglung Bazaar', phone: '9841234567',
          paymentMethod: 'cod', createdAt: new Date().toISOString(),
        },
        {
          id: '2', orderNumber: '#1002', customerName: 'Sita Sharma', customerEmail: 'sita@email.com',
          items: [
            { menuItemId: '5', name: 'Dal Bhat Tarkari', price: 250, quantity: 1, subtotal: 250 },
            { menuItemId: '8', name: 'Chicken Curry', price: 300, quantity: 1, subtotal: 300 },
          ],
          total: 550, status: 'preparing', address: 'Ward 1, near Kalika Temple', phone: '9856789012',
          paymentMethod: 'esewa', createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3', orderNumber: '#1003', customerName: 'Hari Thapa', customerEmail: 'hari@email.com',
          items: [{ menuItemId: '6', name: 'Chicken Biryani', price: 350, quantity: 3, subtotal: 1050 }],
          total: 1050, status: 'delivered', address: 'Ward 5, Bus Park area', phone: '9867654321',
          paymentMethod: 'cod', createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ],
      loginAdmin: (username, password) => {
        if (username === 'admin' && password === 'kaushi@2025') {
          set({ isAdmin: true, isAdminLoginOpen: false });
          return true;
        }
        return false;
      },
      logoutAdmin: () => set({ isAdmin: false, activeTab: 'overview' }),
      setAdminLoginOpen: (open) => set({ isAdminLoginOpen: open }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      addMenuItem: (item) => set({ menuItems: [...get().menuItems, item] }),
      updateMenuItem: (id, updates) => set({
        menuItems: get().menuItems.map(i => i.id === id ? { ...i, ...updates } : i),
      }),
      deleteMenuItem: (id) => set({ menuItems: get().menuItems.filter(i => i.id !== id) }),
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      updateOrderStatus: (id, status) => set({
        orders: get().orders.map(o => o.id === id ? { ...o, status } : o),
      }),
    }),
    { name: 'kaushi-admin' }
  )
);
