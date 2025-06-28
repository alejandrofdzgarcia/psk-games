// Cliente para conectar con la API - Optimizado para GitHub Pages
class ApiClient {
    constructor() {
        // Detectar el entorno
        this.isGitHubPages = window.location.hostname.includes('github.io');
        this.isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.includes('192.168.');
        
        // Configuración específica para GitHub Pages
        if (this.isGitHubPages) {
            // Para GitHub Pages, usamos proxies públicos como fallback
            this.apiUrls = [
                'https://api.allorigins.win/raw?url=https://psk-games-api.onrender.com',
                'https://corsproxy.io/?https://psk-games-api.onrender.com',
                'https://cors-anywhere.herokuapp.com/https://psk-games-api.onrender.com',
                // Fallback final: modo offline
                null
            ];
        } else {
            // Para desarrollo local
            this.apiUrls = [
                'http://localhost:3001', // Proxy local
                'https://psk-games-api.onrender.com', // API original
                'https://api.allorigins.win/raw?url=https://psk-games-api.onrender.com',
                null // Fallback offline
            ];
        }
        
        this.currentApiIndex = 0;
        this.baseURL = this.apiUrls[0];
        this.sessionId = this.generateSessionId();
        this.initialized = false;
        this.offlineMode = false;
        
        // Datos locales como fallback completo
        this.localData = {
            stats: { gamesPlayed: 0, wins: 0, lastPlayed: null },
            gameResults: [],
            activities: []
        };
        
        this.loadLocalData();
    }

    generateSessionId() {
        let sessionId = localStorage.getItem('psk_session_id');
        if (!sessionId) {
            sessionId = 'psk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('psk_session_id', sessionId);
        }
        return sessionId;
    }

