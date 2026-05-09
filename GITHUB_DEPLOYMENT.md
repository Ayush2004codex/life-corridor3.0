# 🚀 GitHub Deployment Guide - Life Corridor

## Step 1: Create Repository on GitHub

1. Go to [GitHub.com](https://github.com)
2. Click **+ New** (top right corner)
3. Fill in:
   - **Repository name**: `life-corridor` (or your preferred name)
   - **Description**: Smart Emergency Response System for Kolkata ambulance routing
   - **Visibility**: Public (or Private if preferred)
   - **DO NOT** check "Initialize with README"
4. Click **Create repository**

---

## Step 2: Copy Your Repository URL

After creating the repo, you'll see a screen with commands. Copy the HTTPS URL:
```
https://github.com/YOUR_USERNAME/life-corridor.git
```

---

## Step 3: Initialize Git Locally

Open Command Prompt or PowerShell in your project folder:

```bash
cd C:\Users\Ayush\OneDrive\Desktop\Roadmap

# Initialize git
git init

# Configure user (one-time)
git config user.name "Your Name"
git config user.email "your-email@example.com"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Life Corridor Smart Emergency Response System

- Landing page with authentication system
- Admin dashboard with signal control and real-time ambulance tracking
- Driver dashboard with corridor requests and live navigation
- Real-time signal proximity detection (green when ambulance near)
- Cross-tab signal override functionality
- Role-based access control (RBAC)
- Dark/Light mode support
- Responsive design for all devices"

# Add remote repository (paste YOUR URL here)
git remote add origin https://github.com/YOUR_USERNAME/life-corridor.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 4: Verify on GitHub

1. Go to your GitHub repository
2. You should see all your files uploaded
3. Your README.md will display as the repo description

---

## Step 5: Enable GitHub Pages (Optional - for Live Demo)

1. Go to **Settings** → **Pages** (in your repo)
2. Under "Build and deployment":
   - **Source**: Select **Deploy from a branch**
   - **Branch**: Select `main` → `/ (root)`
3. Click **Save**
4. Wait 1-2 minutes
5. Your site will be live at: `https://YOUR_USERNAME.github.io/life-corridor/`

---

## Making Future Updates

After you make changes locally:

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

---

## 📁 What Will Be Uploaded

✅ **HTML Files:**
- `index.html` - Landing page
- `login.html` - Authentication
- `admin.html` - Admin dashboard
- `driver.html` - Driver dashboard

✅ **Documentation:**
- `README.md` - Main documentation
- `AUTH_GUIDE.md`
- `FEATURES.md`
- `TESTING_GUIDE.md`
- And all other supporting docs

✅ **Config Files:**
- `cleanup.bat`
- `.git/` - Version control history

---

## 🔒 First Push Troubleshooting

**If you get an authentication error:**

1. Create a Personal Access Token:
   - GitHub.com → Settings → Developer settings → Personal access tokens
   - Click "Generate new token"
   - Give it `repo` permissions
   - Copy the token

2. When git asks for password, paste the token instead

**Or use SSH (recommended):**
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your-email@example.com"`
2. Add to GitHub: Settings → SSH and GPG keys → New SSH key
3. Use SSH URL instead of HTTPS

---

## ✅ Deployment Checklist

- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Git installed on your computer
- [ ] Navigate to project folder in terminal
- [ ] Run `git init`
- [ ] Run `git add .`
- [ ] Run `git commit -m "..."`
- [ ] Run `git remote add origin YOUR_URL`
- [ ] Run `git push -u origin main`
- [ ] Verify files on GitHub.com
- [ ] (Optional) Enable GitHub Pages for live demo

---

## 🎉 You're Done!

Your Life Corridor application is now on GitHub!

**Share your repo:** `https://github.com/YOUR_USERNAME/life-corridor`

**Live demo (if GitHub Pages enabled):** `https://YOUR_USERNAME.github.io/life-corridor/`

---

For questions, refer to: [GitHub Docs - Creating a Repository](https://docs.github.com/en/repositories/creating-and-managing-repositories)
