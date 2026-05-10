@echo off
echo  Starting BusTracker...
echo.

start "Backend - BusTracker.API" cmd /k "cd /d %~dp0BusTracker.API && dotnet run"
timeout /t 4 /nobreak >nul
start "Frontend - Vite" cmd /k "cd /d %~dp0bus-tracker-frontend && npm install && npm run dev"

echo  Backend och frontend startar i separata foenster.
echo  Oeppna http://localhost:5173 i webblaeesaren.
echo.
pause
