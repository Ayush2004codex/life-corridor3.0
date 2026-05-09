# 🚑 Life Corridor - Smart Emergency Response System

A modern, fully-functional web application for managing emergency ambulance corridors in Kolkata with role-based access control for Hospital Admins and Ambulance Drivers.

## ✨ Features

### 🏠 Landing Page (`index.html`)
- **Hero Section**: Eye-catching introduction with call-to-action
- **Features Overview**: 4 core technology features
- **Live Corridor Demo**: Interactive animated traffic light simulation
- **Dashboard Preview**: Mockup of admin and driver interfaces
- **Social Proof**: Testimonials and statistics
- **Team Section**: Project credits and bios
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Mobile-friendly layout

### 🔐 Authentication System (`login.html`)
- **Sign Up** for new users with role selection
- **Sign In** for existing users
- **Role-Based Flow**: 
  - Hospital Admin
  - Ambulance Driver
- **Form Validation**: Email format, password strength, name requirements
- **Beautiful UI**: Glassmorphic design with animations
- **Demo Accounts**: Quick access for testing

### 👨‍💼 Admin Dashboard (`admin.html`)
- **Hospital Management Overview**
- **Incoming Ambulance Requests**: Real-time list with ETA
- **Signal Control**: Manual override of traffic lights
- **KPI Analytics**: Beds available, active corridors, lives saved
- **Protected Access**: Only accessible to admins
- **Session Display**: Shows logged-in user name
- **Logout**: Secure logout with confirmation

### 🚑 Driver Dashboard (`driver.html`)
- **Emergency Corridor Request**: Form to activate green corridor
- **Real-Time Navigation**: ETA, speed, distance, signal count
- **Live Tracking Map**: SVG-based route visualization with animated ambulance
- **Route Display**: Next turn instructions
- **Protected Access**: Only accessible to drivers
- **Session Display**: Shows logged-in user name
- **Logout**: Secure logout with confirmation

## 🚀 Quick Start

### 1. Open the Application
```bash
# Double-click or open in browser:
index.html
```

### 2. Explore Landing Page
- Scroll through features and demo
- Click navigation links
- Try dark/light mode toggle

### 3. Test Authentication
- Click "Get Started" button
- Try sign up as driver or admin
- Or use demo accounts to sign in

### 4. Access Dashboards
- After login, you'll see your role-specific dashboard
- Admin sees hospital management view
- Driver sees ambulance dashboard

## 🔑 Demo Accounts

```
Email: admin@lifecorridor.io
Role: Hospital Admin
Password: any value

Email: driver@lifecorridor.io
Role: Ambulance Driver
Password: any value
```

Or create your own account during sign up!

## 📁 File Structure

```
Roadmap/
├── index.html              ← Landing page (start here!)
├── login.html              ← Authentication system
├── admin.html              ← Admin dashboard
├── driver.html             ← Driver dashboard
├── README.md               ← This file
├── AUTH_GUIDE.md           ← Authentication guide
├── FEATURES.md             ← Complete feature list
└── TESTING_GUIDE.md        ← Testing procedures
```

## 🔐 Authentication Flow

```
Landing Page (index.html)
    ↓
    └─→ Get Started Button
         ↓
    Login Page (login.html)
         ├─→ Sign In
         │    ├─→ Check email for role
         │    └─→ Redirect to dashboard
         │
         └─→ Create Account
              ├─→ Select role
              └─→ Redirect to dashboard
              
Admin Dashboard (admin.html) ← Only admins
Driver Dashboard (driver.html) ← Only drivers
```

## 🛡️ Role-Based Access Control (RBAC)

**Admin Role**
- Access: `admin.html`
- Requirements: Email contains "admin" (case-insensitive)
- Features: Hospital management, signal control, KPI analytics

**Driver Role**
- Access: `driver.html`
- Requirements: Any other email or explicit driver selection
- Features: Corridor requests, navigation, live tracking

## 💾 Session Management

