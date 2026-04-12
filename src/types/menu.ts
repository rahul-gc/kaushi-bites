export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  badge?: string;
  isAvailable: boolean;
  isFeatured: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
