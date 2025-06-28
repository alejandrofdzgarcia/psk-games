# Configuración para GitHub Pages

## Pasos para desplegar en GitHub Pages:

### 1. Preparar el repositorio
1. Asegúrate de que todos los archivos estén en la rama `main` o `gh-pages`
2. Verifica que `index.html` esté en la raíz del repositorio
3. Comprueba que todas las rutas sean relativas (no absolutas)

### 2. Configurar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Clica en "Settings" → "Pages"
3. En "Source", selecciona "Deploy from a branch"
4. Selecciona la rama `main` y carpeta `/ (root)`
5. Clica "Save"

### 3. URL del sitio
Tu sitio estará disponible en: `https://[tu-usuario].github.io/[nombre-repositorio]`

## Características optimizadas para GitHub Pages:

### ✅ API Client configurado
- **Proxies CORS**: Múltiples proxies públicos como fallback
- **Modo offline**: Funciona completamente sin conexión a internet
- **Datos locales**: Almacena estadísticas en localStorage
- **Notificaciones**: Informa al usuario del estado de conexión

### ✅ Proxies CORS incluidos:
1. `api.allorigins.win` - Proxy principal para GitHub Pages
2. `corsproxy.io` - Proxy alternativo
3. `cors-anywhere.herokuapp.com` - Proxy de respaldo
4. **Modo offline** - Si todos fallan, usa datos locales

### ✅ Funcionalidades que funcionan sin API:
- ✅ Juego de ruleta completo
- ✅ Sistema de apuestas
- ✅ Contador de visitas (local)
- ✅ Estadísticas de juegos
- ✅ Historial de resultados
- ✅ Idiomas (español/inglés)

## Verificación del despliegue:

### Comandos de test (ejecutar después del despliegue):
```javascript
// En la consola del navegador de tu sitio GitHub Pages:

// 1. Verificar que la API client está funcionando
console.log('API Client:', window.apiClient);

// 2. Verificar el entorno detectado
console.log('Es GitHub Pages:', window.apiClient.isGitHubPages);

// 3. Probar conectividad
window.apiClient.getVisitas().then(result => {
    console.log('Test API:', result);
});

// 4. Verificar modo offline
console.log('Modo offline:', window.apiClient.offlineMode);
```

## Resolución de problemas comunes:

### Problema: "Error 404 en archivos JS/CSS"
**Solución**: Verificar que las rutas en HTML sean relativas:
```html
<!-- ✅ Correcto -->
<script src="js/ruleta.js"></script>
<link rel="stylesheet" href="estilos/ruleta-styles.css">

<!-- ❌ Incorrecto -->
<script src="/js/ruleta.js"></script>
<link rel="stylesheet" href="/estilos/ruleta-styles.css">
```

### Problema: "CORS errors en GitHub Pages"
**Solución**: Ya está configurado automáticamente:
- El código detecta GitHub Pages y usa proxies CORS
- Si todos los proxies fallan, activa modo offline
- Los datos se guardan localmente y la app funciona sin problemas

### Problema: "La ruleta no gira"
**Solución**: Verificar la consola del navegador:
1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. La mayoría de errores de API son normales y se manejan automáticamente

## Archivos importantes para GitHub Pages:

- `index.html` - Página principal (debe estar en la raíz)
- `ruleta.html` - Juego de ruleta
- `js/api-client.js` - ✅ Optimizado para GitHub Pages
- `js/ruleta.js` - Lógica del juego de ruleta
- `estilos/` - Hojas de estilo CSS
- `locales/` - Archivos de idiomas

## Notas importantes:

1. **El servidor CORS proxy local (`cors-proxy.js`) NO funciona en GitHub Pages** - esto es normal
2. **La app está diseñada para funcionar perfectamente sin servidor** 
3. **Todos los datos se almacenan localmente** en el navegador del usuario
4. **La experiencia de usuario es idéntica** con o sin conexión a la API

¡Tu ruleta casino está lista para GitHub Pages! 🎰
