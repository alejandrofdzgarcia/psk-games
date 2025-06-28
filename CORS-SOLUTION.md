# Solución para el Error de CORS

## 🚫 Problema
Cuando abres la aplicación desde localhost, ves errores de CORS en la consola del navegador como:
```
Access to fetch at 'https://psk-games-api.onrender.com/api/visitas' from origin 'http://localhost:3000' has been blocked by CORS policy
```

## ✅ Soluciones Disponibles

### Opción 1: Usar el Proxy Local (Recomendado para desarrollo)

1. **Ejecutar el proxy:**
   - Doble clic en `start-cors-proxy.bat`
   - O desde terminal: `node cors-proxy.js`

2. **Verificar conexión:**
   - El proxy se ejecuta en `http://localhost:3001`
   - Debes ver el mensaje "CORS Proxy Server iniciado"

3. **Probar la aplicación:**
   - Abre `ruleta.html` en tu navegador
   - La aplicación detectará automáticamente el proxy
   - Verás una notificación "Conectado a través de proxy local"

### Opción 2: Usar Extensión de Navegador (Rápido pero menos seguro)

1. **Chrome:**
   - Instala "CORS Unblock" o "Allow CORS"
   - Activa la extensión solo para desarrollo
   - ⚠️ **Recuerda desactivarla después**

2. **Firefox:**
   - Instala "CORS Everywhere"
   - Activa solo durante desarrollo

### Opción 3: Servir desde un Servidor HTTP Local

En lugar de abrir el archivo directamente, úsalo desde un servidor:

```powershell
# Con Python (si lo tienes instalado)
python -m http.server 8000

# Con Node.js (si tienes npx)
npx http-server

# Con PHP (si lo tienes instalado)
php -S localhost:8000
```

Luego visita: `http://localhost:8000/ruleta.html`

## 🔧 Modo Fallback (Automático)

Si ninguna solución funciona, la aplicación automáticamente:
- Usa datos locales almacenados en localStorage
- Mantiene toda la funcionalidad de la ruleta
- Muestra estadísticas simuladas pero funcionales
- Te notifica que está funcionando en "modo offline"

## 📊 Verificar el Estado

Abre la consola del navegador (F12) para ver:
- ✅ "Conectado al servidor - Estadísticas en tiempo real"
- ⚠️ "Funcionando en modo offline - estadísticas locales"

## 🔍 Troubleshooting

### El proxy no inicia:
- Verifica que Node.js esté instalado: `node --version`
- El puerto 3001 puede estar ocupado - cambia el PORT en `cors-proxy.js`

### Sigue viendo errores CORS:
- Verifica que el proxy esté ejecutándose
- Refresca la página completamente (Ctrl+F5)
- Revisa la consola para ver si detectó el proxy

### La aplicación no responde:
- El sistema fallback garantiza que funcione
- Todas las características principales están disponibles offline
- Solo las estadísticas globales requieren conexión al servidor

## 📝 Notas Técnicas

- **CORS**: Cross-Origin Resource Sharing es una medida de seguridad del navegador
- **Proxy Local**: Actúa como intermediario añadiendo headers CORS necesarios
- **Fallback**: Sistema robusto que garantiza funcionalidad sin conexión
- **Detección Automática**: El cliente API detecta automáticamente qué método usar

## 🎮 Funcionalidades Disponibles Offline

✅ Ruleta completa con animación
✅ Sistema de apuestas con fichas
✅ Cálculo de ganancias
✅ Soporte multiidioma
✅ Estadísticas locales
✅ Historial de juegos local
❌ Estadísticas globales en tiempo real
❌ Sincronización entre dispositivos
