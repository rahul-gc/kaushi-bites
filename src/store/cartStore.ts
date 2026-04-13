import { create } from 'zustand';
import { CartItem, MenuItem } from '@/types/menu';
import { apiService } from '@/services/api';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  addItem: (item: MenuItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQty: (id: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  getTotal: () => number;
  getCount: () => number;
  setOpen: (open: boolean) => void;
  clearError: () => void;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  isOpen: false,
  isLoading: false,
  error: null,

  loadCart: async () => {
    try {
      const data = await apiService.getCart();
      set({ items: data.items, error: null });
    } catch (error) {
      console.error('Failed to load cart:', error);
      // Don't set error for cart loading failures to avoid disrupting UX
    }
  },

  addItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.addToCart(item.id, 1);
      const data = await apiService.getCart();
      set({ items: data.items, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to add item to cart',
      });
    }
  },

  removeItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.removeFromCart(id);
      const data = await apiService.getCart();
      set({ items: data.items, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to remove item from cart',
      });
    }
  },

  updateQty: async (id, qty) => {
    set({ isLoading: true, error: null });
    try {
      if (qty <= 0) {
        await apiService.removeFromCart(id);
      } else {
        await apiService.updateCartItem(id, qty);
      }
      const data = await apiService.getCart();
      set({ items: data.items, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update cart',
      });
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiService.clearCart();
      set({ items: [], isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to clear cart',
      });
    }
  },

  getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  setOpen: (open) => set({ isOpen: open, error: null }),
  clearError: () => set({ error: null }),
}));
