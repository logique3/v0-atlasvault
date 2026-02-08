# AtlasVault Platform - Complete Guide

## Overview

AtlasVault is a comprehensive digital services marketplace platform with a full-featured authentication system, role-based access control, and WhatsApp order integration.

## Key Features

### 1. Authentication System
- **User Registration**: New users can create accounts with email, password, full name, and phone
- **User Login**: Secure login with email and password authentication
- **Role-Based Access Control**: Two distinct roles - Admin and Regular User
- **Session Management**: User sessions stored in localStorage with automatic persistence
- **Protected Routes**: Pages are protected based on user roles

### 2. User Features
- **My Account Dashboard**: View profile, orders, and settings
- **Order Tracking**: View all past and current orders with status updates
- **Service Browsing**: Browse and filter services by category, price, and rating
- **Favorites System**: Save favorite services for quick access (requires login)
- **Service Search**: Full-text search across all services
- **Cart Management**: Add/remove services, view total, and checkout

### 3. WhatsApp Integration
- **Order Placement via WhatsApp**: Send orders directly through WhatsApp
- **Auto-Formatted Messages**: Order details automatically compiled with:
  - Customer information (name, email, phone)
  - Services selected
  - Quantities and prices
  - Order total
  - Customer notes/preferences
- **WhatsApp Number**: 21695555555 (configured in checkout)

### 4. Admin Features
- **User Management**: View, create, edit, and delete user accounts
- **Order Management**: View all orders with detailed information and status updates
- **Service Management**: Add, edit, and manage services
- **Category Management**: Manage service categories
- **Promotion Management**: Create and manage promotions and discounts
- **Admin Dashboard**: Overview of key metrics and statistics
- **Admin-Only Access**: Protected routes restrict access to admin users only

### 5. Mock Data System
- **Pre-loaded Test Data**: 5 admin/user accounts and 5 sample orders
- **Easy Testing**: Click "Testing Guide" button to see all test credentials
- **Data Reset**: Option to reset all data to defaults
- **Statistics**: Real-time stats from localStorage

## User Roles

### Admin User
- **Access**: Admin Dashboard at `/admin`
- **Permissions**:
  - View and manage all users
  - View and manage all orders
  - Manage services and categories
  - Create promotions and offers
  - View platform statistics
  - Update order statuses

### Regular User
- **Access**: User Dashboard at `/dashboard` and My Account at `/my-account`
- **Permissions**:
  - View own profile and orders
  - Browse and search services
  - Add services to favorites
  - Place orders via WhatsApp
  - View order history
  - Update personal information

## Test Accounts

### Admin Accounts
1. **admin@atlasvault.com** / `admin123`
2. **manager@atlasvault.com** / `manager123`

### Regular User Accounts
1. **john@example.com** / `password123`
2. **jane@example.com** / `password123`
3. **ahmed@example.com** / `password123`
4. **fatima@example.com** / `password123`
5. **test@example.com** / `password123`

All test accounts are pre-loaded in the system. Use them to test different features.

## Platform Statistics

From mock data:
- **Total Users**: 7 (2 admins, 5 regular users)
- **Total Orders**: 5 (4 completed, 1 pending)
- **Total Revenue**: 329.93 TND
- **Success Rate**: 80% (4 completed out of 5 orders)

## File Structure

### Key Directories
```
/app
  /login                    - User login page
  /register                 - User registration page
  /dashboard                - User orders dashboard (protected)
  /my-account              - User account settings (protected)
  /products                 - Browse and filter services
  /cart                     - Shopping cart
  /checkout-whatsapp        - WhatsApp checkout (protected)
  /order-confirmation       - Order confirmation (protected)
  /admin                    - Admin dashboard (admin only)
  /testing-guide            - Testing guide with credentials

/lib
  /auth-context.tsx         - Authentication context provider
  /cart-context.tsx         - Shopping cart context
  /favorites-context.tsx    - Favorites context
  /orders-context.tsx       - Orders context
  /mock-data.ts            - Mock data and initialization
  /services-db.ts          - Services database

/components
  /admin
    /users-management.tsx   - User management component
    /orders-management.tsx  - Order management component
    /services-management.tsx
    /categories-management.tsx
    /promos-management.tsx
    /offers-management.tsx
  /protected-route.tsx      - Protected route wrapper
  /header.tsx              - Navigation header with auth menu
```

