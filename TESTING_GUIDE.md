# Life Corridor - Testing & Verification Guide

## 🚀 Quick Start

### Step 1: Open the Landing Page
```
File: index.html
Action: Open in web browser (double-click or right-click → Open with browser)
Expected: See full landing page with hero section, features, and navigation
```

### Step 2: Test Navigation
```
Landing Page Actions:
- Click "Features" → Smooth scroll to features section ✓
- Click "Corridor" → Smooth scroll to corridor demo ✓
- Click "Tracking" → Smooth scroll to dashboard preview ✓
- Click "Contact" → Smooth scroll to contact form ✓
- Click Logo → Scroll to top ✓
- Toggle Mode Button (☀️) → Switch dark/light mode ✓
- Click "Get Started" button → Go to login.html ✓
```

---

## 🔐 Authentication Testing

### Test Case 1: Sign Up as Driver

**Steps:**
1. Open `login.html`
2. Click "Create Account" tab
3. Fill form:
   - Name: `John Doe`
   - Email: `driver@example.com`
   - Role: Select "Ambulance Driver" (🚑 icon)
   - Password: `demo123`
4. Click "Create Account →"

**Expected Results:**
- ✓ Form validates all fields
- ✓ Button shows "Creating account..." loading state
- ✓ Success overlay appears with checkmark
- ✓ Text shows "Welcome, John Doe!"
- ✓ Subtitle shows "Redirecting to Driver Dashboard..."
- ✓ After 1.8 seconds, redirects to `driver.html`
- ✓ Top navbar shows "Hello, John Doe"
- ✓ All dashboard features visible

**Verify Session:**
- Open Developer Tools (F12)
- Go to Application → LocalStorage
- Find `lc_session` key
- Should show:
  ```json
  {
    "loggedIn": true,
    "name": "John Doe",
    "email": "driver@example.com",
    "role": "driver",
    "loginTime": 1234567890,
    "lastActive": 1234567890
  }
  ```

---

### Test Case 2: Sign Up as Admin

**Steps:**
1. Open `login.html` fresh
2. Click "Create Account" tab
3. Fill form:
   - Name: `Jane Admin`
   - Email: `admin@hospital.com`
   - Role: Select "Hospital Admin" (🏥 icon)
   - Password: `secure456`
4. Click "Create Account →"

**Expected Results:**
- ✓ Role selector highlights hospital admin
- ✓ Success animation plays
- ✓ Text shows "Welcome, Jane Admin!"
- ✓ Redirects to `admin.html` (different from driver)
- ✓ Dashboard shows hospital management content
- ✓ Top navbar shows "Hello, Jane Admin"
- ✓ See incoming ambulances and signal controls

---

### Test Case 3: Sign In with Demo Account

**Steps:**
1. Open `login.html`
2. Keep "Sign In" tab active
3. Fill form:
   - Email: `admin@lifecorridor.io`
   - Password: `anypassword`
4. Click "Sign In →"

**Expected Results:**
- ✓ Form validates email and password
- ✓ Button shows "Signing in..." loading state
- ✓ Success overlay appears
- ✓ Text shows "Welcome, Admin User!"
- ✓ Redirects to `admin.html` (because email contains "admin")
- ✓ All admin dashboard features visible

---

### Test Case 4: Sign In as Driver

**Steps:**
1. Open `login.html`
2. Keep "Sign In" tab active
3. Fill form:
   - Email: `driver@lifecorridor.io`
   - Password: `test`
4. Click "Sign In →"

**Expected Results:**
- ✓ Success overlay appears
- ✓ Text shows "Welcome, Driver User!"
- ✓ Redirects to `driver.html` (because email contains "driver")
- ✓ Ambulance dashboard loads with corridor request form

---

## ✅ Validation Testing

### Test Case 5: Form Validation - Empty Fields

**Steps:**
1. Open `login.html`
2. Click "Sign In →" button **without filling form**

**Expected Results:**
- ✓ Error message: "Please enter your email address."
- ✓ Error box has red background
- ✓ Shake animation plays
- ✓ Button returns to normal state

**Steps:**
1. Enter email: `test@test.com`
2. Click "Sign In →" **without password**

**Expected Results:**
- ✓ Error message: "Please enter your password."

---

