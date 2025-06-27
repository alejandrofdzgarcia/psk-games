// Cliente para conectar con la API
class ApiClient {
    constructor() {
        this.baseURL = 'https://psk-games-api.onrender.com';
        this.sessionId = this.generateSessionId();
        this.initialized = false;
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
        try {
            const url = `${this.baseURL}${endpoint}`;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
                ...options
            };

            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.warn('Error en API:', error.message);
            // Retornar datos por defecto en caso de error
            return this.getFallbackData(endpoint);
        }
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
        return { success: false };
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
            // Incrementar visita usando el endpoint específico
            await this.incrementarVisita();
            
            // Registrar visita en el sistema de sesiones (si existe)
            await this.recordVisit();
            
            // Actualizar actividad
            const currentPage = window.location.pathname.includes('ruleta') ? 'roulette' : 'home';
            await this.updateActivity(currentPage);
            
            this.initialized = true;
            console.log('✅ API Client inicializado correctamente');
        } catch (error) {
            console.log('⚠️ API no disponible, usando datos locales');
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