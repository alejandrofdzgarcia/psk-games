class Tateti {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameMode = 'pvp'; // 'pvp' o 'pvc'
        this.difficulty = 'medium';
        this.gameActive = true;
        this.soundEnabled = true;
        this.animationsEnabled = true;
        
        // Estadísticas
        this.stats = {
            scoreX: 0,
            scoreO: 0,
            draws: 0,
            totalGames: 0
        };
        
        // Combinaciones ganadoras
        this.winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
            [0, 4, 8], [2, 4, 6] // Diagonales
        ];
        
        this.initGame();
        this.loadStats();
    }
    
    initGame() {
        this.setupEventListeners();
        this.updateDisplay();
        this.showMessage('¡Listo! Jugador X comienza', 'info');
        
        // Registrar actividad en API
        if (window.apiClient) {
            window.apiClient.updateActivity('tateti');
        }
    }
    
    setupEventListeners() {
        // Células del tablero
        const cells = document.querySelectorAll('.tateti-cell');
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        // Botones de control
        document.getElementById('restart-game').addEventListener('click', () => this.restartGame());
        document.getElementById('reset-scores').addEventListener('click', () => this.resetScores());
        
        // Configuración
        document.getElementById('game-mode-select').addEventListener('change', (e) => {
            this.gameMode = e.target.value;
            this.restartGame();
        });
        
        document.getElementById('difficulty-select').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });
        
        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
        });
        
        document.getElementById('animations-toggle').addEventListener('change', (e) => {
            this.animationsEnabled = e.target.checked;
        });
    }
    
    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== '') return;
        
        this.makeMove(index, this.currentPlayer);
        
        if (this.gameActive && this.gameMode === 'pvc' && this.currentPlayer === 'O') {
            setTimeout(() => this.computerMove(), 500);
        }
    }
    
    makeMove(index, player) {
        this.board[index] = player;
        const cell = document.querySelector(`[data-index="${index}"]`);
        
        // Actualizar visualmente
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        
        // Animación
        if (this.animationsEnabled) {
            cell.classList.add(`animate-${player.toLowerCase()}`);
            setTimeout(() => {
                cell.classList.remove(`animate-${player.toLowerCase()}`);
            }, 500);
        }
        
        // Sonido
        if (this.soundEnabled) {
            this.playSound(player);
        }
        
        // Verificar resultado
        const result = this.checkGameResult();
        if (result) {
            this.endGame(result);
        } else {
            this.switchPlayer();
        }
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateCurrentPlayerDisplay();
        
        if (this.gameMode === 'pvp') {
            this.showMessage(`Turno del Jugador ${this.currentPlayer}`, 'info');
        } else if (this.currentPlayer === 'X') {
            this.showMessage('Tu turno', 'info');
        } else {
            this.showMessage('Turno de la computadora...', 'info');
        }
    }
    
    computerMove() {
        if (!this.gameActive) return;
        
        let move;
        switch (this.difficulty) {
            case 'easy':
                move = this.getRandomMove();
                break;
            case 'medium':
                move = this.getMediumMove();
                break;
            case 'hard':
                move = this.getBestMove();
                break;
        }
        
        if (move !== -1) {
            this.makeMove(move, 'O');
        }
    }
    
    getRandomMove() {
        const availableMoves = this.board
            .map((cell, index) => cell === '' ? index : null)
            .filter(val => val !== null);
        
        return availableMoves.length > 0 
            ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
            : -1;
    }
    
    getMediumMove() {
        // 50% probabilidad de jugar óptimo, 50% aleatorio
        return Math.random() < 0.5 ? this.getBestMove() : this.getRandomMove();
    }
    
    getBestMove() {
        // Algoritmo minimax simplificado
        
        // 1. Ganar si es posible
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                if (this.checkWinner() === 'O') {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // 2. Bloquear al jugador si va a ganar
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'X';
                if (this.checkWinner() === 'X') {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // 3. Tomar el centro si está disponible
        if (this.board[4] === '') return 4;
        
        // 4. Tomar una esquina
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // 5. Movimiento aleatorio
        return this.getRandomMove();
    }
    
    checkGameResult() {
        const winner = this.checkWinner();
        if (winner) return { type: 'win', winner };
        
        if (this.board.every(cell => cell !== '')) {
            return { type: 'draw' };
        }
        
        return null;
    }
    
    checkWinner() {
        for (const condition of this.winConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return this.board[a];
            }
        }
        return null;
    }
    
    endGame(result) {
        this.gameActive = false;
        
        if (result.type === 'win') {
            this.highlightWinningCells();
            
            if (result.winner === 'X') {
                this.stats.scoreX++;
                this.showMessage('¡Jugador X gana! 🎉', 'success');
            } else {
                this.stats.scoreO++;
                const message = this.gameMode === 'pvc' ? '¡La computadora gana! 🤖' : '¡Jugador O gana! 🎉';
                this.showMessage(message, 'success');
            }
            
            if (this.soundEnabled) {
                this.playWinSound();
            }
        } else {
            this.stats.draws++;
            this.showMessage('¡Empate! 🤝', 'warning');
            
            if (this.animationsEnabled) {
                this.shakeBoard();
            }
        }
        
        this.stats.totalGames++;
        this.updateDisplay();
        this.saveStats();
    }
    
    highlightWinningCells() {
        for (const condition of this.winConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                [a, b, c].forEach(index => {
                    document.querySelector(`[data-index="${index}"]`).classList.add('winner');
                });
                break;
            }
        }
    }
    
    shakeBoard() {
        const board = document.querySelector('.tateti-board');
        board.classList.add('shake');
        setTimeout(() => board.classList.remove('shake'), 500);
    }
    
    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Limpiar tablero visual
        const cells = document.querySelectorAll('.tateti-cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'tateti-cell';
        });
        
        this.updateCurrentPlayerDisplay();
        this.showMessage('¡Nueva partida! Jugador X comienza', 'info');
    }
    
    resetScores() {
        this.stats = {
            scoreX: 0,
            scoreO: 0,
            draws: 0,
            totalGames: 0
        };
        
        this.updateDisplay();
        this.saveStats();
        this.showMessage('Puntuaciones reiniciadas', 'info');
    }
    
    updateDisplay() {
        document.getElementById('current-player').textContent = this.currentPlayer;
        document.getElementById('score-x').textContent = this.stats.scoreX;
        document.getElementById('score-o').textContent = this.stats.scoreO;
        document.getElementById('draws').textContent = this.stats.draws;
        document.getElementById('total-games').textContent = this.stats.totalGames;
        
        // Calcular porcentaje de victoria
        const totalWins = this.stats.scoreX + this.stats.scoreO;
        const winRate = this.stats.totalGames > 0 
            ? Math.round((totalWins / this.stats.totalGames) * 100)
            : 0;
        document.getElementById('win-rate').textContent = `${winRate}%`;
    }
    
    updateCurrentPlayerDisplay() {
        document.getElementById('current-player').textContent = this.currentPlayer;
    }
    
    showMessage(text, type = 'info') {
        const messageEl = document.getElementById('game-message');
        messageEl.textContent = text;
        messageEl.className = `game-message ${type}`;
        
        setTimeout(() => {
            messageEl.textContent = '';
            messageEl.className = 'game-message';
        }, 3000);
    }
    
    playSound(player) {
        // Simular sonido con Web Audio API o usar archivos de audio
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const frequency = player === 'X' ? 800 : 600;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            console.log('Audio no disponible');
        }
    }
    
    playWinSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const frequencies = [523, 659, 784]; // Do, Mi, Sol
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                }, index * 200);
            });
        } catch (error) {
            console.log('Audio no disponible');
        }
    }
    
    saveStats() {
        localStorage.setItem('tateti_stats', JSON.stringify(this.stats));
    }
    
    loadStats() {
        const saved = localStorage.getItem('tateti_stats');
        if (saved) {
            this.stats = { ...this.stats, ...JSON.parse(saved) };
        }
        this.updateDisplay();
    }
}

// Función para mostrar/ocultar configuración
function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    panel.classList.toggle('active');
}

// Función para volver al menú
function volverAlMenu() {
    window.location.href = 'index.html';
}

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.tatetiGame = new Tateti();
});