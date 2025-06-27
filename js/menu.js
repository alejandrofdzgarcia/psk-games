// Funciones globales definidas al inicio para estar disponibles inmediatamente
function changeLanguage(lang) {
    // Aquí se integraría con el sistema i18n existente
    if (window.i18n && typeof window.i18n.setLanguage === 'function') {
        window.i18n.setLanguage(lang);
    }
    localStorage.setItem('psk_language', lang);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    const menuInstance = window.menuInstance;
    if (menuInstance) {
        menuInstance.setTheme(newTheme);
    }
}

function navigateTo(page) {
    // Incrementar contador de juegos jugados
    let gamesPlayed = parseInt(localStorage.getItem('psk_games_played') || '1234');
    gamesPlayed++;
    localStorage.setItem('psk_games_played', gamesPlayed);
    
    // Efecto de transición mejorado
    document.body.style.transition = 'all 0.5s ease';
    document.body.style.transform = 'scale(0.95)';
    document.body.style.opacity = '0.7';
    
    setTimeout(() => {
        window.location.href = page;
    }, 300);
}

if (!window.apiClient) {
    // Fallback si no se carga el API client
    window.apiClient = {
        recordVisit: () => Promise.resolve({}),
        getStats: () => Promise.resolve({
            totalVisits: parseInt(localStorage.getItem('psk_visit_count') || '1234'),
            totalGamesPlayed: parseInt(localStorage.getItem('psk_games_played') || '5678'),
            activeUsers: Math.floor(Math.random() * 5) + 1
        }),
        updateActivity: () => Promise.resolve({})
    };
}

class MenuPrincipal {
    constructor() {
        this.initApiClient();
        this.visitCount = this.getVisitCount();
        this.updateVisitCounter();
        this.initEventListeners();
        this.initAnimations();
        this.createFloatingParticles();
        this.initTheme();
        this.simulateOnlineUsers();
        this.loadStatsFromAPI();
    }

    async initApiClient() {
        // Registrar visita en la API
        try {
            await window.apiClient.recordVisit();
            await window.apiClient.updateActivity('home');
        } catch (error) {
            console.log('API no disponible, usando datos locales');
        }
    }

    async loadStatsFromAPI() {
        try {
            // Obtener visitas del endpoint específico
            const visitasData = await window.apiClient.getVisitas();
            
            if (visitasData && visitasData.visitas) {
                document.getElementById('visit-counter').textContent = visitasData.visitas.toLocaleString();
            }

            // Obtener otras estadísticas si existen
            try {
                const stats = await window.apiClient.getStats();
                
                // Actualizar usuarios online
                if (stats.activeUsers) {
                    document.getElementById('online-counter').textContent = stats.activeUsers;
                }
                
                // Actualizar juegos jugados si existe el elemento
                const gamesElement = document.querySelector('[data-stat="games"]');
                if (gamesElement && stats.totalGamesPlayed) {
                    gamesElement.textContent = stats.totalGamesPlayed.toLocaleString();
                }
            } catch (statsError) {
                console.log('Estadísticas adicionales no disponibles');
            }
        } catch (error) {
            console.log('Usando estadísticas locales');
        }
    }

    // Contador de visitas
    getVisitCount() {
        let count = localStorage.getItem('psk_visit_count');
        if (!count) {
            count = Math.floor(Math.random() * 500) + 100; // Número inicial aleatorio
            localStorage.setItem('psk_visit_count', count);
        }
        return parseInt(count);
    }

    updateVisitCounter() {
        this.visitCount++;
        localStorage.setItem('psk_visit_count', this.visitCount);
        document.getElementById('visit-counter').textContent = this.visitCount.toLocaleString();
    }

    // Simular usuarios en línea
    simulateOnlineUsers() {
        const updateOnlineCount = () => {
            const baseCount = Math.floor(Math.random() * 5) + 1;
            document.getElementById('online-counter').textContent = baseCount;
        };
        
        updateOnlineCount();
        setInterval(updateOnlineCount, 30000); // Actualizar cada 30 segundos
    }

    // Sistema de temas
    initTheme() {
        const savedTheme = localStorage.getItem('psk_theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('psk_theme', theme);
        
        const icon = document.getElementById('theme-icon');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    initEventListeners() {
        // Agregar eventos de hover para efectos adicionales
        const cards = document.querySelectorAll('.menu-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', this.onCardHover.bind(this));
            card.addEventListener('mouseleave', this.onCardLeave.bind(this));
        });

        // Efecto de paralaje suave al scroll
        window.addEventListener('scroll', this.onScroll.bind(this));

        // Efectos de sonido (simulado)
        cards.forEach(card => {
            card.addEventListener('click', this.onCardClick.bind(this));
        });
    }

    onCardHover(event) {
        // Efecto de brillo en hover
        event.currentTarget.style.boxShadow = '0 20px 60px rgba(255, 255, 255, 0.15)';
        
        // Efecto de vibración sutil
        event.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
    }

    onCardLeave(event) {
        // Restaurar estilos originales
        event.currentTarget.style.boxShadow = '';
        event.currentTarget.style.transform = '';
    }

    onCardClick(event) {
        // Efecto visual al hacer clic
        const card = event.currentTarget;
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }

    onScroll() {
        // Efecto parallax mejorado
        const scrolled = window.pageYOffset;
        const cards = document.querySelectorAll('.menu-card');
        
        cards.forEach((card, index) => {
            const rate = scrolled * -0.05 * (index % 2 === 0 ? 1 : -1);
            card.style.transform = `translateY(${rate}px)`;
        });

        // Efecto parallax para las partículas
        const particles = document.querySelectorAll('.floating-particle');
        particles.forEach((particle, index) => {
            const rate = scrolled * 0.02 * (index % 3);
            particle.style.transform = `translateY(${rate}px)`;
        });
    }

