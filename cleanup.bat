@echo off
cd /d "c:\Users\Ayush\OneDrive\Desktop\Roadmap"

REM Delete all unused files
del /f /q "00_START_HERE.txt" 2>nul
del /f /q "ADMIN_DETAILED_MAP_UPDATE.txt" 2>nul
del /f /q "ADMIN_MAP_QUICK_REFERENCE.txt" 2>nul
del /f /q "ADMIN_MAP_UPDATE.txt" 2>nul
del /f /q "CHANGES_LOG.md" 2>nul
del /f /q "DELIVERY_COMPLETE.txt" 2>nul
del /f /q "DELIVERY_README.txt" 2>nul
del /f /q "FINAL_DELIVERY.txt" 2>nul
del /f /q "FINAL_SIGNAL_UPDATE.txt" 2>nul
del /f /q "FINAL_UPDATE.txt" 2>nul
del /f /q "IMPLEMENTATION_COMPLETE.txt" 2>nul
del /f /q "IMPLEMENTATION_SUMMARY.md" 2>nul
del /f /q "LANDING_PAGE_UPDATE.txt" 2>nul
del /f /q "PROJECT_COMPLETE.txt" 2>nul
del /f /q "PROJECT_COMPLETION_SUMMARY.md" 2>nul
del /f /q "PROJECT_DELIVERY_COMPLETE.txt" 2>nul
del /f /q "PROJECT_INDEX.txt" 2>nul
del /f /q "QUICK_REFERENCE.txt" 2>nul
del /f /q "QUICK_REFERENCE_SIGNALS.txt" 2>nul
del /f /q "SIGNAL_BEHAVIOR_GUIDE.md" 2>nul
del /f /q "SIGNAL_OVERRIDE_IMPLEMENTATION.txt" 2>nul
del /f /q "SIGNAL_OVERRIDE_QUICK_TEST.txt" 2>nul
del /f /q "SIGNAL_OVERRIDE_VISUAL_GUIDE.txt" 2>nul
del /f /q "SIGNAL_TESTING.txt" 2>nul
del /f /q "START_HERE_FIRST.txt" 2>nul
del /f /q "UPDATE_GUIDE.md" 2>nul
del /f /q "VERSION_HISTORY.txt" 2>nul
del /f /q "v2.1_IMPLEMENTATION_DETAILS.md" 2>nul
del /f /q "TESTING_SIGNALS.txt" 2>nul
del /f /q "RELEASE_NOTES_v2.1.txt" 2>nul

REM Delete the app folder
rmdir /s /q "app" 2>nul

echo Cleanup complete!
pause
