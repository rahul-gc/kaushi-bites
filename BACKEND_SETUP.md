# Kaushi Bites Backend Setup Guide

## Overview
Your Kaushi Bites application now has a complete backend API with:
- User authentication & authorization
- Menu management (categories & items)
- Cart functionality
- Order processing
- Admin dashboard
- MongoDB database integration

## Prerequisites
1. **Node.js** (v16 or higher)
2. **MongoDB** (installed and running locally)
3. **Git** (for version control)

## Setup Instructions

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
The `.env` file is already created with default settings:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kaushi-bites
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
- **Windows**: Start MongoDB service
- **Mac**: `brew services start mongodb-community`
- **Linux**: `sudo systemctl start mongod`

### 4. Seed the Database
Populate the database with initial data:
```bash
npm run seed
```

This will create:
- 6 categories (All Items, Momo, Rice Dishes, Curry, Snacks, Drinks)
- 15 menu items with full details
- Admin user: `admin@kaushi.com` / `kaushi@2025`
- Sample users: `ram@email.com` / `password123`, `sita@email.com` / `password123`

### 5. Start the Backend Server
```bash
npm run dev
```

The backend will be available at: `http://localhost:5000`

### 6. Start the Frontend (if not already running)
In a separate terminal:
```bash
npm run dev
```

The frontend will be available at: `http://localhost:8080`

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
- `GET /api/menu` - Get all menu items
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

## Frontend Integration

The frontend has been updated to use the backend API:

### Updated Stores:
- **authStore**: Now uses JWT authentication with backend
- **cartStore**: Session-based cart management via API
- **menuService**: Handles all menu data from API

### New Services:
- **apiService**: Centralized API client with error handling
- **menuService**: Menu data management with caching

### Features Added:
- Loading states and error handling
- Token-based authentication
- Real-time cart synchronization
- Persistent data across sessions

## Testing the Integration

### 1. Test User Authentication
1. Register a new user
2. Login with the credentials
3. Check that user profile loads correctly

### 2. Test Cart Functionality
1. Add items to cart
2. Update quantities
3. Remove items
4. Clear cart

### 3. Test Order Processing
1. Add items to cart
2. Proceed to checkout
3. Place an order
4. Check order history

### 4. Test Admin Features
1. Login as admin: `admin@kaushi.com` / `kaushi@2025`
2. Access admin dashboard
3. View orders and update status
4. Manage menu items and categories

## Troubleshooting

### Backend Won't Start
- Check if MongoDB is running
- Verify all dependencies are installed
- Check for port conflicts (default: 5000)

### Database Connection Issues
- Ensure MongoDB is running on `localhost:27017`
- Check the `MONGODB_URI` in `.env` file
- Verify MongoDB authentication if required

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check CORS configuration in backend
- Verify API base URL in `src/services/api.ts`

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in `.env`
- Verify token expiration settings

## Production Considerations

### Security
- Change `JWT_SECRET` to a secure random string
- Enable HTTPS in production
- Set `NODE_ENV=production`
- Configure proper CORS origins

### Database
- Use MongoDB Atlas or a production MongoDB instance
- Set up database authentication
- Configure backup strategies

### Performance
- Implement Redis for session storage
- Add database indexes for queries
- Consider CDN for static assets

## Next Steps

1. **Deploy Backend**: Use services like Heroku, Vercel, or AWS
2. **Add Payment Integration**: Integrate eSewa, Khalti payment gateways
3. **Email Notifications**: Add order confirmation emails
4. **Image Upload**: Add functionality to upload menu item images
5. **Analytics**: Add order tracking and analytics

## Support

If you encounter any issues:
1. Check the console logs for errors
2. Verify all services are running (MongoDB, Backend, Frontend)
3. Review the API endpoints in Postman or similar tool
4. Check network requests in browser dev tools

Your Kaushi Bites application is now a full-stack restaurant management system! 🎉
