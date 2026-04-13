import { Category, MenuItem } from '@/types/menu';
import { menuService } from '@/services/menuService';

// Export functions that use the API service
export const getCategories = (): Promise<Category[]> => {
  return menuService.getCategories();
};

export const getMenuItems = (params?: { category?: string; featured?: boolean; available?: boolean }): Promise<MenuItem[]> => {
  return menuService.getMenuItems(params);
};

export const getFeaturedItems = (): Promise<MenuItem[]> => {
  return menuService.getFeaturedItems();
};

export const getMenuItemsByCategory = (category: string): Promise<MenuItem[]> => {
  return menuService.getMenuItemsByCategory(category);
};

export const getMenuItem = (id: string): Promise<MenuItem | null> => {
  return menuService.getMenuItem(id);
};

// Initialize data on app startup
export const initializeMenuData = (): Promise<void> => {
  return menuService.initializeData();
};

// Get cached data for immediate UI updates
export const getCachedCategories = (): Category[] => {
  return menuService.getCachedCategories();
};

export const getCachedMenuItems = (): MenuItem[] => {
  return menuService.getCachedMenuItems();
};

// Refresh data
export const refreshMenuData = (): Promise<void> => {
  return menuService.refreshData();
};
