

## Kaushi Restaurant — Full-Stack Web App Plan

### Prerequisites
- **Connect Supabase**: You'll need to connect your external Supabase project before we begin building the backend features.

---

### Phase 1: Foundation & Design System
- Set up custom color palette (burnt orange `#D4521A`, cream `#FDF8F2`, etc.) in Tailwind config
- Add Google Fonts: Playfair Display (headings) + DM Sans (body)
- Create reusable components: FoodCard, Badge, Modal, CartPanel, Toast styles
- Add animations: hover zoom on images, card lift, fade-in transitions

### Phase 2: Customer Pages

**Homepage**
- Full-screen hero with Unsplash food background, dark overlay, headline "Taste the Flavors of Nepal", CTAs
- Floating stats bar (4.9★ | 50+ Dishes | 30min Delivery | 1500+ Orders)
- 6 circular category cards (All, Momo, Rice, Curry, Snacks, Drinks)
- Featured dishes grid (4 bestseller cards)
- Special offer banner with discount code `KAUSHI20`

**Menu Page**
- Gradient orange hero bar
- Pill-style search bar with live filtering
- Sticky horizontal category tabs
- Responsive food card grid with item count
- Empty state for no results

**Cart (Slide-in Panel)**
- Right-side slide panel with overlay
- Item thumbnails, quantity controls (+/−), delete
- Subtotal, delivery fee (Free), grand total
- "Proceed to Checkout" button
- Empty cart state

**Checkout Page**
- Left: Delivery form (Name, Phone, Address, Notes) + Payment method (COD, eSewa, Khalti)
- Right (sticky): Order summary with item details + "Place Order" button

**Order Success Page**
- Animated green checkmark
- Order status tracker: Confirmed → Preparing → On the Way (animated dots)
- "Back to Home" button

### Phase 3: Authentication
- Login/Register modal (not page redirect) — triggered by nav button or adding to cart while logged out
- Login tab: Email + Password
- Register tab: Name + Email + Password
- Supabase Auth integration with session persistence
- Nav updates: show user name when logged in

### Phase 4: Database Schema (Supabase)
- **categories** table: name, slug, image_url, sort_order
- **menu_items** table: name, description, price (NPR), category reference, image_url, rating, badge, is_available, is_featured
- **orders** table: order_number, user reference, status, total, address, phone, payment_method, notes
- **order_items** table: order reference, menu_item reference, name/price snapshots, quantity, subtotal
- **profiles** table: linked to auth.users, stores name and phone
- **user_roles** table: separate table for admin role (security best practice)
- Row Level Security on all tables
- Seed data: 6 categories + ~15 menu items with Unsplash food images

### Phase 5: Hidden Admin Dashboard

**Secret Access**
- Click restaurant logo 5 times within 2 seconds → dark admin login modal appears
- Hardcoded admin credentials checked against user_roles table (admin role)
- Successful login loads full-screen admin dashboard

**Admin Layout**: Dark theme (`#0F172A`), fixed sidebar (240px) + scrollable content

**Overview Tab**: 4 stat cards (orders today, revenue, menu items, pending orders) + recent orders table

**Orders Tab**: Filter by status (All/Pending/Preparing/Delivered), order cards with status update buttons

**Menu/Products Tab** ⭐: Add/Edit form panel, products table with image thumbnails, live search, edit/delete actions — changes reflect immediately on customer menu

**Customers Tab**: Table of registered users with order count and total spent

**Settings Tab**: Restaurant info form + admin password change

### Phase 6: Nepal-Specific & Polish
- Currency formatting: Rs. (integer amounts)
- Phone validation: 10-digit format
- "📞 Call Restaurant" button
- Lazy loading on all food images with fallback
- Skeleton loaders
- All micro-interactions (hover zoom, card lift, toast notifications, cart animation)
- Mobile-responsive across all breakpoints