### Test Case 6: Invalid Email Format

**Steps:**
1. Open `login.html`
2. Email: `notanemail`
3. Password: `test123`
4. Click "Sign In →"

**Expected Results:**
- ✓ Error message: "Please enter a valid email address."
- ✓ Form doesn't submit
- ✓ Shake animation plays

---

### Test Case 7: Password Too Short

**Steps:**
1. Open `login.html`
2. Email: `test@example.com`
3. Password: `abc`
4. Click "Sign In →"

**Expected Results:**
- ✓ Error message: "Password must be at least 6 characters."

---

### Test Case 8: Sign Up - Name Too Short

**Steps:**
1. Open `login.html`
2. Click "Create Account" tab
3. Name: `J` (only 1 character)
4. Fill other fields
5. Click "Create Account →"

**Expected Results:**
- ✓ Error message: "Name must be at least 2 characters."

---

### Test Case 9: Sign Up - Invalid Email

**Steps:**
1. Open `login.html`
2. Click "Create Account" tab
3. Email: `invalidemail` (no @)
4. Fill other fields
5. Click "Create Account →"

**Expected Results:**
- ✓ Error message: "Please enter a valid email address."

---

## 🔄 Navigation & Routing Testing

### Test Case 10: Back Link from Login

**Steps:**
1. Open `login.html`
2. Click "Back to Home" link (top left)

**Expected Results:**
- ✓ Returns to `index.html`
- ✓ Smooth navigation

---

### Test Case 11: Dashboard from Landing (Not Logged In)

**Steps:**
1. Open `index.html` (logged out)
2. Click "Dashboard" in navbar

**Expected Results:**
- ✓ Redirects to `login.html`
- ✓ Can't access dashboard without login

---

### Test Case 12: Try Direct Dashboard Access (Not Logged In)

**Steps:**
1. Clear browser localStorage (DevTools → Application → LocalStorage → Delete)
2. Directly navigate to `admin.html` in address bar

**Expected Results:**
- ✓ Auto-redirects to `login.html`
- ✓ Can't access dashboard without session

---

## 👥 Role-Based Access Control Testing

### Test Case 13: Driver Accessing Admin Dashboard

**Steps:**
1. Login as driver (`driver@lifecorridor.io`)
2. Verify in `driver.html`
3. Manually navigate to `admin.html` in address bar

**Expected Results:**
- ✓ Auto-redirects to `driver.html`
- ✓ Driver can't access admin dashboard
- ✓ RBAC protection works

---

### Test Case 14: Admin Accessing Driver Dashboard

**Steps:**
1. Login as admin (`admin@lifecorridor.io`)
2. Verify in `admin.html`
3. Manually navigate to `driver.html` in address bar

**Expected Results:**
- ✓ Auto-redirects to `admin.html`
- ✓ Admin can't access driver dashboard
- ✓ RBAC protection works

---

## 🚪 Logout Testing

### Test Case 15: Logout from Admin Dashboard

**Steps:**
1. Login as admin
2. Click "Logout" button (top right)

**Expected Results:**
- ✓ Confirmation dialog appears: "Are you sure you want to log out?"
- ✓ Click "OK"
- ✓ Session cleared from localStorage
- ✓ Redirects to `login.html`

**Verify:**
- Try accessing `admin.html` directly
- Should redirect to `login.html`

---

### Test Case 16: Logout from Driver Dashboard

**Steps:**
1. Login as driver
2. Click "Logout" button (top right)
3. Confirm logout

**Expected Results:**
- ✓ Session cleared
- ✓ Redirects to `login.html`
- ✓ Try accessing `driver.html` → redirects to login

---

## 💾 Session Persistence Testing

### Test Case 17: Persistent Session After Page Refresh

**Steps:**
1. Login as admin
2. Verify in `admin.html`
3. Press F5 (refresh page)

**Expected Results:**
- ✓ Still logged in as admin
- ✓ Session persists from localStorage
- ✓ User name still visible
- ✓ Dashboard content loads

---

### Test Case 18: New Tab with Existing Session

**Steps:**
1. Login as driver in Tab 1
2. Open Tab 2
3. Navigate to `admin.html` in Tab 2

**Expected Results:**
- ✓ Tab 2 sees the driver session
- ✓ Auto-redirects from admin to driver
- ✓ Sessions share localStorage

