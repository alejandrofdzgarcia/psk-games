// Sistema de internacionalización
class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'es';
        this.translations = {};
        // No cargar traducciones automáticamente en el constructor
        // Esto se hará explícitamente con initI18n()
    }

    async loadTranslations() {
        try {
            console.log('Cargando traducciones...');
            
            // Cargar archivos de traducción de forma asíncrona
            const [esResponse, enResponse] = await Promise.all([
                fetch('locales/es.json'),
                fetch('locales/en.json')
            ]);

            console.log('Respuestas recibidas:', { 
                es: esResponse.status, 
                en: enResponse.status 
            });

            if (!esResponse.ok || !enResponse.ok) {
                throw new Error(`Failed to fetch translation files. ES: ${esResponse.status}, EN: ${enResponse.status}`);
            }

            this.translations = {
                es: await esResponse.json(),
                en: await enResponse.json()
            };

            console.log('Traducciones cargadas exitosamente:', Object.keys(this.translations));
            
            // Actualizar contenido después de cargar las traducciones
            this.updatePageContent();
        } catch (error) {
            console.error('Error cargando traducciones:', error);
            console.log('Usando traducciones de fallback...');
            // Fallback a traducciones básicas si falla la carga
            this.loadFallbackTranslations();
            this.updatePageContent();
        }
    }

    loadFallbackTranslations() {
        // Traducciones básicas de fallback en caso de error
        this.translations = {
            es: {
                'site.title': 'PSK - Games',
                'site.subtitle': 'Elige tu tipo de ruleta favorita',
                'roulette.title': 'Ruleta de Doble Vega',
                'roulette.description': 'Esta ruleta solo es apta para ludópatas (véase Vega Vega)',
                'button.play': 'Jugar',
                'footer.made_by': 'Hecho por Alejandro Fernández García',
                'roulette.spin': '¡GIRAR RULETA!',
                'roulette.spinning': 'Girando...',
                'nav.back': '← Volver al Menú'
            },
            en: {
                'site.title': 'PSK - Games',
                'site.subtitle': 'Choose your favorite roulette type',
                'roulette.title': 'Double Vega Roulette',
                'roulette.description': 'This roulette is only suitable for gambling addicts (see Vega Vega)',
                'button.play': 'Play',
                'footer.made_by': 'Made by Alejandro Fernández García',
                'roulette.spin': 'SPIN ROULETTE!',
                'roulette.spinning': 'Spinning...',
                'nav.back': '← Back to Menu'
            }
        };
    }

    t(key, ...args) {
        // Verificar que las traducciones estén cargadas
        if (!this.translations || !this.translations[this.currentLanguage]) {
            console.warn(`Traducciones no disponibles para el idioma: ${this.currentLanguage}`);
            return key;
        }

        let translation = this.translations[this.currentLanguage][key];
        
        // Si no existe la traducción, intentar con la clave como está
        if (translation === undefined) {
            console.warn(`Traducción no encontrada para la clave: ${key}`);
            return key;
        }
        
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
    try {
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
        console.log('Sistema i18n inicializado correctamente');
    } catch (error) {
        console.error('Error inicializando i18n:', error);
    }
}

// Auto-inicializar cuando se carga el DOM
document.addEventListener('DOMContentLoaded', initI18n);
