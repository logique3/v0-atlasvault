# AtlasVault - Digital Services Marketplace

A comprehensive web platform for digital services with secure authentication, role-based access control, and WhatsApp order integration.

## Overview

AtlasVault is a modern marketplace platform that enables users to browse, purchase, and track digital services including streaming subscriptions, telecom services, gaming credits, and business tools. The platform features dual-role authentication (Admin & User), real-time order management, and WhatsApp integration for seamless ordering.

## Features

### User Features
- **Secure Authentication** - Email/password login with role-based access control
- **Service Browsing** - Browse services by category with filtering and search
- **Shopping Cart** - Add/remove items and manage quantities
- **Favorites** - Save favorite services for quick access
- **Order Management** - View order history and track status
- **WhatsApp Orders** - Send orders directly via WhatsApp with formatted messages
- **User Dashboard** - View profile, orders, and account statistics
- **Order Confirmation** - Detailed order confirmation pages with payment details

### Admin Features
- **Admin Dashboard** - View platform statistics and analytics
- **User Management** - Manage user accounts and roles
- **Order Management** - View all orders, update status, and manage fulfillment
- **Service Management** - Add, edit, and delete digital services
- **Category Management** - Organize services into categories
- **Promotions** - Create and manage promotional offers
- **Analytics** - Revenue tracking and platform metrics

### Technical Features
- **Role-Based Access Control (RBAC)** - Secure access levels for admin and user roles
- **Protected Routes** - Client-side and server-side protection for sensitive pages
- **Local Storage Persistence** - Data persists across browser sessions
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **WhatsApp Integration** - Automatic order message formatting and sending
- **Mock Data System** - Pre-loaded test data for easy testing

## Quick Start

### Access the Platform

Visit the home page and choose one of these options:
1. **Quick Start** - One-click login with demo accounts
2. **Demo Accounts** - View all test credentials
3. **Testing Guide** - Detailed testing scenarios

### Demo Accounts

#### Admin Accounts
```
Email: admin@atlasvault.com
Password: admin123

Email: manager@atlasvault.com
Password: manager123
```

#### User Accounts
```
Email: john@example.com
Password: password123

Email: jane@example.com
Password: password123

Email: ahmed@example.com
Password: password123

Email: fatima@example.com
Password: password123

Email: test@example.com
Password: password123
```

## Testing Scenarios

### Scenario 1: User Shopping Experience
1. Login as a regular user
2. Browse products by category
3. Add items to cart
4. Add services to favorites
5. Send order via WhatsApp
6. View order confirmation
7. Check order history in dashboard

### Scenario 2: Admin Management
1. Login with admin account
2. Access admin dashboard
3. View user list and statistics
4. Manage all orders in the system
5. Edit service information
6. Manage service categories
7. View platform analytics

### Scenario 3: Order Tracking
1. Login as user with existing orders
2. Navigate to dashboard
3. View order history with filters
4. Click on order for detailed view
5. Track order status

## Platform Pages

### Public Pages
- `/` - Home page with category overview
- `/products` - Service catalog with filtering
- `/login` - User login page
- `/register` - User registration page
- `/demo-accounts` - Demo account credentials
- `/quick-start` - Quick start guide
- `/testing-guide` - Detailed testing guide

### Protected User Pages
- `/dashboard` - User dashboard with orders
- `/my-account` - User profile and settings
- `/cart` - Shopping cart page
- `/checkout-whatsapp` - WhatsApp checkout
- `/order-confirmation/[orderId]` - Order confirmation page

### Protected Admin Pages
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/orders` - Order management
- `/admin/products` - Product/Service management

## Project Structure

```
/app
  /admin                 # Admin pages
  /checkout-whatsapp     # WhatsApp checkout
  /dashboard             # User dashboard
  /demo-accounts         # Demo accounts page
  /login                 # Login page
  /my-account            # User profile
  /order-confirmation    # Order confirmation
  /products              # Product catalog
  /quick-start           # Quick start guide
  /testing-guide         # Testing guide

/components
  /admin                 # Admin components
  /ui                    # UI components
  header.tsx             # Header component
  protected-route.tsx    # Protected route wrapper

/lib
  auth-context.tsx       # Authentication context
  cart-context.tsx       # Shopping cart context
  favorites-context.tsx  # Favorites context
  orders-context.tsx     # Orders context
  mock-data.ts           # Mock data initialization
  services-db.ts         # Services database
```

## Key Features Explained

### Authentication System
- Uses React Context for state management
- Credentials stored in localStorage
- Mock data includes 2 admin and 5 user accounts
- Password validation and login error handling

### Role-Based Access Control
- Two roles: `admin` and `user`
- Protected routes check user role
- Admin-only pages redirect unauthorized users
- Persistent role assignment across sessions

### WhatsApp Integration
- Automatic order message formatting
- Sends to configured WhatsApp number
- Includes all order details and customer info
- Uses WhatsApp Business API format

### Mock Data System
- Pre-loaded users with orders
- Sample services across 4 categories
- Mock orders with various statuses
- Platform statistics and analytics

## Testing Tips

1. **Multi-Tab Testing** - Open multiple browser tabs to test different accounts simultaneously
2. **Clear Data** - Use "Reset Data" button in testing guide to reset mock data
3. **Order Testing** - Check the order history in different user accounts to see varied data
4. **Admin Features** - Login as admin to test management panels
5. **Mobile Testing** - Test on mobile devices or use browser DevTools responsive mode

## Customization Guide

### Adding New Demo Accounts
1. Edit `/lib/mock-data.ts`
2. Add to `MOCK_USERS` or `MOCK_ADMINS` array
3. Include: id, email, password, fullName, phone, role

### Creating New Services
1. Edit `/lib/services-db.ts`
2. Add service to appropriate category
3. Include: name, description, price, rating

### Modifying WhatsApp Number
1. Find WhatsApp components in codebase
2. Replace phone number: `+216 95 555 5555`
3. Update in header, footer, and WhatsApp widget

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Notes

**This is a demo/testing platform. For production:**
- Use secure backend authentication (JWT, OAuth, etc.)
- Hash passwords with bcrypt
- Implement HTTPS only
- Use secure cookies with HttpOnly flag
- Implement rate limiting
- Add CSRF protection

## Support

For testing issues or questions:
1. Check the Testing Guide page
2. Review Demo Accounts for credentials
3. Use Quick Start for one-click testing
4. Contact via WhatsApp support link

## License

This is a demo platform for testing and development purposes.

## Version

Current Version: 1.0.0
Last Updated: February 2025
