const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic request method
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: { name: string; email: string; password: string; phone?: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  async updateProfile(userData: { name?: string; phone?: string }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Category endpoints
  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(slug: string) {
    return this.request(`/categories/${slug}`);
  }

  // Menu endpoints
  async getMenuItems(params?: { category?: string; featured?: boolean; available?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== 'all') {
      searchParams.append('category', params.category);
    }
    if (params?.featured) {
      searchParams.append('featured', 'true');
    }
    if (params?.available) {
      searchParams.append('available', 'true');
    }

    const query = searchParams.toString();
    return this.request(`/menu${query ? `?${query}` : ''}`);
  }

  async getFeaturedItems() {
    return this.request('/menu/featured');
  }

  async getMenuItemsByCategory(category: string) {
    return this.request(`/menu/category/${category}`);
  }

  async getMenuItem(id: string) {
    return this.request(`/menu/${id}`);
  }

  // Cart endpoints
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(menuItemId: string, quantity: number = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ menuItemId, quantity }),
    });
  }

  async updateCartItem(menuItemId: string, quantity: number) {
    return this.request(`/cart/update/${menuItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(menuItemId: string) {
    return this.request(`/cart/remove/${menuItemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    });
  }

  async getCartSummary() {
    return this.request('/cart/summary');
  }

  // Order endpoints
  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData: {
    items: Array<{ menuItemId: string; quantity: number }>;
    address: string;
    phone: string;
    paymentMethod: 'cod' | 'esewa' | 'khalti';
    notes?: string;
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(id: string) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'PUT',
    });
  }

  // Admin endpoints
  async adminLogin(credentials: { username: string; password: string }) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getAdminOverview() {
    return this.request('/admin/overview');
  }

  async getAdminOrders(params?: { status?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.status) {
      searchParams.append('status', params.status);
    }
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const query = searchParams.toString();
    return this.request(`/admin/orders${query ? `?${query}` : ''}`);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAdminMenuItems(params?: { page?: number; limit?: number; category?: string; available?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }
    if (params?.category && params.category !== 'all') {
      searchParams.append('category', params.category);
    }
    if (params?.available !== undefined) {
      searchParams.append('available', params.available.toString());
    }

    const query = searchParams.toString();
    return this.request(`/admin/menu-items${query ? `?${query}` : ''}`);
  }

  async createMenuItem(menuItemData: any) {
    return this.request('/menu', {
      method: 'POST',
      body: JSON.stringify(menuItemData),
    });
  }

  async updateMenuItem(id: string, menuItemData: any) {
    return this.request(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(menuItemData),
    });
  }

  async deleteMenuItem(id: string) {
    return this.request(`/menu/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminUsers(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const query = searchParams.toString();
    return this.request(`/admin/users${query ? `?${query}` : ''}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