    initAnimations() {
        // Animación de entrada progresiva para las cards
        const cards = document.querySelectorAll('.menu-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });

        // Animación del header
        const title = document.querySelector('h1');
        const subtitle = document.querySelector('.subtitle');
        const statsBar = document.querySelector('.stats-banner');

        [title, subtitle, statsBar].forEach((element, index) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(-30px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.8s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100 + (index * 200));
            }
        });

        // Animación de los controles superiores
        const topControls = document.querySelector('.top-controls');
        if (topControls) {
            topControls.style.opacity = '0';
            topControls.style.transform = 'translateX(50px)';
            
            setTimeout(() => {
                topControls.style.transition = 'all 0.6s ease';
                topControls.style.opacity = '1';
                topControls.style.transform = 'translateX(0)';
            }, 500);
        }
    }

    createFloatingParticles() {
        const container = document.querySelector('.floating-particles');
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            // Posición aleatoria
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            
            // Tamaño y opacidad aleatoria
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            
            container.appendChild(particle);
        }
    }
}

// Actualizar estadísticas del footer
function updateFooterStats() {
    const gamesPlayed = localStorage.getItem('psk_games_played') || '1,234';
    const totalUsers = Math.floor(Math.random() * 100) + 500;
    const favorites = Math.floor(Math.random() * 50) + 50;
    
    const gamesElement = document.getElementById('games-played');
    const usersElement = document.getElementById('total-users');
    const favoritesElement = document.getElementById('favorites');
    
    if (gamesElement) gamesElement.textContent = parseInt(gamesPlayed).toLocaleString();
    if (usersElement) usersElement.textContent = totalUsers.toLocaleString();
    if (favoritesElement) favoritesElement.textContent = favorites.toLocaleString();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.menuInstance = new MenuPrincipal();
    updateFooterStats();
    
    // Actualizar estadísticas cada 60 segundos
    setInterval(updateFooterStats, 60000);
    
    // Cargar idioma guardado
    const savedLanguage = localStorage.getItem('psk_language');
    if (savedLanguage) {
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = savedLanguage;
        }
    }
    
    // Mensaje de bienvenida
    console.log('🎯 Bienvenido a Ruleta de la Suerte!');
    console.log('Navega por las diferentes opciones para encontrar tu ruleta ideal.');
});

// CSS para partículas flotantes
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }
    
    .floating-particle {
        animation-delay: ${Math.random() * 3}s !important;
    }
`;
document.head.appendChild(style);

// Función para volver al menú principal (útil para otras páginas)
function volverAlMenu() {
    window.location.href = 'index.html';
}

// Función para navegación a ruletas personalizadas (maneja las opciones en desarrollo)
function navigateToCustom(page) {
    const pageType = page.replace('.html', '');
    
    // Configuraciones predefinidas para cada tipo de ruleta
    const ruletaConfigs = {
        'ruleta-personalizada': {
            title: 'Ruleta Personalizada',
            options: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6'],
            allowCustomOptions: true,
            colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']
        },
        'ruleta-comida': {
            title: 'Ruleta de Comida',
            options: ['🍕 Pizza', '🍔 Hamburguesa', '🌮 Tacos', '🍣 Sushi', '🍝 Pasta', '🥗 Ensalada', '🍗 Pollo', '🐟 Pescado'],
            allowCustomOptions: true,
            colors: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#26de81']
        },
        'ruleta-actividades': {
            title: 'Ruleta de Actividades',
            options: ['📺 Ver Netflix', '📖 Leer un libro', '🏃 Hacer ejercicio', '🍳 Cocinar', '🎮 Videojuegos', '🚶 Pasear', '📞 Llamar a un amigo', '📚 Estudiar'],
            allowCustomOptions: true,
            colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#6c5ce7', '#fd79a8']
        },
        'ruleta-decisiones': {
            title: 'Ruleta de Decisiones',
            options: ['✅ Sí', '❌ No', '🤔 Tal vez', '🚫 Mejor no', '💯 Definitivamente', '⏰ Espera un poco', '📅 Pregunta mañana', '🎯 Es posible'],
            allowCustomOptions: false,
            colors: ['#00b894', '#e17055', '#fdcb6e', '#e84393', '#6c5ce7', '#74b9ff', '#fd79a8', '#55a3ff']
        },
        'ruleta-colores': {
            title: 'Ruleta de Colores',
            options: ['🔴 Rojo', '🔵 Azul', '🟢 Verde', '🟡 Amarillo', '🟠 Naranja', '🟣 Violeta', '🩷 Rosa', '🩵 Turquesa'],
            allowCustomOptions: false,
            colors: ['#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ff8c00', '#8a2be2', '#ff69b4', '#40e0d0']
        }
    };

    const config = ruletaConfigs[pageType];
    
    if (config) {
        // Mostrar preview de la configuración
        const preview = `
🎲 ${config.title}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Opciones disponibles:
${config.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}

🎨 ${config.allowCustomOptions ? 'Puedes añadir opciones personalizadas' : 'Opciones fijas'}
🎯 ${config.options.length} opciones disponibles

⚡ ¡Esta funcionalidad estará disponible pronto!
        `;
        
        alert(preview);
        
        // Incrementar contador
        let gamesPlayed = parseInt(localStorage.getItem('psk_games_played') || '1234');
        gamesPlayed++;
        localStorage.setItem('psk_games_played', gamesPlayed);
        
        console.log(`Configuración para ${pageType}:`, config);
    }
}
