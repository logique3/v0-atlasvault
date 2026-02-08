# Login Issue Resolution Guide

## Overview
This guide provides comprehensive troubleshooting steps for authentication issues in AtlasVault. If you're experiencing "Invalid email or password" errors despite using correct credentials, follow the steps below.

## Quick Diagnosis

### Step 1: Visit Auth Diagnostics Page
Navigate to `/auth-diagnostics` to quickly verify your authentication setup.

**What you should see:**
- System Status: OK (green checkmark)
- Total Users: 7 (2 admins + 5 regular users)
- All localStorage indicators showing green checkmarks

**If you see errors:**
- Click "Refresh Status" button
- If users count is still 0, click "Reset Data"
- Refresh the page

### Step 2: Copy Verified Credentials
The diagnostics page displays all working accounts with copy buttons:

**Admin Accounts:**
- Email: `admin@atlasvault.com` | Password: `admin123`
- Email: `manager@atlasvault.com` | Password: `manager123`

**User Accounts:**
- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`
- Email: `ahmed@example.com` | Password: `password123`
- Email: `fatima@example.com` | Password: `password123`
- Email: `test@example.com` | Password: `password123`

### Step 3: Test Login
1. Click "Test Login" tab in diagnostics page
2. Select an account or enter credentials manually
3. Click "Test Credentials"
4. You should see "Login Successful" message

## Root Causes & Solutions

### Issue 1: localStorage Data Not Initialized

**Symptoms:**
- Auth diagnostics shows "Total Users: 0"
- "System Status: Issue Detected"

**Solutions:**
1. Click "Refresh Status" in diagnostics page
2. If still 0 users, click "Reset Data"
3. Refresh the page

**Technical Details:**
- Mock data initializes automatically on first app load
- If initialization fails, data won't be available in localStorage
- The reset function clears and reinitializes all demo data

---

### Issue 2: Whitespace in Email/Password

**Symptoms:**
- Credentials are correct but login fails
- Works when typed differently

**Solutions:**
- Ensure no leading/trailing spaces in email or password
- Copy credentials from diagnostics page (avoids manual typing errors)
- Auth context automatically trims and lowercases email

**Technical Details:**
- Auth system normalizes: `email.trim().toLowerCase()`
- Password is trimmed: `password.trim()`
- This prevents "admin@atlasvault.com " vs "admin@atlasvault.com" issues

---

### Issue 3: Browser Cache/localStorage Corruption

**Symptoms:**
- Used to work, suddenly stopped
- Other apps in same browser work fine
- Console shows strange error messages

**Solutions:**

**Option A: Soft Reset**
1. Go to `/auth-diagnostics`
2. Click "Reset Data" button
3. Confirm the prompt
4. Page reloads with fresh data
5. Try login again

**Option B: Hard Reset (Full Browser Clear)**
1. Open DevTools (F12)
2. Go to Application → Storage → Local Storage
3. Find `https://[your-domain]`
4. Delete all entries starting with `atlasVault*`
5. Refresh the page
6. Go to `/auth-diagnostics`
7. Click "Reset Data"

**Option C: Incognito/Private Mode Test**
1. Open browser's private/incognito window
2. Navigate to login page
3. Try login with known credentials
4. If it works in incognito, clear main browser cache:
   - DevTools → Application → Clear site data
   - Close and reopen browser

---

### Issue 4: JavaScript Disabled or Context Provider Missing

**Symptoms:**
- Login button doesn't respond
- No error message appears
- Form doesn't submit

**Solutions:**

**Check JavaScript:**
1. Open DevTools (F12)
2. Go to Console tab
3. Type: `typeof localStorage` and press Enter
4. Should return "object"
5. If error, JavaScript is disabled

**Check Auth Provider:**
1. Verify AuthProvider is in `app/layout.tsx`
2. Check that login page imports `useAuth` from `lib/auth-context`
3. Ensure no TypeScript errors in console

---

### Issue 5: Stale Session State

**Symptoms:**
- Login appears to work but doesn't redirect
- No dashboard access even after successful login
- Session stays in loading state

**Solutions:**

1. Hard reload page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check DevTools Console for errors with `[v0]` prefix
3. Verify redirect logic in login page works:
   - After successful login, should redirect to `/dashboard`
4. Check if `/dashboard` is protected correctly

---

## Advanced Debugging

### Enable Console Logging

All authentication actions log with `[v0]` prefix for easy identification:

**Open DevTools Console (F12) and look for:**
- `[v0] LOGIN: Starting login process`
- `[v0] LOGIN: Trimmed credentials - email: ...`
- `[v0] LOGIN: Retrieved users count: 7`
- `[v0] LOGIN: Available user emails: [...]`
- `[v0] LOGIN: Email match found for ...`
- `[v0] LOGIN: User authenticated: ... Role: ...`
- `[v0] LOGIN: Session saved, user authenticated`

**Error logs show:**
- `[v0] LOGIN: No matching user found`
- `[v0] LOGIN: Error occurred: ...`

### Manual Authentication Test

