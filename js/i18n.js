// Sistema de internacionalización
class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'es';
        this.translations = {};
        this.loadTranslations();
    }

    async loadTranslations() {
        try {
            // Cargar archivos de traducción de forma asíncrona
            const [esResponse, enResponse] = await Promise.all([
                fetch('locales/es.json'),
                fetch('locales/en.json')
            ]);

            this.translations = {
                es: await esResponse.json(),
                en: await enResponse.json()
            };

            // Actualizar contenido después de cargar las traducciones
            this.updatePageContent();
        } catch (error) {
            console.error('Error cargando traducciones:', error);
            // Fallback a traducciones básicas si falla la carga
            this.loadFallbackTranslations();
        }
    }

    loadFallbackTranslations() {
        // Traducciones básicas de fallback en caso de error
        this.translations = {
            es: {
                'site.title': 'PSK - Games',
                'roulette.spin': '¡GIRAR RULETA!',
                'roulette.spinning': 'Girando...',
                'nav.back': '← Volver al Menú'
            },
            en: {
                'site.title': 'PSK - Games',
                'roulette.spin': 'SPIN ROULETTE!',
                'roulette.spinning': 'Spinning...',
                'nav.back': '← Back to Menu'
            }
        };
    }

    t(key, ...args) {
        let translation = this.translations[this.currentLanguage][key] || key;
        
        // Reemplazar placeholders %s con argumentos
        if (args.length > 0) {
            args.forEach(arg => {
                translation = translation.replace('%s', arg);
            });
        }
        
        return translation;
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.updatePageContent();
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    updatePageContent() {
        // Actualizar todos los elementos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Actualizar placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Actualizar títulos
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // Actualizar el título de la página
        const titleElement = document.querySelector('title');
        if (titleElement && titleElement.hasAttribute('data-i18n')) {
            titleElement.textContent = this.t(titleElement.getAttribute('data-i18n'));
        }
    }

    createLanguageSelector() {
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        selector.innerHTML = `
            <select id="languageSelect" onchange="i18n.setLanguage(this.value)">
                <option value="es" ${this.currentLanguage === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
                <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>🇺🇸 English</option>
            </select>
        `;
        return selector;
    }
}

// Inicializar el sistema de i18n
const i18n = new I18n();

// Función para inicializar i18n en cada página
async function initI18n() {
    // Esperar a que se carguen las traducciones
    await i18n.loadTranslations();
    
    // Agregar selector de idioma al header si no existe
    const container = document.querySelector('.container') || document.body;
    if (container && !document.querySelector('.language-selector')) {
        const languageSelector = i18n.createLanguageSelector();
        languageSelector.style.position = 'absolute';
        languageSelector.style.top = '20px';
        languageSelector.style.right = '20px';
        languageSelector.style.zIndex = '1000';
        container.appendChild(languageSelector);
    }

    // Actualizar contenido inicial
    i18n.updatePageContent();
}

// Auto-inicializar cuando se carga el DOM
document.addEventListener('DOMContentLoaded', initI18n);
