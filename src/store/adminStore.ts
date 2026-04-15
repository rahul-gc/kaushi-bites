import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderStatus } from '@/types/order';
import { MenuItem } from '@/types/menu';
import { apiService } from '@/services/api';

interface AdminStore {
  isAdmin: boolean;
  isAdminLoginOpen: boolean;
  activeTab: string;
  menuItems: MenuItem[];
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  setAdminLoginOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  fetchMenuItems: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  addMenuItem: (item: MenuItem) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAdmin: false,
      isAdminLoginOpen: false,
      activeTab: 'overview',
      menuItems: [],
      orders: [],
      isLoading: false,
      error: null,
      
      loginAdmin: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://kaushi-bites-backend.onrender.com/api' : 'http://localhost:5000/api'}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });
          const data = await response.json();
          if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('adminId', data.user.id);
            set({ isAdmin: true, isAdminLoginOpen: false, isLoading: false });
            return true;
          } else {
            set({ error: data.message || 'Login failed', isLoading: false });
            return false;
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Login failed', isLoading: false });
          return false;
        }
      },
      
      logoutAdmin: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminId');
        set({ isAdmin: false, activeTab: 'overview' });
      },
      setAdminLoginOpen: (open) => set({ isAdminLoginOpen: open }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      fetchMenuItems: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiService.getMenuItems();
          set({ menuItems: data, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch menu items', isLoading: false });
        }
      },
      
      fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiService.getOrders();
          set({ orders: data, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch orders', isLoading: false });
        }
      },
      
      addMenuItem: async (item) => {
        set({ isLoading: true, error: null });
        try {
          await apiService.createMenuItem(item);
          await get().fetchMenuItems();
          set({ isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add menu item', isLoading: false });
        }
      },
      
      updateMenuItem: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          await apiService.updateMenuItem(id, updates);
          await get().fetchMenuItems();
          set({ isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update menu item', isLoading: false });
        }
      },
      
      deleteMenuItem: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await apiService.deleteMenuItem(id);
          await get().fetchMenuItems();
          set({ isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete menu item', isLoading: false });
        }
      },
      
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      
      updateOrderStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
          await apiService.updateOrderStatus(id, status);
          await get().fetchOrders();
          set({ isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update order status', isLoading: false });
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    { name: 'kaushi-admin' }
  )
);
