@echo off
chcp 65001 > nul
title Mission Green Plate — Dev Starter
color 0A

echo.
echo  ================================
echo   🌱 MISSION GREEN PLATE
echo   Starting Development Servers...
echo  ================================
echo.

:: Kill any stale node processes on ports 5000 / 5173
echo [1/4] Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5000 "') do (
  taskkill /F /PID %%a > nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173 "') do (
  taskkill /F /PID %%a > nul 2>&1
)

:: Start Backend
echo [2/4] Starting Backend API  (port 5000)...
start "🌱 Backend — port 5000" cmd /k "cd /d "%~dp0backend" && npm run dev"

:: Wait for backend to be ready
timeout /t 3 /nobreak > nul

:: Start Frontend
echo [3/4] Starting Frontend      (port 5173)...
start "🎮 Frontend — port 5173" cmd /k "cd /d "%~dp0frontend" && npm run dev"

:: Wait for Vite to boot
timeout /t 5 /nobreak > nul

:: Open browser
echo [4/4] Opening browser at http://localhost:5173
start "" "http://localhost:5173"

echo.
echo  ✅ Both servers are running!
echo.
echo  📋 Teacher login : teacher01 / password123
echo  🎮 Student login : 32002    / pass32002
echo  📡 IoT Simulator : click the blue button (bottom-right)
echo.
echo  Close this window when done. The two server windows
echo  will keep running until you close them separately.
echo.
pause