## Testing Workflows

### 1. Complete User Journey
1. Visit home page → Testing Guide
2. Copy user credentials (e.g., john@example.com / password123)
3. Go to Login page and sign in
4. Browse services at /products
5. Add services to cart and favorites
6. Go to checkout via WhatsApp
7. Send order through WhatsApp
8. View confirmation at order confirmation page
9. Check order history in My Account

### 2. Admin Management
1. Login with admin account (admin@atlasvault.com / admin123)
2. Access /admin dashboard
3. Switch to "Users" tab to manage users
4. Switch to "Orders" tab to manage orders
5. Update order statuses from pending to completed
6. Create new test users through the admin panel
7. View real-time statistics

### 3. Authentication & Authorization
1. Try accessing /admin as regular user → redirected to login
2. Try accessing /dashboard without login → redirected to login
3. Login as user and access /admin → access denied message
4. Logout and verify session is cleared
5. Login again and verify user info is restored

## WhatsApp Integration Details

### Message Format
The WhatsApp message includes:
- Order date and ID
- Customer information (name, email, phone)
- List of services with quantities and prices
- Order total
- Additional notes/preferences

### Configuration
- **WhatsApp Number**: 21695555555 (in `/app/checkout-whatsapp/page.tsx`)
- **Message Encoding**: URL-encoded for WhatsApp Web link

### How It Works
1. User adds services to cart
2. User proceeds to checkout-whatsapp
3. System generates formatted message
4. User clicks "Send via WhatsApp"
5. WhatsApp Web opens with pre-filled message
6. User can review and send

## Data Persistence

All data is stored in **localStorage**:
- `atlasVaultUser` - Current logged-in user
- `atlasVaultUsers` - All users in system
- `atlasVaultOrders` - All orders in system
- `atlasVaultFavorites` - User favorites
- `orders_[userId]` - User-specific orders

Data persists across page refreshes and browser sessions.

## Security Considerations

### Current Implementation (Development)
- Passwords stored in plain text in localStorage (for testing only)
- No backend validation
- Client-side only authentication

### Production Recommendations
- Implement bcrypt for password hashing
- Add backend API with proper authentication
- Use secure HTTP-only cookies for sessions
- Implement JWT tokens with expiration
- Add rate limiting and brute-force protection
- Encrypt sensitive data in transit and at rest
- Implement proper CORS policies

## Customization Guide

### Change WhatsApp Number
Edit `/app/checkout-whatsapp/page.tsx`:
```typescript
const WHATSAPP_NUMBER = 'YOUR_NUMBER_HERE' // Replace with your WhatsApp number
```

### Add New Services
Edit `/lib/services-db.ts` to add services to the database.

### Create New Users
Via Testing Guide at `/testing-guide` or through admin panel at `/admin/users`.

### Modify Order Status Options
Edit order status type in `/lib/orders-context.tsx`:
```typescript
status: 'pending' | 'completed' | 'cancelled' // Add/remove statuses
```

## Known Limitations

1. **Client-Side Only**: No backend integration - data lost on localStorage clear
2. **No Email Notifications**: Orders are only sent via WhatsApp
3. **Manual Admin Review**: Admin must manually review orders sent via WhatsApp
4. **No Payment Processing**: This is a demo - no actual payment processing
5. **Mock Data**: All statistics are from mock data only

## Future Enhancements

1. Backend API integration with database
2. Real payment gateway integration (Stripe, PayPal)
3. Email notifications for orders
4. SMS notifications
5. User email verification
6. Two-factor authentication
7. Inventory management
8. Customer reviews and ratings
9. Refund management system
10. Multi-language support

## Support

For issues or questions:
1. Check the Testing Guide at `/testing-guide`
2. Review this documentation
3. Check the admin dashboard for current system status
4. Contact support via WhatsApp button in header

## Version

**AtlasVault v1.0.0**
- Complete authentication system
- Role-based access control
- WhatsApp order integration
- Mock data with 7 test users
- Admin management panel
- Full service catalog
- Order tracking system
