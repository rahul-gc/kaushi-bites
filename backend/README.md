# Kaushi Bites Backend API

Complete backend API for the Kaushi Bites restaurant application.

## Features

- **Authentication**: User registration, login, JWT-based auth
- **Menu Management**: Categories and menu items with full CRUD operations
- **Cart System**: Session-based cart management
- **Order Management**: Complete order lifecycle with status tracking
- **Admin Panel**: Admin authentication and dashboard management
- **Security**: Rate limiting, input validation, password hashing
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Make sure MongoDB is running on your system

4. Seed the database with initial data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:slug` - Update category (Admin only)
- `DELETE /api/categories/:slug` - Delete category (Admin only)

### Menu Items
- `GET /api/menu` - Get all menu items (with filtering)
- `GET /api/menu/featured` - Get featured items
- `GET /api/menu/category/:category` - Get items by category
- `GET /api/menu/:id` - Get item by ID
- `POST /api/menu` - Create menu item (Admin only)
- `PUT /api/menu/:id` - Update menu item (Admin only)
- `DELETE /api/menu/:id` - Delete menu item (Admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:menuItemId` - Update item quantity
- `DELETE /api/cart/remove/:menuItemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart
- `GET /api/cart/summary` - Get cart summary

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/cancel` - Cancel order

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/overview` - Get dashboard stats
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/menu-items` - Get all menu items
- `GET /api/admin/users` - Get all users

## Default Credentials

After running the seed script:

**Admin:**
- Email: admin@kaushi.com
- Password: kaushi@2025

**Sample Users:**
- Email: ram@email.com
- Password: password123
- Email: sita@email.com
- Password: password123

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kaushi-bites
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers

## Database Schema

### User
- id, name, email, password, phone, isAdmin, timestamps

### Category
- id, name, slug, image, timestamps

### MenuItem
- id, name, description, price, category, image, rating, badge, isAvailable, isFeatured, timestamps

### Order
- id, orderNumber, customerName, customerEmail, items, total, status, address, phone, paymentMethod, notes, userId, timestamps

## Development

The API runs on port 5000 by default and includes comprehensive error handling and logging.

## License

MIT
