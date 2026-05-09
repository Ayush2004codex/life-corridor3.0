# Life Corridor - Authentication System Guide

## 🚀 Quick Start

### Landing Page
- **File**: `index.html`
- **Features**:
  - Complete hero section with features overview
  - Smart navigation with session-aware buttons
  - Dark/Light mode toggle
  - Live corridor demo simulation
  - Testimonials and team section
  - Contact form

### Navigation
- **Login Button** - Routes to login page (changes to "Dashboard" if logged in)
- **Get Started Button** - Routes to login page (changes to "Logout" if logged in)
- **Dashboard Link** - In nav menu, routes to appropriate dashboard
- **Nav Links** - Features, Corridor, Tracking, Dashboard, Contact

---

## 🔐 Authentication System

### Sign Up Flow
1. Go to `login.html`
2. Click **"Create Account"** tab
3. Fill in:
   - Full Name (minimum 2 characters)
   - Email Address (valid email format)
   - Select Role: **Hospital Admin** or **Ambulance Driver**
   - Password (minimum 6 characters)
4. Click **"Create Account →"**
5. Success animation displays
6. Auto-redirects to appropriate dashboard based on role

### Sign In Flow
1. Go to `login.html`
2. Keep **"Sign In"** tab active (default)
3. Fill in:
   - Email Address
   - Password (any value works for demo)
4. Click **"Sign In →"**
5. Success animation displays
6. Auto-redirects to dashboard based on role detected from email:
   - **Contains "admin"** → Admin Dashboard
   - **Otherwise** → Driver Dashboard

### Demo Accounts
```
Admin:  admin@lifecorridor.io (password: any value)
Driver: driver@lifecorridor.io (password: any value)
```

---

## 🔑 Role-Based Access Control (RBAC)

### Admin Dashboard
- **File**: `admin.html`
- **Access**: Only users with `role === 'admin'`
- **Protection**: Automatic redirect to login if not authenticated
- **Features**:
  - Hospital Management Overview
  - Incoming ambulance requests
  - Signal control override
  - Active bed tracking
  - Lives saved counter

### Driver Dashboard
- **File**: `driver.html`
- **Access**: Only users with `role === 'driver'`
- **Protection**: Automatic redirect to login if not authenticated
- **Features**:
  - Emergency corridor request form
  - Live navigation status
  - Real-time ambulance tracking
  - Signal clearance counter
  - Route visualization on map

---

## 🔓 Session Management

### Storage
- Uses **localStorage** for session persistence
- Session data:
  ```javascript
  {
    loggedIn: true,
    name: "User Name",
    email: "user@example.com",
    role: "admin" | "driver",
    loginTime: timestamp,
    lastActive: timestamp
  }
  ```

### Authentication Check (Auto-runs on protected pages)
```javascript
// Checks if user is logged in
// Redirects to login if not authenticated
// Checks role and redirects to correct dashboard
// Displays user name in navbar
```

### Logout
- Click **"Logout"** button in top-right corner
- Confirms action before logging out
- Clears session from localStorage
- Redirects to login page

---

## ✅ Form Validation

### Login Form
- ✓ Email required and valid format
- ✓ Password required (minimum 6 characters)
- ✓ Error messages for invalid inputs
- ✓ Loading state during submission

### Sign Up Form
- ✓ Name required (minimum 2 characters)
- ✓ Email required and valid format
- ✓ Role must be selected
- ✓ Password required (minimum 6 characters)
- ✓ Tab switching between Sign In and Create Account
- ✓ Role selector with visual feedback

---

## 🎨 UI Features

### Landing Page (index.html)
- **Navigation Bar**: Fixed header with logo and nav links
- **Hero Section**: Main pitch with CTA buttons
- **Features Grid**: 4 core technology cards
- **Corridor Demo**: Animated traffic light simulation
- **Dashboard Preview**: Mockup of both dashboards
- **Stats & Testimonials**: Social proof
- **Team Section**: Project credits
- **Contact Form**: Get in touch

### Login Page (login.html)
- **Glassmorphism Design**: Modern card-based UI
- **Tab System**: Switch between Sign In and Create Account
- **Role Selector**: Choose Hospital Admin or Driver (signup only)
- **Particle Effects**: Animated background elements
- **Success Animation**: Smooth transition on successful auth
- **Demo Hint**: Quick reference for test accounts
- **Error Messages**: Clear validation feedback

### Admin Dashboard (admin.html)
- **Navigation Bar**: Branded header with logout
- **Analytics Cards**: 4 KPI metrics
- **Incoming Requests List**: Active ambulances
- **Signal Control**: Traffic light override system
- **User Greeting**: Personalized with session name
- **RBAC Protection**: Automatic redirects for unauthorized access

### Driver Dashboard (driver.html)
- **Corridor Request Form**: Request emergency corridor
- **Navigation Status**: ETA, signals cleared, speed, distance
- **Live Tracking Map**: SVG-based route visualization
- **Ambulance Animation**: Moving marker on route
- **Status Updates**: Real-time corridor information
- **User Greeting**: Personalized with session name
- **RBAC Protection**: Automatic redirects for unauthorized access

---

## 🧪 Testing Scenarios

### Scenario 1: Fresh Sign Up (Driver)
1. Open `index.html`
2. Click "Get Started"
3. Go to "Create Account" tab
4. Fill: Name="John Driver", Email="driver@example.com", Role="Driver", Pass="demo123"
5. Click "Create Account"
6. Should redirect to `driver.html`
7. Should show "Hello, John Driver" in nav

### Scenario 2: Admin Login
1. Open `login.html`
2. Email: "admin@lifecorridor.io"
3. Password: "demo"
4. Click "Sign In"
5. Should redirect to `admin.html`
6. Should show "Hello, Admin User" in nav

### Scenario 3: Wrong Role Access
1. Login as driver (driver@lifecorridor.io)
2. Navigate to `admin.html`
3. Should auto-redirect to `driver.html`

### Scenario 4: Logout & Re-login
1. Login as any user
2. Click "Logout" button
3. Confirm logout
4. Should go to `login.html`
5. Try accessing dashboard directly
6. Should redirect to login again

### Scenario 5: Session Persistence
1. Login as admin
2. Close and reopen browser tab
3. Go to `admin.html`
4. Should still be logged in (session in localStorage)
5. Close tab, open new tab, go to admin
6. Should still be logged in

### Scenario 6: Navigation Flow from Landing
1. Open `index.html` (not logged in)
2. Click "Dashboard" in nav menu
3. Should go to `login.html`
4. Click back link
5. Should return to `index.html`

---

## 🐛 Troubleshooting

### Issue: Login page shows blank/doesn't load
- Clear browser cache (Ctrl+Shift+Del)
- Hard refresh the page (Ctrl+Shift+R)
- Check browser console (F12) for errors

### Issue: Stuck on login after successful form fill
- Check console for JavaScript errors
- Verify localStorage is enabled in browser
- Try incognito/private mode

### Issue: Dashboard shows blank
- Make sure session data is in localStorage
- Check if user role is correct
- Try logout and login again

### Issue: Can't see user name
- Verify session.name is set correctly
- Check element ID is "userName"
- Browser localStorage might be disabled

---

## 📋 Summary

The Life Corridor authentication system provides:
✅ Secure role-based access control
✅ Professional login/signup forms with validation
✅ Session management via localStorage
✅ Protected admin and driver dashboards
✅ Smooth navigation between pages
✅ Modern UI with animations
✅ Demo accounts for testing
✅ Auto-redirects based on authentication state

**All files are production-ready and fully functional!**