In browser console, run:
```javascript
// Step 1: Initialize data
const {initializeMockData} = await import('/lib/mock-data.ts');
initializeMockData();

// Step 2: Get users
const users = JSON.parse(localStorage.getItem('atlasVaultUsers') || '[]');
console.log('Users found:', users.length);
console.log('User emails:', users.map(u => u.email));

// Step 3: Test credential matching
const email = 'admin@atlasvault.com'.trim().toLowerCase();
const password = 'admin123'.trim();
const found = users.find(u => 
  u.email.trim().toLowerCase() === email && 
  u.password.trim() === password
);
console.log('User found:', found ? found.fullName : 'NOT FOUND');
```

### localStorage Inspection

In DevTools → Application → Storage → Local Storage:

**Check these keys exist:**
- `atlasVaultUsers` - Should contain JSON array of 7 users
- `atlasVaultOrders` - Should contain JSON array of orders
- `atlasVaultUser` - Only exists when logged in

**To check content:**
```javascript
// In console
console.log(JSON.parse(localStorage.getItem('atlasVaultUsers')));
console.log(JSON.parse(localStorage.getItem('atlasVaultOrders')));
```

---

## Testing Workflow

### Complete Test Sequence

1. **Navigate to Diagnostics**
   - Go to `/auth-diagnostics`
   - Verify "System Status: OK"
   - Note total users count

2. **Verify User Data**
   - Click "Users List" tab
   - Confirm 2 admin accounts visible
   - Confirm 5 user accounts visible
   - Click "Show Passwords" toggle
   - Copy any credential pair

3. **Test Credentials**
   - Click "Test Login" tab
   - Paste copied credentials
   - Click "Test Credentials"
   - See "Login Successful" message

4. **Attempt Actual Login**
   - Click "Go to Login" button
   - Enter same credentials
   - Click "Sign In"
   - Should redirect to dashboard

5. **Verify Session**
   - See welcome message with your name
   - Can access all user features
   - Can see profile information

---

## Common Error Messages & Fixes

| Error Message | Cause | Fix |
|---|---|---|
| "Invalid email or password" | User not found or password mismatch | Use verified credentials from diagnostics |
| "Email and password are required" | Empty form submission | Fill both email and password fields |
| "User already exists with this email" | Trying to register with existing email | Use login page instead or register with new email |
| "Password must be at least 6 characters" | Password too short during registration | Use password with 6+ characters |
| Page doesn't redirect after login | JavaScript issue or redirect blocked | Hard refresh page, check console errors |
| "Cannot read property of null" in console | Auth context not initialized | Verify AuthProvider in layout.tsx |

---

## When to Use Each Tool

| Tool | Purpose | When to Use |
|---|---|---|
| `/auth-diagnostics` | Verify setup, test credentials, view all users | First troubleshooting step |
| `/demo-accounts` | View demo credentials with copy buttons | Need to copy credentials |
| `/quick-start` | One-click login to any demo account | Quick access for testing |
| DevTools Console | See debug logs and error details | Advanced troubleshooting |
| `/verify-setup` | Check initialization status | Verify mock data loaded |
| Reset Data button | Clear and reinitialize all data | Data corruption suspected |

---

## Production Notes

**These debugging features (diagnostics, reset, etc.) are for development only.**

For production deployment:
1. Remove or disable diagnostics pages
2. Implement real authentication backend
3. Use secure session tokens
4. Hash passwords with bcrypt
5. Enable HTTPS only
6. Implement rate limiting
7. Add email verification
8. Enable 2FA for admins

---

## Need More Help?

1. **Check Console First**: Open DevTools (F12) and look for `[v0]` prefixed messages
2. **Run Diagnostics**: Visit `/auth-diagnostics` page
3. **Reset Data**: Click "Reset Data" button if data seems corrupted
4. **Check Network**: Verify no CORS or network errors in Network tab
5. **Try Incognito**: Test in private window to rule out cache issues
6. **Restart Browser**: Close completely and reopen

---

## Architecture Overview

```
Login Flow:
┌─────────────────┐
│  Login Page     │ (/login)
│  - Form input   │
│  - Submit       │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ Auth Context        │ (lib/auth-context.tsx)
│ - login()           │
│ - Validate input    │
│ - Normalize email   │
│ - Check localStorage│
└────────┬────────────┘
         │
         ▼
┌──────────────────────┐
│ localStorage         │
│ atlasVaultUsers     │
│ [users array]       │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Find User Match      │
│ - Email compare      │
│ - Password compare   │
└────────┬─────────────┘
         │
         ├─ Found ──────────┐
         │                  ▼
         │         ┌─────────────────┐
         │         │ Save Session    │
         │         │ - Set user state│
         │         │ - Save to LS    │
         │         │ - Redirect      │
         │         └─────────────────┘
         │
         └─ Not Found ──────────┐
                                ▼
                        ┌─────────────────┐
                        │ Show Error      │
                        │ "Invalid email" │
                        └─────────────────┘
```

---

## Checklist for Troubleshooting

- [ ] Opened `/auth-diagnostics` page
- [ ] Verified "System Status: OK"
- [ ] Confirmed user count is 7
- [ ] Tested credentials in diagnostics
- [ ] Saw "Login Successful" message
- [ ] Used verified credentials for actual login
- [ ] Checked browser console for `[v0]` logs
- [ ] Tried hard refresh (Ctrl+Shift+R)
- [ ] Attempted incognito/private mode
- [ ] Clicked "Reset Data" if needed
- [ ] Cleared browser cache/localStorage if needed

If all boxes checked and still having issues, please provide console logs with `[v0]` prefix for detailed support.
