#!/bin/bash
# Script para preparar el deployment en GitHub Pages

echo "🚀 Preparando deployment para GitHub Pages..."

# Verificar que estamos en el directorio correcto
if [ ! -f "index.html" ]; then
    echo "❌ Error: No se encontró index.html. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

echo "✅ Estructura de archivos verificada"

# Verificar archivos principales
REQUIRED_FILES=(
    "index.html"
    "ruleta.html"
    "js/api-client.js"
    "js/ruleta.js"
    "js/i18n.js"
    "estilos/styles.css"
    "estilos/ruleta-styles.css"
)

echo "🔍 Verificando archivos requeridos..."
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - FALTANTE"
        exit 1
    fi
done

# Verificar que no hay rutas absolutas problemáticas en HTML
echo "🔍 Verificando rutas en archivos HTML..."
if grep -r "src=\"/" *.html 2>/dev/null | grep -v "http"; then
    echo "⚠️ Advertencia: Se encontraron posibles rutas absolutas en archivos HTML"
    echo "Asegúrate de que todas las rutas sean relativas para GitHub Pages"
fi

if grep -r "href=\"/" *.html 2>/dev/null | grep -v "http"; then
    echo "⚠️ Advertencia: Se encontraron posibles rutas absolutas en archivos HTML"
fi

# Crear/actualizar .gitignore para GitHub Pages
echo "📝 Actualizando .gitignore..."
cat > .gitignore << 'EOF'
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
EOF

echo "✅ .gitignore actualizado"

# Crear README específico para GitHub Pages si no existe
if [ ! -f "README-DEPLOYMENT.md" ]; then
    echo "📄 Creando README de deployment..."
    cat > README-DEPLOYMENT.md << 'EOF'
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
EOF
fi

echo "✅ Archivos de deployment preparados"

# Mostrar resumen
echo ""
echo "🎉 ¡Preparación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ejecuta: git add ."
echo "2. Ejecuta: git commit -m 'Deploy to GitHub Pages'"
echo "3. Ejecuta: git push origin main"
echo "4. Ve a GitHub → Settings → Pages"
echo "5. Selecciona 'Deploy from branch' → 'main' → '/ (root)'"
echo "6. ¡Tu sitio estará disponible en unos minutos!"
echo ""
echo "🧪 Para probar el deployment:"
echo "   Visita: tu-url-github-pages/test-github-pages.html"
echo ""
