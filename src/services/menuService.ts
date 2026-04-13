import { Category, MenuItem } from '@/types/menu';
import { apiService } from './api';

class MenuService {
  private categories: Category[] = [];
  private menuItems: MenuItem[] = [];
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getCategories(): Promise<Category[]> {
    try {
      const data = await apiService.getCategories();
      this.categories = data;
      return data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Return cached data if available
      return this.categories;
    }
  }

  async getMenuItems(params?: { category?: string; featured?: boolean; available?: boolean }): Promise<MenuItem[]> {
    try {
      const data = await apiService.getMenuItems(params);
      this.menuItems = data;
      return data;
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      // Return cached data if available
      return this.menuItems;
    }
  }

  async getFeaturedItems(): Promise<MenuItem[]> {
    try {
      const data = await apiService.getFeaturedItems();
      return data;
    } catch (error) {
      console.error('Failed to fetch featured items:', error);
      // Filter from cached data
      return this.menuItems.filter(item => item.isFeatured && item.isAvailable);
    }
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    try {
      const data = await apiService.getMenuItemsByCategory(category);
      return data;
    } catch (error) {
      console.error('Failed to fetch menu items by category:', error);
      // Filter from cached data
      return this.menuItems.filter(item => item.category === category && item.isAvailable);
    }
  }

  async getMenuItem(id: string): Promise<MenuItem | null> {
    try {
      const data = await apiService.getMenuItem(id);
      return data;
    } catch (error) {
      console.error('Failed to fetch menu item:', error);
      // Find in cached data
      return this.menuItems.find(item => item.id === id) || null;
    }
  }

  // Initialize data on app startup
  async initializeData(): Promise<void> {
    const now = Date.now();
    if (now - this.lastFetch < this.CACHE_DURATION && this.categories.length > 0) {
      return; // Use cached data
    }

    try {
      await Promise.all([
        this.getCategories(),
        this.getMenuItems({ available: true })
      ]);
      this.lastFetch = now;
    } catch (error) {
      console.error('Failed to initialize menu data:', error);
    }
  }

  // Get cached data (for immediate UI updates)
  getCachedCategories(): Category[] {
    return this.categories;
  }

  getCachedMenuItems(): MenuItem[] {
    return this.menuItems;
  }

  // Refresh data
  async refreshData(): Promise<void> {
    this.lastFetch = 0; // Force refresh
    await this.initializeData();
  }
}

export const menuService = new MenuService();
