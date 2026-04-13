-- Create categories table
CREATE TABLE categories (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE menu_items (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category VARCHAR(255) NOT NULL REFERENCES categories(slug),
  image TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  badge VARCHAR(255),
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,
  order_number VARCHAR(255) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  address TEXT NOT NULL,
  phone VARCHAR(255) NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cod', 'esewa', 'khalti')),
  notes TEXT,
  user_id VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_featured ON menu_items(is_featured);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_users_email ON users(email);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
