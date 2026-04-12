export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'esewa' | 'khalti';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  address: string;
  phone: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}
