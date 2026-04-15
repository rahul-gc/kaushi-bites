const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');

class Category {
  static async create(categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  static async findBySlug(slug) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async update(slug, updateData) {
    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(slug) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('slug', slug);
    
    if (error) throw error;
  }
}

class MenuItem {
  static async create(itemData) {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(itemData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async findAll(filters = {}) {
    let query = supabase
      .from('menu_items')
      .select('*');

    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters.featured) {
      query = query.eq('is_featured', true);
    }
    if (filters.available) {
      query = query.eq('is_available', true);
    }

    const { data, error } = await query.order('name');
    
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByCategory(category) {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category', category)
      .eq('is_available', true)
      .order('name');
    
    if (error) throw error;
    return data;
  }

  static async findFeatured() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_featured', true)
      .eq('is_available', true)
      .order('name');
    
    if (error) throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  static async count(filters = {}) {
    let query = supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true });

    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters.available !== undefined) {
      query = query.eq('is_available', filters.available);
    }

    const { count, error } = await query;
    
    if (error) throw error;
    return count;
  }
}

class User {
  static async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_admin', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  }

  static async count() {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_admin', false);
    
    if (error) throw error;
    return count;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

class Order {
  static async create(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByCustomerEmail(email) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async findAll(filters = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let query = supabase
      .from('orders')
      .select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  }

  static async count(filters = {}) {
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { count, error } = await query;
    
    if (error) throw error;
    return count;
  }

  static async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getStats() {
    const { data, error } = await supabase
      .from('orders')
      .select('status, total')
      .neq('status', 'cancelled');
    
    if (error) throw error;
    
    const stats = {
      totalOrders: data.length,
      totalRevenue: data.reduce((sum, order) => sum + parseFloat(order.total), 0),
      ordersByStatus: {}
    };

    data.forEach(order => {
      stats.ordersByStatus[order.status] = (stats.ordersByStatus[order.status] || 0) + 1;
    });

    return stats;
  }

  static async getTodayOrders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());
    
    if (error) throw error;
    return count;
  }

  static async getRecentOrders(limit = 5) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
}

module.exports = {
  Category,
  MenuItem,
  User,
  Order
};
