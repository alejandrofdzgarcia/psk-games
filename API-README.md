# Integración con API - PSK Games

Este proyecto ahora está integrado con una API de MongoDB Atlas desplegada en Render para manejar estadísticas y datos de usuario.

## URL de la API
```
https://psk-games-api.onrender.com/api
```

## Funcionalidades Implementadas

### 📊 Estadísticas en Tiempo Real
- **Visitas totales**: Se incrementan automáticamente cuando un usuario visita la página
- **Juegos jugados**: Se registran cada vez que se juega a la ruleta
- **Usuarios activos**: Se actualiza cada 30 segundos
- **Números más populares**: Tracking de qué números han salido más en la ruleta

### 👤 Gestión de Sesiones
- **ID de sesión único**: Se genera para cada usuario y se mantiene en localStorage
- **Tracking de actividad**: Se registra en qué páginas está el usuario
- **Soporte multiidioma**: Se guarda el idioma preferido del usuario

### 🎯 Resultados de Juegos
- **Historial de ruleta**: Cada giro se guarda con número, color y timestamp
- **Estadísticas personales**: Cada usuario puede ver sus propias estadísticas
- **Análisis de patrones**: Los números más salidos y distribución de colores

## Archivos Principales

### `js/api-client.js`
Cliente principal para comunicarse con la API. Incluye:
- Conexión con la API de Render
- Fallbacks cuando la API no está disponible
- Métodos para registrar visitas, juegos y actividad

### `js/stats-manager.js`
Gestor de estadísticas avanzadas:
- Panel de estadísticas detalladas (Ctrl + S)
- Actualizaciones en tiempo real cada 30 segundos
- Visualización de números más populares

### `js/ruleta.js` (modificado)
Ruleta con integración API:
- Guarda cada resultado en la base de datos
- Registra actividad cuando se accede a la página
- Improved error handling

## Características Especiales

### 🔄 Modo Offline
Si la API no está disponible, la aplicación sigue funcionando usando:
- localStorage para estadísticas básicas
- Datos por defecto realistas
- Logging de errores sin interrumpir la experiencia

### ⌨️ Atajos de Teclado
- **Ctrl + S**: Mostrar panel de estadísticas avanzadas

### 📱 Funciones Globales Disponibles
```javascript
// Mostrar estadísticas avanzadas
window.showStats();

// Mostrar números más populares en consola
window.showPopularNumbers();

// Acceso a la API
window.apiClient.getStats();
window.apiClient.recordGameResult('roulette', result);
```

## Estructura de la Base de Datos

### Colecciones
1. **gamestats**: Estadísticas globales
2. **usersessions**: Sesiones de usuario
3. **gameresults**: Resultados individuales de juegos

### Datos Guardados por Giro
```json
{
  "sessionId": "psk_1735353...",
  "gameType": "roulette",
  "result": {
    "number": "17",
    "color": "NEGRO",
    "colorHex": "#1A1A1A",
    "option": "17 - NEGRO"
  },
  "timestamp": "2025-06-27T...",
  "language": "es"
}
```

## Configuración de CORS
La API está configurada para aceptar requests desde:
- `https://tu-usuario.github.io` (GitHub Pages)
- `http://localhost:3000` (desarrollo local)
- `http://127.0.0.1:5500` (Live Server)

## Monitoreo
- Logs en consola del navegador
- Estado de conexión visible en tiempo real
- Fallbacks automáticos si la API no responde

## Próximas Mejoras Posibles
- [ ] Ranking de jugadores
- [ ] Estadísticas por país/región
- [ ] Notificaciones push
- [ ] Chat en tiempo real
- [ ] Torneos y competencias
- [ ] Logros y badges

## Troubleshooting

### La API no responde
- Verificar que `https://psk-games-api.onrender.com/api/health` responda
- Revisar la consola del navegador por errores CORS
- La aplicación seguirá funcionando en modo offline

### Estadísticas no se actualizan
- Verificar conexión a internet
- Comprobar que localStorage esté habilitado
- Presionar Ctrl + S para ver estadísticas detalladas
