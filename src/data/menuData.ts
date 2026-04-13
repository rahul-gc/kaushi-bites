import { Category, MenuItem } from '@/types/menu';

// Static data for fallback
export const categories: Category[] = [
  { id: 'all', name: 'All Items', slug: 'all', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop' },
  { id: 'momo', name: 'Momo', slug: 'momo', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&h=300&fit=crop' },
  { id: 'rice', name: 'Rice Dishes', slug: 'rice', image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a5c19?w=300&h=300&fit=crop' },
  { id: 'curry', name: 'Curry', slug: 'curry', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=300&fit=crop' },
  { id: 'snacks', name: 'Snacks', slug: 'snacks', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop' },
  { id: 'drinks', name: 'Drinks', slug: 'drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop' },
];

export const menuItems: MenuItem[] = [
  {
    id: '1', name: 'Steam Momo', description: 'Juicy steamed dumplings filled with seasoned chicken, served with spicy tomato achar.', price: 180,
    category: 'momo', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&h=400&fit=crop', rating: 4.8, badge: 'Bestseller', is_available: true, is_featured: true,
  },
  {
    id: '2', name: 'Fried Momo', description: 'Crispy golden fried dumplings with a crunchy exterior and tender filling inside.', price: 200,
    category: 'momo', image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600&h=400&fit=crop', rating: 4.7, badge: 'Popular', is_available: true, is_featured: true,
  },
  {
    id: '3', name: 'Jhol Momo', description: 'Steamed momos swimming in a tangy, spicy sesame-tomato soup. A Nepali street food classic.', price: 220,
    category: 'momo', image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=600&h=400&fit=crop', rating: 4.9, badge: 'Spicy 🌶️', is_available: true, is_featured: false,
  },
  {
    id: '4', name: 'Chilli Momo', description: 'Fried momos tossed in a fiery chilli sauce with bell peppers and onions.', price: 240,
    category: 'momo', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&h=400&fit=crop', rating: 4.6, is_available: true, is_featured: false,
  },
  {
    id: '5', name: 'Dal Bhat Tarkari', description: 'The classic Nepali meal — steamed rice, lentil soup, seasonal vegetables, and pickle.', price: 250,
    category: 'rice', image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a5c19?w=600&h=400&fit=crop', rating: 4.9, badge: 'Bestseller', is_available: true, is_featured: true,
  },
  {
    id: '6', name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken, caramelized onions, and saffron.', price: 350,
    category: 'rice', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop', rating: 4.7, badge: 'New', is_available: true, is_featured: false,
  },
  {
    id: '7', name: 'Veg Fried Rice', description: 'Wok-tossed rice with fresh vegetables, soy sauce, and aromatic spices.', price: 200,
    category: 'rice', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop', rating: 4.5, is_available: true, is_featured: false,
  },
  {
    id: '8', name: 'Chicken Curry', description: 'Tender chicken pieces simmered in a rich, aromatic Nepali-style curry gravy.', price: 300,
    category: 'curry', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop', rating: 4.8, badge: 'Popular', is_available: true, is_featured: true,
  },
  {
    id: '9', name: 'Mutton Curry', description: 'Slow-cooked mutton in a thick, spicy gravy with traditional Nepali spice blend.', price: 450,
    category: 'curry', image: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&h=400&fit=crop', rating: 4.9, badge: 'Premium', is_available: true, is_featured: false,
  },
  {
    id: '10', name: 'Paneer Butter Masala', description: 'Cottage cheese cubes in a creamy, buttery tomato-based sauce.', price: 280,
    category: 'curry', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&h=400&fit=crop', rating: 4.6, is_available: true, is_featured: false,
  },
  {
    id: '11', name: 'Chatpate', description: 'A tangy, spicy Nepali street snack made with puffed rice, peanuts, and lemon juice.', price: 80,
    category: 'snacks', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop', rating: 4.5, badge: 'Street Food', is_available: true, is_featured: false,
  },
  {
    id: '12', name: 'Samosa', description: 'Crispy golden pastry triangles stuffed with spiced potatoes and peas.', price: 60,
    category: 'snacks', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop', rating: 4.4, is_available: true, is_featured: false,
  },
  {
    id: '13', name: 'Masala Tea', description: 'Traditional Nepali chiya — black tea brewed with ginger, cardamom, and milk.', price: 40,
    category: 'drinks', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=400&fit=crop', rating: 4.8, badge: 'Classic', is_available: true, is_featured: false,
  },
  {
    id: '14', name: 'Mango Lassi', description: 'Thick, creamy yogurt drink blended with ripe mangoes and a touch of cardamom.', price: 120,
    category: 'drinks', image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&h=400&fit=crop', rating: 4.7, is_available: true, is_featured: false,
  },
  {
    id: '15', name: 'Lemon Soda', description: 'Refreshing sparkling lemon drink — sweet, salty, or mixed. Perfect for hot days.', price: 60,
    category: 'drinks', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&h=400&fit=crop', rating: 4.3, is_available: true, is_featured: false,
  },
];
