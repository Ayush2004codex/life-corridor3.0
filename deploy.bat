@echo off
cd /d "C:\Users\Ayush\OneDrive\Desktop\Roadmap"

echo ==========================================
echo Life Corridor - GitHub Deployment
echo ==========================================
echo.

REM Initialize git repository
echo [1/5] Initializing git repository...
git init

REM Configure git user
echo [2/5] Configuring git user...
git config user.name "Ayush"
git config user.email "ayush@example.com"

REM Add all files
echo [3/5] Adding all files...
git add .

REM Create initial commit
echo [4/5] Creating initial commit...
git commit -m "Initial commit: Life Corridor Smart Emergency Response System

- Landing page with authentication system
- Admin dashboard with signal control and real-time ambulance tracking
- Driver dashboard with corridor requests and live navigation
- Real-time signal proximity detection (green when ambulance near)
- Cross-tab signal override functionality
- Role-based access control (RBAC)
- Dark/Light mode support
- Responsive design
- Flipped ambulance icons for proper direction
- Home button navigation"

REM Add remote and push
echo [5/5] Adding remote and pushing to GitHub...
git remote add origin https://github.com/Ayush2004codex/life-corridor.git
git branch -M main
git push -u origin main

echo.
echo ==========================================
echo ✅ Deployment Complete!
echo ==========================================
echo Your project is now on GitHub:
echo https://github.com/Ayush2004codex/life-corridor
echo.
pause
