# Kaushi Bites - Supabase Setup Guide

## Overview
Your backend has been migrated from MongoDB to Supabase! This guide will help you set up and run the complete system.

## Prerequisites
1. **Supabase Account**: Create a free account at https://supabase.com
2. **Node.js** (v16 or higher)
3. **Git** (for version control)

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project" 
3. Sign up/login
4. Create a new project:
   - **Organization**: Choose your organization
   - **Project Name**: `kaushi-bites`
   - **Database Password**: Create a strong password
   - **Region**: Choose the nearest region to you

## Step 2: Get Supabase Credentials

Once your project is created, go to:
1. **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxxxxx.supabase.co`)
   - **service_role** (secret) key
   - **anon** (public) key

## Step 3: Update Environment Variables

Edit your `backend/.env` file:

```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

## Step 4: Set Up Database Schema

1. Go to your Supabase project
2. Click **SQL Editor** in the sidebar
3. Click **New query**
4. Copy and paste the contents of `backend/database/schema.sql`
5. Click **Run** to execute the schema

## Step 5: Install Dependencies

```bash
cd backend
npm install
```

## Step 6: Seed the Database

```bash
npm run seed
```

This will create:
- 6 categories (All Items, Momo, Rice Dishes, Curry, Snacks, Drinks)
- 15 menu items with full details
- Admin user: `admin@kaushi.com` / `kaushi@2025`
- Sample users: `ram@email.com` / `password123`, `sita@email.com` / `password123`

## Step 7: Start the Backend Server

```bash
npm run dev
```

The backend will be available at: `http://localhost:5000`

## Step 8: Start the Frontend

In a separate terminal:

```bash
npm run dev
```

The frontend will be available at: `http://localhost:8080`

## Features Available

### ✅ User Authentication
- User registration and login
- JWT token-based authentication
- Profile management

### ✅ Menu Management
- Categories and menu items
- Featured items
- Availability status

### ✅ Cart System
- Add/remove items
- Update quantities
- Session-based storage

### ✅ Order Processing
- Create orders
- Track order status
- Order history

### ✅ Admin Dashboard
- Admin login: `admin@kaushi.com` / `kaushi@2025`
- View all orders
- Update order status
- Manage menu items
- User management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:slug` - Update category (Admin only)
- `DELETE /api/categories/:slug` - Delete category (Admin only)

### Menu Items
- `GET /api/menu` - Get all menu items
- `GET /api/menu/featured` - Get featured items
- `GET /api/menu/category/:category` - Get items by category
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
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/cancel` - Cancel order

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/overview` - Get dashboard stats
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/menu-items` - Get all menu items
- `GET /api/admin/users` - Get all users

## Troubleshooting

### Backend Won't Start
- Check if all dependencies are installed
- Verify Supabase credentials in `.env`
- Check for port conflicts (default: 5000)

### Database Connection Issues
- Verify Supabase URL and keys in `.env`
- Check if database schema was created correctly
- Ensure RLS is disabled (as you mentioned)

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API base URL in `src/services/api.ts`

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in `.env`
- Verify user exists in Supabase database

## Testing the System

### 1. Test User Registration
1. Go to http://localhost:8080
2. Click "Sign Up"
3. Fill in details and register
4. Try logging in

### 2. Test Cart Functionality
1. Browse menu items
2. Add items to cart
3. Update quantities
4. Proceed to checkout

### 3. Test Admin Features
1. Go to admin section
2. Login with: `admin@kaushi.com` / `kaushi@2025`
3. View dashboard
4. Manage orders and menu items

## Production Considerations

### Security
- Change JWT_SECRET to a secure random string
- Enable HTTPS in production
- Consider enabling RLS for production
- Set `NODE_ENV=production`

### Database
- Supabase handles backups automatically
- Monitor database usage in Supabase dashboard
- Consider upgrading plan for higher limits

### Performance
- Supabase provides good performance out of the box
- Monitor API usage in Supabase dashboard
- Consider CDN for static assets

## Next Steps

1. **Deploy Backend**: Use services like Vercel, Railway, or DigitalOcean
2. **Add Payment Integration**: Integrate eSewa, Khalti payment gateways
3. **Email Notifications**: Set up Supabase Auth emails or external service
4. **Image Upload**: Add Supabase Storage for menu item images
5. **Analytics**: Add order tracking and analytics

Your Kaushi Bites application is now running on Supabase! 🎉
