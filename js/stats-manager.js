// Funciones para mostrar estadísticas avanzadas desde la API
class StatsManager {
    constructor() {
        this.updateInterval = null;
        this.isVisible = false;
    }

    // Método para mostrar números más populares de la ruleta
    async showPopularNumbers() {
        try {
            const popularNumbers = await window.apiClient.getPopularNumbers();
            
            if (popularNumbers && popularNumbers.length > 0) {
                const topNumbers = popularNumbers.slice(0, 5);
                const numbersText = topNumbers.map(num => 
                    `${num._id}: ${num.count} veces`
                ).join(', ');
                
                console.log('🎯 Números más salidos:', numbersText);
                
                // Mostrar en un elemento si existe
                const statsElement = document.getElementById('popular-numbers');
                if (statsElement) {
                    statsElement.innerHTML = `
                        <h3>🎯 Números más salidos:</h3>
                        <ul>
                            ${topNumbers.map(num => `
                                <li>${num._id} (${num.color || 'N/A'}): ${num.count} veces</li>
                            `).join('')}
                        </ul>
                    `;
                }
            }
        } catch (error) {
            console.log('No se pudieron cargar los números populares');
        }
    }

    // Método para mostrar estadísticas de usuario
    async showUserStats() {
        try {
            const userStats = await window.apiClient.getUserStats();
            
            if (userStats) {
                console.log('👤 Tus estadísticas:', {
                    visitas: userStats.visitCount,
                    juegosJugados: userStats.gamesPlayed,
                    idioma: userStats.language,
                    ultimaActividad: userStats.lastActivity
                });
            }
        } catch (error) {
            console.log('No se pudieron cargar las estadísticas de usuario');
        }
    }

    // Actualizar estadísticas en tiempo real
    startRealTimeUpdates() {
        if (this.updateInterval) return;
        
        this.updateInterval = setInterval(async () => {
            try {
                // Actualizar usuarios activos
                const activeData = await window.apiClient.getActiveUsers();
                if (activeData && activeData.activeUsers) {
                    const onlineElement = document.getElementById('online-counter');
                    if (onlineElement) {
                        onlineElement.textContent = activeData.activeUsers;
                    }
                }

                // Actualizar estadísticas generales
                const stats = await window.apiClient.getStats();
                if (stats) {
                    const visitElement = document.getElementById('visit-counter');
                    if (visitElement && stats.totalVisits) {
                        visitElement.textContent = stats.totalVisits.toLocaleString();
                    }
                }
            } catch (error) {
                // Continuar silenciosamente si hay errores
            }
        }, 30000); // Actualizar cada 30 segundos
    }

    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Mostrar panel de estadísticas avanzadas
    async showAdvancedStats() {
        if (this.isVisible) {
            this.hideAdvancedStats();
            return;
        }

        try {
            const [stats, userStats, popularNumbers] = await Promise.all([
                window.apiClient.getStats(),
                window.apiClient.getUserStats(),
                window.apiClient.getPopularNumbers()
            ]);

            const panel = document.createElement('div');
            panel.id = 'advanced-stats-panel';
            panel.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 10px;
                z-index: 10000;
                max-width: 300px;
                font-family: Arial, sans-serif;
                font-size: 12px;
                border: 2px solid #DAA520;
            `;

            panel.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: #DAA520;">📊 Estadísticas</h3>
                    <button onclick="window.statsManager.hideAdvancedStats()" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer;">✕</button>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <h4 style="margin: 5px 0; color: #FFD700;">🌍 Globales</h4>
                    <p>Visitas totales: ${stats.totalVisits?.toLocaleString() || 'N/A'}</p>
                    <p>Juegos jugados: ${stats.totalGamesPlayed?.toLocaleString() || 'N/A'}</p>
                    <p>Usuarios activos: ${stats.activeUsers || 'N/A'}</p>
                </div>

                ${userStats ? `
                <div style="margin-bottom: 15px;">
                    <h4 style="margin: 5px 0; color: #87CEEB;">👤 Tuyas</h4>
                    <p>Tus visitas: ${userStats.visitCount || 'N/A'}</p>
                    <p>Tus juegos: ${userStats.gamesPlayed || 'N/A'}</p>
                    <p>Idioma: ${userStats.language === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}</p>
                </div>
                ` : ''}

                ${popularNumbers && popularNumbers.length > 0 ? `
                <div>
                    <h4 style="margin: 5px 0; color: #FF6347;">🎯 Top Números</h4>
                    ${popularNumbers.slice(0, 3).map(num => `
                        <p>${num._id}: ${num.count} veces</p>
                    `).join('')}
                </div>
                ` : ''}
            `;

            document.body.appendChild(panel);
            this.isVisible = true;

        } catch (error) {
            console.log('Error mostrando estadísticas avanzadas:', error);
        }
    }

    hideAdvancedStats() {
        const panel = document.getElementById('advanced-stats-panel');
        if (panel) {
            panel.remove();
            this.isVisible = false;
        }
    }
}

// Crear instancia global
window.statsManager = new StatsManager();

// Funciones de conveniencia globales
window.showStats = () => window.statsManager.showAdvancedStats();
window.showPopularNumbers = () => window.statsManager.showPopularNumbers();

// Inicializar actualizaciones en tiempo real cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para que la API se inicialice
    setTimeout(() => {
        if (window.apiClient && window.apiClient.initialized) {
            window.statsManager.startRealTimeUpdates();
        }
    }, 2000);
});

// Atajo de teclado para mostrar estadísticas (Ctrl + S)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        window.statsManager.showAdvancedStats();
    }
});
