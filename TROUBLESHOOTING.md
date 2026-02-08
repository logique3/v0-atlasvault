# AtlasVault - Troubleshooting Guide

## Common Issues & Solutions

### 1. "Invalid email or password" Error

**Problem:** Demo accounts aren't working, login fails with "Invalid email or password"

**Solution:**
1. Visit `/verify-setup` to check if demo data is initialized
2. If users count is 0, click "Refresh Status" to initialize
3. Clear browser localStorage:
   - Open DevTools (F12)
   - Go to Application → Local Storage
   - Delete `atlasVaultUsers`, `atlasVaultOrders`, `atlasVaultUser`
   - Refresh page
4. Try logging in again with correct credentials:
   - **Admin:** admin@atlasvault.com / admin123
   - **User:** john@example.com / password123

### 2. Demo Accounts Not Showing Up

**Problem:** Can't find demo account emails in localStorage

**Solution:**
```javascript
// Open browser console and run:
localStorage.removeItem('atlasVaultUsers')
localStorage.removeItem('atlasVaultOrders')
localStorage.removeItem('atlasVaultUser')
location.reload()
```

Then visit `/verify-setup` - data will be reinitialized.

### 3. Login Works But Dashboard Shows Nothing

**Problem:** User logs in successfully but dashboard is empty

**Solution:**
1. This is normal for new user accounts without orders
2. Try logging in with `john@example.com` (has sample orders)
3. Or visit `/demo-accounts` to get pre-populated test users

### 4. Admin Dashboard Not Accessible

**Problem:** Can't access `/admin` or it shows "Unauthorized"

**Solution:**
1. Make sure logged in with admin account:
   - Email: `admin@atlasvault.com`
   - Password: `admin123`
2. Check role in localStorage:
   ```javascript
   // In browser console:
   const user = JSON.parse(localStorage.getItem('atlasVaultUser'))
   console.log('User role:', user?.role)
   ```
3. Role should be `'admin'` not `'user'`

### 5. Cart Not Persisting After Refresh

**Problem:** Items added to cart disappear after page refresh

**Solution:**
1. Check localStorage for cart data:
   ```javascript
   console.log(JSON.parse(localStorage.getItem('cart')))
   ```
2. If empty, check browser settings - localStorage might be disabled
3. Try adding item to cart again and immediately check console

### 6. WhatsApp Integration Not Working

**Problem:** WhatsApp checkout button doesn't open WhatsApp

**Solution:**
1. WhatsApp integration is client-side only - it creates a link to WhatsApp
2. To test on desktop: Open in WhatsApp Web or use mobile device
3. Ensure you have WhatsApp installed/account set up
4. The WhatsApp number is: **+21695555555** (set in code)
5. To change WhatsApp number:
   - Edit `/app/checkout-whatsapp/page.tsx`
   - Find `wa.me/21695555555`
   - Replace with your number

### 7. Orders Not Showing in Dashboard

**Problem:** User dashboard shows 0 orders but data exists

**Solution:**
1. Verify user ID matches in orders:
   ```javascript
   // Check user ID
   const user = JSON.parse(localStorage.getItem('atlasVaultUser'))
   console.log('Current user ID:', user.id)
   
   // Check orders
   const orders = JSON.parse(localStorage.getItem('atlasVaultOrders') || '[]')
   console.log('Total orders:', orders.length)
   console.log('Orders for current user:', orders.filter(o => o.userId === user.id))
   ```
2. If no match, user doesn't have associated orders
3. Try with pre-populated user: `john@example.com`

### 8. Favorites Not Saving

**Problem:** Added items to favorites but they disappear

**Solution:**
1. Favorites are user-specific - must be logged in
2. Check if logged in: `localStorage.getItem('atlasVaultUser')`
3. Check favorites storage:
   ```javascript
   const user = JSON.parse(localStorage.getItem('atlasVaultUser'))
   const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`))
   console.log('Favorites:', favorites)
   ```

### 9. Pages Showing "Unauthorized" or Redirecting to Login

**Problem:** Keep getting redirected to login even after signing in

**Solution:**
1. Check if auth session persisted:
   ```javascript
   console.log('Stored user:', localStorage.getItem('atlasVaultUser'))
   ```
2. If empty, session was lost - login again
3. Check browser settings - localStorage must be enabled
4. Ensure cookies/storage not being cleared on browser close

### 10. "initializeMockData is not a function" Error

**Problem:** Console shows import/function error

**Solution:**
1. Clear browser cache: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. Hard refresh page: Ctrl+F5 (or Cmd+Shift+R on Mac)
3. Check that `/lib/mock-data.ts` file exists
4. Verify function is exported: `export function initializeMockData()`

## Quick Diagnostic Steps

1. **Check Setup Status**
   - Visit `/verify-setup`
   - See all initialized data
   - Run "Refresh Status" button

2. **Check localStorage Contents**
   ```javascript
   // In browser console:
   console.log('Users:', JSON.parse(localStorage.getItem('atlasVaultUsers') || '[]').length)
   console.log('Orders:', JSON.parse(localStorage.getItem('atlasVaultOrders') || '[]').length)
   console.log('Current User:', localStorage.getItem('atlasVaultUser'))
   ```

3. **Reset Everything**
   - Visit `/verify-setup`
   - Click "Reset All Data" button
   - This clears and reinitializes everything

4. **Check Network/Console Errors**
   - Open DevTools: F12
   - Go to Console tab
   - Look for red error messages
   - Check Network tab for failed requests

## Testing Checklist

- [ ] `/verify-setup` shows users and orders initialized
- [ ] Can login with admin@atlasvault.com / admin123
- [ ] Can login with john@example.com / password123
- [ ] Admin can access `/admin` dashboard
- [ ] Regular user can access `/dashboard`
- [ ] Can add items to cart
- [ ] Can add items to favorites
- [ ] Can view order history
- [ ] WhatsApp checkout button works
- [ ] Product filtering/search works

## Still Having Issues?

1. **Clear Everything and Start Fresh**
   ```javascript
   // In browser console:
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

2. **Try Different Demo Account**
   - Visit `/demo-accounts`
   - Try different email/password combination
   - Check all accounts are listed

3. **Check Browser Support**
   - Use modern browser: Chrome, Firefox, Safari, Edge
   - Ensure JavaScript is enabled
   - Ensure cookies/storage enabled

4. **Review Documentation**
   - See `README.md` for setup
   - See `QUICK_REFERENCE.md` for common tasks
   - See `TESTING_CHECKLIST.md` for test scenarios

## Tips for Testing

### Testing Login
1. Go to `/login`
2. Try different credentials from `/demo-accounts`
3. Test with invalid credentials - should show error
4. Test with empty fields - should show validation error

### Testing Admin Features
1. Login with admin account
2. Visit `/admin`
3. Try managing users, orders, services
4. Check that changes persist after refresh

### Testing User Features
1. Login with regular user
2. Visit `/products` - browse services
3. Visit `/dashboard` - view profile and orders
4. Visit `/cart` - manage shopping cart
5. Visit `/checkout-whatsapp` - test order submission

### Testing Mobile Responsiveness
1. Open DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes
4. Verify navigation works on mobile

## Getting Help

- Check `/testing-guide` for detailed testing scenarios
- Review `/quick-start` for guided walkthroughs
- See `/demo-accounts` for all available test credentials
- Visit `COMPLETION_REPORT.md` for feature overview
