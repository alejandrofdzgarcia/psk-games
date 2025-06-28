@echo off
echo.
echo ======================================
echo    CORS Proxy Server para Rule-Sauk
echo ======================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado.
    echo.
    echo 📥 Por favor, descarga e instala Node.js desde:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js detectado
echo.
echo 🚀 Iniciando CORS Proxy Server...
echo.
echo 📌 INSTRUCCIONES:
echo 1. Deja esta ventana abierta mientras desarrollas
echo 2. En api-client.js, cambia baseURL a: http://localhost:3001
echo 3. Recarga tu aplicación web
echo 4. Para detener el proxy: Ctrl+C
echo.
echo ==========================================
echo.

REM Ejecutar el proxy
node cors-proxy.js

echo.
echo 👋 CORS Proxy Server detenido
pause
