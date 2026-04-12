@echo off
echo ==========================================
echo   NIAT Moderator Platform - Dev Servers
echo ==========================================
echo.

echo Starting Backend Server (port 5000)...
start "NIAT Backend" cmd /c "cd /d c:\Users\jyoth\Moderator_Platform\niat-insider-moderator\server && node dist/server.js"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server (port 5173)...
start "NIAT Frontend" cmd /c "cd /d c:\Users\jyoth\Moderator_Platform\niat-insider-moderator\client && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo ==========================================
echo   Both servers started!
echo   Frontend: http://localhost:5173
echo   Backend:  http://127.0.0.1:5000
echo.
echo   Login: admin@sgu.edu / password123
echo ==========================================
echo.
echo Press any key to close this window...
pause > nul
