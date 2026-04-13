import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';
import { apiService } from '@/services/api';

interface AuthStore {
  user: User | null;
  isLoginOpen: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  setLoginOpen: (open: boolean) => void;
  updateProfile: (userData: { name?: string; phone?: string }) => Promise<boolean>;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoginOpen: false,
      isLoading: false,
      error: null,
      
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token is still valid by getting profile
          apiService.getProfile()
            .then(data => {
              set({ user: data.user, error: null });
            })
            .catch(() => {
              // Token is invalid, clear it
              localStorage.removeItem('token');
              set({ user: null, error: null });
            });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiService.login({ email, password });
          localStorage.setItem('token', data.token);
          set({
            user: data.user,
            isLoginOpen: false,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          return false;
        }
      },

      register: async (name, email, password, phone) => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiService.register({ name, email, password, phone });
          localStorage.setItem('token', data.token);
          set({
            user: data.user,
            isLoginOpen: false,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, error: null });
      },

      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiService.updateProfile(userData);
          set({
            user: data.user,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Profile update failed',
          });
          return false;
        }
      },

      setLoginOpen: (open) => set({ isLoginOpen: open, error: null }),
      clearError: () => set({ error: null }),
    }),
    { 
      name: 'kaushi-auth',
      partialize: (state) => ({ user: state.user })
    }
  )
);
