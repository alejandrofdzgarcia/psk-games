# Script PowerShell para preparar el deployment en GitHub Pages
# deploy-github-pages.ps1

Write-Host "🚀 Preparando deployment para GitHub Pages..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "index.html")) {
    Write-Host "❌ Error: No se encontró index.html. Ejecuta este script desde la raíz del proyecto." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Estructura de archivos verificada" -ForegroundColor Green

# Verificar archivos principales
$requiredFiles = @(
    "index.html",
    "ruleta.html",
    "js/api-client.js",
    "js/ruleta.js",
    "js/i18n.js",
    "estilos/styles.css",
    "estilos/ruleta-styles.css"
)

Write-Host "🔍 Verificando archivos requeridos..." -ForegroundColor Yellow
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file - FALTANTE" -ForegroundColor Red
        exit 1
    }
}

# Verificar rutas en archivos HTML
Write-Host "🔍 Verificando rutas en archivos HTML..." -ForegroundColor Yellow
$htmlFiles = Get-ChildItem -Filter "*.html"
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match 'src="/' -and $content -notmatch 'http') {
        Write-Host "⚠️ Advertencia: Posibles rutas absolutas encontradas en $($file.Name)" -ForegroundColor Yellow
    }
    if ($content -match 'href="/' -and $content -notmatch 'http') {
        Write-Host "⚠️ Advertencia: Posibles rutas absolutas encontradas en $($file.Name)" -ForegroundColor Yellow
    }
}

# Crear/actualizar .gitignore
Write-Host "📝 Actualizando .gitignore..." -ForegroundColor Yellow
$gitignoreContent = @'
# Archivos de desarrollo local que no se necesitan en GitHub Pages
node_modules/
cors-proxy.js
start-cors-proxy.bat
.env
.env.local

# Archivos del sistema
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Archivos temporales
*.tmp
*.temp

# Archivos de configuración local IDE
.vscode/settings.json
.idea/
*.swp
*.swo

# No ignorar los archivos necesarios para GitHub Pages
!js/
!estilos/
!locales/
!multimedia/
!*.html
!*.md
'@

Set-Content -Path ".gitignore" -Value $gitignoreContent -Encoding UTF8
Write-Host "✅ .gitignore actualizado" -ForegroundColor Green

# Crear README específico para GitHub Pages si no existe
if (-not (Test-Path "README-DEPLOYMENT.md")) {
    Write-Host "📄 Creando README de deployment..." -ForegroundColor Yellow
    $readmeContent = @'
# 🎰 Ruleta Casino - Deployment en GitHub Pages

## 🌐 URL del Sitio
Accede al juego en: `https://[tu-usuario].github.io/[nombre-repositorio]`

## ✅ Estado del Deployment
- ✅ Optimizado para GitHub Pages
- ✅ Funciona completamente offline
- ✅ API con múltiples fallbacks
- ✅ Datos locales como respaldo
- ✅ Responsive design
- ✅ Multiidioma (ES/EN)

## 🧪 Test del Deployment
Visita: `https://[tu-usuario].github.io/[nombre-repositorio]/test-github-pages.html`

## 🎮 Funcionalidades
- 🎰 Juego de ruleta casino completo
- 💰 Sistema de apuestas (inside/outside bets)
- 📊 Estadísticas en tiempo real
- 🌐 API con fallbacks automáticos
- 💾 Almacenamiento local de datos
- 🌍 Soporte multiidioma
- 📱 Diseño responsive

## 🔧 Configuración Técnica
- **CORS**: Configurado con múltiples proxies públicos
- **Offline**: Funciona sin conexión a internet
- **Storage**: localStorage para persistencia de datos
- **Fallbacks**: Sistema robusto de fallbacks para la API

## 📱 Compatibilidad
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Móviles (iOS/Android)

¡Disfruta del juego! 🎲
'@
    
    Set-Content -Path "README-DEPLOYMENT.md" -Value $readmeContent -Encoding UTF8
}

Write-Host "✅ Archivos de deployment preparados" -ForegroundColor Green

# Mostrar resumen
Write-Host ""
Write-Host "🎉 ¡Preparación completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Ejecuta: git add ." -ForegroundColor White
Write-Host "2. Ejecuta: git commit -m 'Deploy to GitHub Pages'" -ForegroundColor White
Write-Host "3. Ejecuta: git push origin main" -ForegroundColor White
Write-Host "4. Ve a GitHub → Settings → Pages" -ForegroundColor White
Write-Host "5. Selecciona 'Deploy from branch' → 'main' → '/ (root)'" -ForegroundColor White
Write-Host "6. ¡Tu sitio estará disponible en unos minutos!" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Para probar el deployment:" -ForegroundColor Yellow
Write-Host "   Visita: tu-url-github-pages/test-github-pages.html" -ForegroundColor White
Write-Host ""

# Opcional: Ejecutar git commands automáticamente
$response = Read-Host "¿Quieres ejecutar los comandos git automáticamente? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "📤 Ejecutando comandos git..." -ForegroundColor Yellow
    
    git add .
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ git add ejecutado" -ForegroundColor Green
        
        git commit -m "Deploy to GitHub Pages - Optimized for production"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ git commit ejecutado" -ForegroundColor Green
            
            git push origin main
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ git push ejecutado" -ForegroundColor Green
                Write-Host "🚀 ¡Código enviado a GitHub! Ahora configura GitHub Pages." -ForegroundColor Green
            } else {
                Write-Host "❌ Error en git push" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Error en git commit" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Error en git add" -ForegroundColor Red
    }
}
