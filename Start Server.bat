@echo off
title SpendWise Dev Server
echo =============================================
echo   SpendWise — Local Dev Server
echo   http://localhost:3000
echo =============================================
echo.
echo Chrome will open automatically.
echo Keep this window open while using the app.
echo Close this window to stop the server.
echo.
cd /d "%~dp0"
npx browser-sync start --server --files "**/*.html,**/*.css,**/*.js" --browser "chrome" --port 3000 --no-notify
pause
