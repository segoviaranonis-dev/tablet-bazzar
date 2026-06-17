@echo off
cd /d "%~dp0"
title Tablet Bazzar dev - puerto 3002
echo.
echo === TABLET BAZZAR - Reinicio dev ===
echo.
echo [1/4] Liberando puerto 3002...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3002" ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul
echo [2/4] Limpiando cache .next (evita API 404)...
if exist ".next" rd /s /q ".next"
echo [3/4] Regla: NO corras "npm run build" con el dev abierto.
echo [4/4] Iniciando next dev -p 3002...
echo.
echo URL: http://localhost:3002/cadena
echo Login: HECTOR — misma password que Report
echo.
npm run dev
if errorlevel 1 (
  echo.
  echo ERROR: npm run dev fallo. Si dice EADDRINUSE, vuelve a ejecutar este .bat
  pause
)
