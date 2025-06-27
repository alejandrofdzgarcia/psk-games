# PSK - Games (Ruleta de la Suerte)

Una colección interactiva de ruletas para tomar decisiones de forma divertida.

## 🚀 Características

- **Ruleta de Doble Vega**: La ruleta principal totalmente funcional
- **Múltiples opciones**: Ruletas personalizadas, de comida, actividades, decisiones y colores (en desarrollo)
- **Tema oscuro/claro**: Cambia entre temas con un click
- **Multiidioma**: Soporte para español e inglés
- **Responsive**: Funciona en desktop y móvil
- **Efectos visuales**: Partículas flotantes y animaciones suaves

## 🛠 Desarrollo Local

### Opción 1: Servidor Python (Recomendado)
```bash
# Navegar al directorio del proyecto
cd rule-sauk

# Iniciar servidor web local
python -m http.server 8000

# Abrir en navegador
# http://localhost:8000
```

### Opción 2: Servidor Node.js
```bash
# Instalar servidor global
npm install -g http-server

# Iniciar servidor
http-server -p 8000

# Abrir en navegador
# http://localhost:8000
```

## 📁 Estructura del Proyecto

```
rule-sauk/
├── index.html              # Página principal
├── ruleta.html             # Ruleta de Doble Vega
├── estilos/
│   ├── styles.css          # Estilos principales
│   └── ruleta-styles.css   # Estilos de la ruleta
├── js/
│   ├── menu.js             # Lógica del menú principal
│   ├── ruleta.js           # Lógica de la ruleta
│   └── i18n.js             # Sistema de internacionalización
├── locales/
│   ├── es.json             # Traducciones en español
│   └── en.json             # Traducciones en inglés
├── multimedia/
│   └── favicon.ico         # Icono del sitio
└── README.md               # Este archivo
```

## 🌐 Despliegue en GitHub Pages

1. **Subir a GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

2. **Configurar GitHub Pages**:
   - Ve a Settings > Pages en tu repositorio
   - Selecciona "Deploy from a branch"
   - Elige "main" branch y "/ (root)" folder
   - Guarda los cambios

3. **Acceder**:
   - La aplicación estará disponible en: `https://tu-usuario.github.io/rule-sauk`

## 🎮 Funcionalidades

### Completadas ✅
- Menú principal interactivo
- Ruleta de Doble Vega funcional
- Sistema de temas (claro/oscuro)
- Soporte multiidioma
- Efectos visuales y animaciones
- Estadísticas dinámicas

### En Desarrollo 🚧
- Ruleta Personalizada
- Ruleta de Comida
- Ruleta de Actividades
- Ruleta de Decisiones
- Ruleta de Colores

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con animaciones
- **JavaScript ES6+**: Lógica interactiva
- **Font Awesome**: Iconografía
- **JSON**: Sistema de traducciones

## 🐛 Solución de Problemas

### Error de CORS en desarrollo local
Si ves errores de CORS al abrir directamente el archivo HTML:
- Usa un servidor web local (Python, Node.js, etc.)
- No abras directamente el archivo `index.html` en el navegador

### Problemas con traducciones
- Verifica que los archivos `es.json` y `en.json` estén en la carpeta `locales/`
- Asegúrate de que el servidor web esté sirviendo correctamente los archivos JSON

## 📝 Notas de Desarrollo

- La aplicación está optimizada para GitHub Pages
- No se requieren dependencias externas (solo CDN para Font Awesome)
- Compatible con navegadores modernos

## 👤 Autor

Hecho por **Alejandro Fernández García**  
Versión 2.0 - Actualizado el 27/06/2025

---

¡Disfruta jugando con las ruletas! 🎲