    async makeRequest(endpoint, options = {}) {
        // Si estamos en modo offline, usar datos locales inmediatamente
        if (this.offlineMode || this.baseURL === null) {
            console.log('🔄 Usando modo offline para:', endpoint);
            return this.handleOfflineRequest(endpoint, options);
        }

        try {
            let url;
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                mode: 'cors',
                credentials: 'omit',
                ...options
            };

            // Configurar URL según el tipo de proxy
            if (this.baseURL.includes('allorigins.win')) {
                // Para AllOrigins, necesitamos formatear la URL diferente
                const targetUrl = encodeURIComponent(`https://psk-games-api.onrender.com${endpoint}`);
                url = `https://api.allorigins.win/raw?url=${targetUrl}`;
            } else if (this.baseURL.includes('corsproxy.io')) {
                // Para corsproxy.io
                url = `${this.baseURL}${endpoint}`;
            } else {
                // Para otros proxies o conexión directa
                url = `${this.baseURL}${endpoint}`;
            }

            console.log(`🌐 Intentando petición a: ${url}`);

            // Para GitHub Pages con ciertos proxies, añadir headers especiales
            if (this.isGitHubPages) {
                if (this.baseURL.includes('cors-anywhere')) {
                    config.headers['X-Requested-With'] = 'XMLHttpRequest';
                }
                // AllOrigins no necesita headers especiales
            }

            // Timeout más corto para fallar rápido
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            config.signal = controller.signal;

            const response = await fetch(url, config);
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Petición exitosa');
            return data;
            
        } catch (error) {
            console.warn(`⚠️ Error en API (${this.baseURL}):`, error.message);
            
            // Intentar con la siguiente URL disponible
            return this.tryNextApiUrl(endpoint, options, error);
        }
    }

    async tryNextApiUrl(endpoint, options, lastError) {
        this.currentApiIndex++;
        
        // Si hay más URLs disponibles, intentar con la siguiente
        if (this.currentApiIndex < this.apiUrls.length && this.apiUrls[this.currentApiIndex] !== null) {
            this.baseURL = this.apiUrls[this.currentApiIndex];
            console.log(`🔄 Intentando con siguiente API: ${this.baseURL}`);
            return this.makeRequest(endpoint, options);
        }
        
        // Si no hay más URLs, activar modo offline
        console.log('📴 Activando modo offline - usando datos locales');
        this.offlineMode = true;
        this.baseURL = null;
        
        // Mostrar notificación de modo offline
        this.showOfflineNotification();
        
        return this.handleOfflineRequest(endpoint, options);
    }

    handleOfflineRequest(endpoint, options) {
        console.log(`🔄 Manejando petición offline: ${endpoint}`);
        
        // Simular respuestas basadas en el endpoint
        if (endpoint.includes('/sessions/active')) {
            return Promise.resolve({
                sessionId: this.sessionId,
                active: true,
                offline: true,
                message: 'Sesión local activa'
            });
        }
        
        if (endpoint.includes('/games/results') && options.method === 'POST') {
            // Guardar resultado localmente
            const result = JSON.parse(options.body);
            this.localData.gameResults.push({
                ...result,
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId
            });
            this.saveLocalData();
            return Promise.resolve({ success: true, offline: true });
        }
        
        if (endpoint.includes('/stats')) {
            return Promise.resolve({
                ...this.localData.stats,
                offline: true
            });
        }
        
        // Respuesta genérica para otros endpoints
        return Promise.resolve({
            success: true,
            offline: true,
            message: 'Funcionando en modo offline'
        });
    }

    showOfflineNotification() {
        // Solo mostrar la notificación una vez por sesión
        if (!sessionStorage.getItem('offline_notification_shown')) {
            console.log('📴 MODO OFFLINE: La aplicación funcionará con datos locales');
            sessionStorage.setItem('offline_notification_shown', 'true');
            this.displayUserNotification('Modo offline activado - usando datos locales', 'info');
        }
    }

    loadLocalData() {
        try {
            const savedData = localStorage.getItem('psk_local_data');
            if (savedData) {
                this.localData = { ...this.localData, ...JSON.parse(savedData) };
            }
        } catch (error) {
            console.warn('No se pudieron cargar los datos locales:', error);
        }
    }

    saveLocalData() {
        try {
            localStorage.setItem('psk_local_data', JSON.stringify(this.localData));
        } catch (error) {
            console.warn('No se pudieron guardar los datos locales:', error);
        }
    }



    displayUserNotification(message, type = 'info') {
        // Buscar contenedor de notificaciones o crear uno temporal
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 300px;
            `;
            document.body.appendChild(notificationContainer);
        }

        const notification = document.createElement('div');
        notification.style.cssText = `
            background: ${type === 'success' ? '#4CAF50' : type === 'info' ? '#2196F3' : '#ff9800'};
            color: white;
            padding: 12px 16px;
            border-radius: 4px;
            margin-bottom: 8px;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        `;
        
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        // Animar entrada
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getFallbackData(endpoint) {
        // Datos por defecto cuando la API no está disponible
        if (endpoint.includes('/api/visitas') && !endpoint.includes('/incrementar')) {
            return {
                visitas: parseInt(localStorage.getItem('psk_visit_count') || '1234')
            };
        }
        if (endpoint.includes('/api/visitas/incrementar')) {
            const currentCount = parseInt(localStorage.getItem('psk_visit_count') || '1234');
            const newCount = currentCount + 1;
            localStorage.setItem('psk_visit_count', newCount);
            return {
                success: true,
                visitas: newCount
            };
        }
        if (endpoint.includes('/stats/visit')) {
            const currentCount = parseInt(localStorage.getItem('psk_visit_count') || '1234');
            const newCount = currentCount + 1;
            localStorage.setItem('psk_visit_count', newCount);
            return {
                success: true,
                visitCount: newCount,
                totalVisits: newCount
            };
        }
        if (endpoint.includes('/stats') && !endpoint.includes('/visit')) {
            return {
                totalVisits: parseInt(localStorage.getItem('psk_visit_count') || '1234'),
                totalGamesPlayed: parseInt(localStorage.getItem('psk_games_played') || '5678'),
                activeUsers: Math.floor(Math.random() * 5) + 1,
                gamesTypeStats: {
                    roulette: parseInt(localStorage.getItem('psk_roulette_games') || '234'),
                    custom: 0,
                    food: 0,
                    activities: 0,
                    decisions: 0,
                    colors: 0
                }
            };
        }
        if (endpoint.includes('/games/result')) {
            // Simular guardado exitoso del resultado
            const currentGames = parseInt(localStorage.getItem('psk_games_played') || '0');
            localStorage.setItem('psk_games_played', currentGames + 1);
            return {
                success: true,
                offline: true,
                message: 'Resultado guardado localmente'
            };
        }
        if (endpoint.includes('/games/roulette/popular-numbers')) {
            return {
                popularNumbers: [7, 17, 23, 32, 0, 21, 14, 9, 18, 29],
                offline: true
            };
        }
        if (endpoint.includes('/sessions/active')) {
            return {
                activeUsers: Math.floor(Math.random() * 5) + 1,
                sessionId: this.sessionId,
                offline: true
            };
        }
        if (endpoint.includes('/sessions/activity')) {
            return {
                success: true,
                offline: true,
                message: 'Actividad registrada localmente'
            };
        }
        return { 
            success: false, 
            offline: true, 
            message: 'Endpoint no disponible en modo offline' 
        };
    }

    // Métodos de la API
    
    // Métodos específicos para visitas
    async getVisitas() {
        const result = await this.makeRequest('/api/visitas');
        
        // Actualizar localStorage con los datos reales
        if (result && result.visitas) {
            localStorage.setItem('psk_visit_count', result.visitas);
        }
        
        return result;
    }

    async incrementarVisita() {
        const result = await this.makeRequest('/api/visitas/incrementar', {
            method: 'POST'
        });
        
        // Actualizar localStorage con los datos reales
        if (result && result.visitas) {
            localStorage.setItem('psk_visit_count', result.visitas);
        }
        
        return result;
    }

    // Métodos heredados (mantener compatibilidad)
    async getStats() {
        return this.makeRequest('/api/stats');
    }

    async recordVisit() {
        const result = await this.makeRequest('/api/stats/visit', {
            method: 'POST',
            body: JSON.stringify({
                sessionId: this.sessionId,
                userAgent: navigator.userAgent,
                language: localStorage.getItem('psk_language') || 'es'
            })
        });
        
        // Actualizar localStorage con los datos reales
        if (result.success && result.totalVisits) {
            localStorage.setItem('psk_visit_count', result.totalVisits);
        }
        
        return result;
    }

    async recordGameResult(gameType, result, duration = null) {
        const response = await this.makeRequest('/api/games/result', {
            method: 'POST',
            body: JSON.stringify({
                sessionId: this.sessionId,
                gameType,
                result,
                duration,
                language: localStorage.getItem('psk_language') || 'es'
            })
        });

        // Actualizar contador local si fue exitoso
        if (response.success) {
            const currentGames = parseInt(localStorage.getItem('psk_games_played') || '0');
            localStorage.setItem('psk_games_played', currentGames + 1);
            
            // Actualizar contador específico del juego
            const gameKey = `psk_${gameType}_games`;
            const currentGameCount = parseInt(localStorage.getItem(gameKey) || '0');
            localStorage.setItem(gameKey, currentGameCount + 1);
        }

        return response;
    }

    async getGameHistory(limit = 10) {
        return this.makeRequest(`/api/games/history/${this.sessionId}?limit=${limit}`);
    }

    async updateActivity(page, timeSpent = null) {
        return this.makeRequest('/api/sessions/activity', {
            method: 'POST',
            body: JSON.stringify({
                sessionId: this.sessionId,
                page,
                timeSpent
            })
        });
    }

    async getPopularNumbers() {
        return this.makeRequest('/api/games/roulette/popular-numbers');
    }

    async getActiveUsers() {
        return this.makeRequest('/api/sessions/active');
    }

    async getUserStats() {
        return this.makeRequest(`/api/stats/user/${this.sessionId}`);
    }

    // Método para inicializar la conexión con la API
    async initialize() {
        if (this.initialized) return;
        
        try {
            console.log('🔄 Inicializando conexión con API...');
            
            // Incrementar visita usando el endpoint específico
            const visitResult = await this.incrementarVisita();
            
            // Si la respuesta es del fallback, significa que hay problemas de conectividad
            if (visitResult && visitResult.visitas && !visitResult.success) {
                throw new Error('Using fallback data');
            }
            
            // Registrar visita en el sistema de sesiones (si existe)
            await this.recordVisit();
            
            // Actualizar actividad
            const currentPage = window.location.pathname.includes('ruleta') ? 'roulette' : 'home';
            await this.updateActivity(currentPage);
            
            this.initialized = true;
            console.log('✅ API Client inicializado correctamente - Conectado al servidor');
            this.displayUserNotification('Conectado al servidor - Estadísticas en tiempo real', 'success');
            
        } catch (error) {
            console.log('⚠️ API no disponible, usando datos locales');
            this.initialized = true; // Marcar como inicializado aunque sea en modo offline
        }
    }

    // Método para obtener el color en texto según el valor hex
    getColorName(hexColor) {
        switch (hexColor) {
            case '#00AA00':
                return 'VERDE';
            case '#DC143C':
                return 'ROJO';
            case '#1A1A1A':
                return 'NEGRO';
            default:
                return 'DESCONOCIDO';
        }
    }
}

// Crear instancia global
window.apiClient = new ApiClient();

// Inicializar automáticamente cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.apiClient.initialize();
});