---

### Test Case 19: Session Across Browser Restart

**Steps:**
1. Login as admin
2. Close browser completely
3. Reopen browser
4. Navigate to `admin.html`

**Expected Results:**
- ✓ Still logged in (localStorage persists)
- ✓ Can access admin dashboard
- ✓ User name visible

---

## 🎨 UI/UX Testing

### Test Case 20: Dark/Light Mode Toggle

**Steps:**
1. Open `index.html`
2. Click sun icon (☀️) in top right

**Expected Results:**
- ✓ Toggle switches to light mode
- ✓ Background becomes lighter
- ✓ Text becomes darker
- ✓ Icon changes to moon (🌙)
- ✓ Click again → back to dark mode

---

### Test Case 21: Responsive Design - Mobile

**Steps:**
1. Open `index.html`
2. Press F12 (DevTools)
3. Click device icon (Toggle device toolbar)
4. Select iPhone 12 Pro

**Expected Results:**
- ✓ Navigation menu hides
- ✓ Buttons stack vertically
- ✓ Text scales properly
- ✓ All content readable
- ✓ No horizontal scroll

---

### Test Case 22: Enter Key Form Submission

**Steps:**
1. Open `login.html`
2. Fill email and password
3. Press Enter key (instead of clicking button)

**Expected Results:**
- ✓ Form submits successfully
- ✓ Success animation plays
- ✓ Redirects to appropriate dashboard

---

## 🎯 Dashboard Features Testing

### Test Case 23: Admin Dashboard - Signal Control

**Steps:**
1. Login as admin
2. Look at Signal Control section (right side)
3. Click "⚡ Override All Green" button

**Expected Results:**
- ✓ Button click registers
- ✓ Signal dots should change state
- ✓ Visual feedback provided

---

### Test Case 24: Driver Dashboard - Corridor Activation

**Steps:**
1. Login as driver
2. Fill corridor form:
   - Pickup: Current Location (auto-filled)
   - Destination: Select a hospital
   - Emergency: Select emergency type
3. Click "Activate Green Corridor"

**Expected Results:**
- ✓ Success status box appears
- ✓ Statistics update:
  - ETA: 6m
  - Signals: 6/6
  - Speed: 65
  - Distance: 4.2 km
- ✓ Map signals turn green
- ✓ Ambulance animates on route
- ✓ Map overlay updates

---

## 🐛 Error Handling Testing

### Test Case 25: localStorage Disabled

**Steps:**
1. Open DevTools (F12)
2. Go to Settings → Disable localStorage
3. Try to login

**Expected Results:**
- ✓ Should still attempt login (with warnings in console)
- ✓ Session won't persist but login flow continues

---

## 📋 Checklist Summary

### Authentication ✓
- [ ] Sign up as driver - redirects to driver dashboard
- [ ] Sign up as admin - redirects to admin dashboard
- [ ] Sign in with demo accounts works
- [ ] Form validation catches all errors
- [ ] Success animation displays
- [ ] Session stores in localStorage

### Authorization ✓
- [ ] Driver can't access admin dashboard
- [ ] Admin can't access driver dashboard
- [ ] Unauth users redirected to login
- [ ] Direct URL access is protected

### Navigation ✓
- [ ] All landing page links work
- [ ] Dashboard link aware of auth state
- [ ] Back link works
- [ ] Logout redirects to login
- [ ] Refresh maintains session

### UI/UX ✓
- [ ] Dark/light mode works
- [ ] Responsive on mobile
- [ ] Animations smooth
- [ ] Error messages clear
- [ ] Buttons provide feedback
- [ ] Form feels responsive

### Data ✓
- [ ] Session data correct
- [ ] User names display
- [ ] Role detection accurate
- [ ] Session persists
- [ ] Logout clears data

---

## ✨ Final Verification

Open `index.html` and verify:
1. ✓ Landing page loads beautifully
2. ✓ "Get Started" button works
3. ✓ Sign up/login flow is smooth
4. ✓ Dashboards display role-specific content
5. ✓ Logout works properly
6. ✓ All animations are smooth
7. ✓ No console errors
8. ✓ Mobile responsive

**If all tests pass → System is fully functional! 🎉**