- **Storage**: Browser localStorage
- **Session Data**: Email, name, role, login time
- **Persistence**: Survives page refresh
- **Security**: Clears on logout
- **Protection**: Auto-redirects if not authenticated

## ✅ Form Validation

### Sign In
- ✓ Email required and valid format
- ✓ Password required (minimum 6 characters)
- ✓ Clear error messages

### Sign Up
- ✓ Name required (minimum 2 characters)
- ✓ Email required and valid format
- ✓ Role must be selected
- ✓ Password required (minimum 6 characters)

## 🎨 Design Features

- **Color Scheme**: Green (#00c853), Blue (#00b4d8), Dark backgrounds
- **Typography**: Poppins font family (Google Fonts)
- **Animations**: Smooth transitions, floating effects, loading states
- **Responsive**: Mobile, tablet, and desktop support
- **Glassmorphism**: Modern UI with backdrop filters
- **Accessibility**: Keyboard navigation, proper labels, semantic HTML

## 🧪 Testing

Comprehensive testing guide available in `TESTING_GUIDE.md`:

1. **Sign Up Testing**: Create accounts as admin/driver
2. **Sign In Testing**: Use demo accounts
3. **Validation Testing**: Test form errors
4. **Navigation Testing**: Test all links and redirects
5. **RBAC Testing**: Test role restrictions
6. **Session Testing**: Test persistence and logout
7. **UI Testing**: Test responsiveness and dark mode

## 🌐 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

- Desktop: 1200px and above
- Tablet: 768px - 1199px
- Mobile: Below 768px

## 🚀 Deployment

### Option 1: Local Testing
1. Open `index.html` in browser
2. No server required!
3. All data stored in browser localStorage

### Option 2: Web Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Using Live Server (VS Code)
Install Live Server extension
Right-click → Open with Live Server
```

### Option 3: GitHub Pages
1. Push files to GitHub
2. Enable GitHub Pages in settings
3. Access at `https://username.github.io/repo`

## 🔒 Security Considerations

**Current Implementation (Demo)**
- Uses localStorage (client-side only)
- No backend authentication
- Suitable for prototypes and demos

**Production Implementation Should Include**
- Secure backend API
- JWT or session-based auth
- Password hashing
- HTTPS/SSL
- CSRF protection
- Rate limiting
- Input sanitization

## 📝 Documentation

- **AUTH_GUIDE.md** - Complete authentication guide
- **FEATURES.md** - Detailed feature checklist
- **TESTING_GUIDE.md** - Comprehensive testing procedures
- **README.md** - This file

## 🎯 Next Steps

### To Enhance Further:
1. Add backend API integration
2. Implement real ambulance tracking
3. Add push notifications
4. Create mobile app version
5. Add data persistence (database)
6. Implement real-time updates (WebSocket)
7. Add payment/billing system
8. Create admin analytics dashboard

### To Customize:
1. Update city/location names
2. Customize color scheme
3. Add your own team members
4. Modify features list
5. Add custom integrations

## 🙌 Credits

**Development Team**
- Lead Developer: Yash Keshri
- UI/UX Designer: SK Ruksar Parvin
- API Integration: Mandavi Kumari

Built with ❤️ at Narula Institute of Technology, Kolkata

## 📧 Contact

For questions or support:
- Email: support@lifecorridor.io
- Website: www.lifecorridor.io
- GitHub: [Your GitHub]

## 📄 License

This project is open-source and available under the MIT License.

---

## ⚡ Getting Started Checklist

- [ ] Open `index.html` in browser
- [ ] Explore landing page features
- [ ] Click "Get Started"
- [ ] Create an account or sign in
- [ ] View your dashboard
- [ ] Test all features
- [ ] Try dark/light mode
- [ ] Test logout and re-login
- [ ] Read documentation files
- [ ] Share feedback!

---

**Ready to save lives? Let's go! 🚑💚**

For detailed guides, see:
- `AUTH_GUIDE.md` - How authentication works
- `FEATURES.md` - Complete feature list
- `TESTING_GUIDE.md` - How to test everything

Thank you for using Life Corridor! 🎉
