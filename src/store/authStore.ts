import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface AuthStore {
  user: User | null;
  isLoginOpen: boolean;
  login: (email: string, password: string, name?: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  setLoginOpen: (open: boolean) => void;
  registeredUsers: { email: string; password: string; name: string }[];
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoginOpen: false,
      registeredUsers: [],
      login: (email, password) => {
        const users = get().registeredUsers;
        const found = users.find(u => u.email === email && u.password === password);
        if (found) {
          set({
            user: { id: email, name: found.name, email, createdAt: new Date().toISOString() },
            isLoginOpen: false,
          });
          return true;
        }
        return false;
      },
      register: (name, email, password) => {
        const users = get().registeredUsers;
        if (users.find(u => u.email === email)) return false;
        const newUsers = [...users, { email, password, name }];
        set({
          registeredUsers: newUsers,
          user: { id: email, name, email, createdAt: new Date().toISOString() },
          isLoginOpen: false,
        });
        return true;
      },
      logout: () => set({ user: null }),
      setLoginOpen: (open) => set({ isLoginOpen: open }),
    }),
    { name: 'kaushi-auth' }
  )
);
