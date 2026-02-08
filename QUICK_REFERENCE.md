# AtlasVault - Quick Reference Guide

## 🚀 Quick Start (30 seconds)

1. **Visit**: `http://localhost:3000/quick-start`
2. **Click**: "Start Now" button under any scenario
3. **Automatically logged in** and redirected to dashboard

## 📋 Demo Accounts

### Admin Accounts
```
Email: admin@atlasvault.com
Password: admin123
Access: Full admin panel, user/order management
```

```
Email: manager@atlasvault.com
Password: manager123
Access: Full admin panel, user/order management
```

### User Accounts (Pick Any)
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

## 🔗 Important Links

### For Testing
- **Demo Accounts**: `/demo-accounts` - View all credentials
- **Quick Start**: `/quick-start` - One-click login
- **Testing Guide**: `/testing-guide` - Detailed scenarios

### Main Features
- **Home**: `/` - Main landing page
- **Products**: `/products` - Browse services
- **Login**: `/login` - User login
- **Register**: `/register` - Create account
- **Dashboard**: `/dashboard` - User orders (login required)
- **My Account**: `/my-account` - Profile & favorites (login required)
- **Cart**: `/cart` - Shopping cart
- **Admin**: `/admin` - Admin panel (admin only)

## ✅ What You Can Test

### As Regular User
- [ ] Login with user credentials
- [ ] Browse products by category
- [ ] Search and filter products
- [ ] Add items to cart
- [ ] Add/remove favorites
- [ ] View order history
- [ ] Send order via WhatsApp
- [ ] Track order status
- [ ] Update profile information
- [ ] View account statistics

### As Admin
- [ ] Login with admin credentials
- [ ] View platform statistics
- [ ] Manage users
- [ ] Manage orders (change status)
- [ ] Manage services
- [ ] View admin dashboard

## 📱 Testing Scenarios

### Scenario 1: Shopping (5 minutes)
1. Go to `/quick-start` → Login as user
2. Browse `/products` → Add items to cart
3. Go to `/cart` → Review order
4. Click "Send Order via WhatsApp"
5. View order confirmation

### Scenario 2: Admin Management (5 minutes)
1. Go to `/quick-start` → Login as admin
2. Navigate to `/admin`
3. Check Users, Orders, and Services tabs
4. View statistics

### Scenario 3: User Profile (3 minutes)
1. Login as user
2. Go to `/dashboard` → View orders & stats
3. Go to `/my-account` → View favorites
4. Update profile information

## 🎯 Key Features

### Authentication
- ✅ Email/password login
- ✅ Register new users
- ✅ Role-based access (admin/user)
- ✅ Protected routes
- ✅ Session persistence

### Shopping
- ✅ Browse 4 categories
- ✅ Search and filter
- ✅ Add to cart
- ✅ Save favorites
- ✅ Quick checkout

### Orders
- ✅ View history
- ✅ Track status
- ✅ WhatsApp integration
- ✅ Order confirmation
- ✅ Detailed information

### Admin
- ✅ View analytics
- ✅ Manage users
- ✅ Manage orders
- ✅ Manage services
- ✅ Manage categories

## 🐛 Common Issues & Solutions

### Issue: Can't login
**Solution**: Use exact credentials from demo accounts. Check spelling.

### Issue: Data not persisting
**Solution**: Clear browser cache or check localStorage in DevTools

### Issue: Can't access admin panel
**Solution**: Must login with admin account (admin@atlasvault.com)

### Issue: WhatsApp button not working
**Solution**: WhatsApp only opens on mobile or with WhatsApp app installed

## 📊 Mock Data Statistics

- **Total Users**: 7 (2 admins, 5 regular)
- **Total Orders**: 12+ sample orders
- **Total Revenue**: ~15,000 TND (across sample orders)
- **Categories**: 4 (The Vault, Telecom Hub, Gaming Corner, Business Suite)
- **Services**: 20+ sample services

## 🔧 Developer Shortcuts

### Reset All Data
1. Go to `/testing-guide`
2. Click "Reset Data" button
3. All mock data resets to original state

### View User Orders
- Login as specific user
- Go to `/dashboard`
- All orders for that user displayed

### Test Admin Features
- Login with `admin@atlasvault.com` / `admin123`
- Go to `/admin`
- Full management panel available

## 📚 Documentation

- **README.md** - Platform overview
- **PLATFORM_GUIDE.md** - Feature guide
- **TESTING_CHECKLIST.md** - 400+ item test checklist
- **IMPLEMENTATION_SUMMARY.md** - Technical details

## 🌐 Features Overview

| Feature | User | Admin |
|---------|------|-------|
| Browse Products | ✅ | ✅ |
| Add to Cart | ✅ | ✅ |
| Favorites | ✅ | ✅ |
| WhatsApp Orders | ✅ | ✅ |
| Order History | ✅ | ✅ |
| Profile Management | ✅ | - |
| View All Users | - | ✅ |
| View All Orders | - | ✅ |
| Manage Services | - | ✅ |
| View Analytics | - | ✅ |

## 🔐 Security Notes

**This is a demo platform.** For production:
- Use secure backend authentication
- Hash passwords with bcrypt
- Enable HTTPS
- Implement rate limiting
- Add CSRF protection

## 💡 Pro Tips

1. **Multi-Tab Testing**: Open multiple browser tabs to test different accounts
2. **DevTools**: Use DevTools → Application → localStorage to see stored data
3. **Mobile Testing**: Use DevTools → Responsive Design Mode
4. **Copy Credentials**: Use copy buttons on `/demo-accounts` page
5. **Quick Login**: Always go to `/quick-start` for fastest testing

## 🎬 Full Test Flow (15 minutes)

1. **Start** (`2 min`)
   - Go to `/quick-start`
   - Click "Start Now" for user
   - Automatically logged in

2. **Browse** (`3 min`)
   - Navigate to `/products`
   - Browse by category
   - Search for items
   - View product details

3. **Shop** (`3 min`)
   - Add 3-4 items to cart
   - Add one item to favorites
   - Navigate to `/cart`
   - Review order

4. **Checkout** (`2 min`)
   - Click checkout
   - Fill delivery info
   - Send via WhatsApp
   - View confirmation

5. **Profile** (`3 min`)
   - Go to `/dashboard`
   - View order history
   - Check statistics
   - Go to `/my-account`
   - View favorites

6. **Admin** (`2 min`)
   - Logout
   - Go to `/quick-start`
   - Click "Start Now" for admin
   - Explore `/admin` panel

## 📞 Support

For issues or questions:
1. Check `/testing-guide` for detailed info
2. Review `TESTING_CHECKLIST.md` for comprehensive tests
3. Check demo account permissions in `QUICK_REFERENCE.md`
4. Contact via WhatsApp support link in footer

---

**Version**: 1.0.0  
**Last Updated**: February 2025  
**Status**: Ready for Testing ✅
