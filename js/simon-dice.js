class SimonDice {
    constructor() {
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('simon_best_score') || '0');
        this.isPlaying = false;
        this.isShowingSequence = false;
        this.currentSequenceIndex = 0;
        this.gameStarted = false;
        
        // Configuración
        this.settings = {
            difficulty: 'normal',
            soundEnabled: true,
            speed: 3
        };
        
        // Colores y sonidos
        this.colors = ['red', 'blue', 'green', 'yellow'];
        this.audioContext = null;
        this.sounds = {};
        
        this.initializeGame();
        this.loadSettings();
        this.updateDisplay();
        this.initializeAudio();
    }

    initializeGame() {
        // Referencias a elementos DOM
        this.buttons = document.querySelectorAll('.simon-button');
        this.startButton = document.getElementById('start-game');
        this.resetButton = document.getElementById('reset-game');
        this.levelDisplay = document.getElementById('level-display');
        this.scoreDisplay = document.getElementById('score-display');
        this.bestScoreDisplay = document.getElementById('best-score');
        this.gameMessage = document.getElementById('game-message');
        this.settingsPanel = document.getElementById('settings-panel');
        
        // Event listeners
        this.buttons.forEach((button, index) => {
            button.addEventListener('click', () => this.handleButtonClick(index));
        });
        
        this.startButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.resetGame());
        
        // Configuración
        document.getElementById('difficulty-select').addEventListener('change', (e) => {
            this.settings.difficulty = e.target.value;
            this.saveSettings();
        });
        
        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            this.settings.soundEnabled = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('speed-slider').addEventListener('input', (e) => {
            this.settings.speed = parseInt(e.target.value);
            this.saveSettings();
        });

        // Actualizar estado de conexión
        this.updateConnectionStatus();
    }

    async initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Crear sonidos sintéticos para cada botón
            this.sounds = {
                0: this.createTone(261.63), // Do
                1: this.createTone(329.63), // Mi
                2: this.createTone(392.00), // Sol
                3: this.createTone(523.25)  // Do alto
            };
        } catch (error) {
            console.warn('Audio no disponible:', error);
            this.settings.soundEnabled = false;
        }
    }

    createTone(frequency) {
        return () => {
            if (!this.audioContext || !this.settings.soundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.5);
        };
    }

    playSound(buttonIndex) {
        if (this.sounds[buttonIndex] && this.settings.soundEnabled) {
            this.sounds[buttonIndex]();
        }
    }

    startGame() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.gameStarted = true;
        this.isPlaying = true;
        this.sequence = [];
        this.level = 1;
        this.score = 0;
        this.updateDisplay();
        this.showMessage('Comenzando...', 'info');
        
        this.startButton.disabled = true;
        this.disableButtons();
        
        setTimeout(() => {
            this.addToSequence();
            this.showSequence();
        }, 1000);

        // Registrar inicio de juego en la API
        this.recordGameStart();
    }

    addToSequence() {
        const randomButton = Math.floor(Math.random() * 4);
        this.sequence.push(randomButton);
    }

    async showSequence() {
        this.isShowingSequence = true;
        this.currentSequenceIndex = 0;
        this.showMessage('Observa la secuencia...', 'info');
        
        const delay = this.getSequenceDelay();
        
        for (let i = 0; i < this.sequence.length; i++) {
            await this.wait(delay);
            await this.lightButton(this.sequence[i]);
        }
        
        this.isShowingSequence = false;
        this.enableButtons();
        this.playerSequence = [];
        this.showMessage('Tu turno...', 'success');
    }

    async lightButton(buttonIndex) {
        const button = this.buttons[buttonIndex];
        button.classList.add('lit', 'pulse');
        this.playSound(buttonIndex);
        
        await this.wait(400);
        
        button.classList.remove('lit', 'pulse');
        await this.wait(200);
    }

    handleButtonClick(buttonIndex) {
        if (!this.isPlaying || this.isShowingSequence) return;
        
        this.playSound(buttonIndex);
        this.lightButton(buttonIndex);
        this.playerSequence.push(buttonIndex);
        
        // Verificar si la secuencia es correcta
        const currentIndex = this.playerSequence.length - 1;
        
        if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
            this.gameOver();
            return;
        }
        
        // Si completó la secuencia correctamente
        if (this.playerSequence.length === this.sequence.length) {
            this.score += this.level * this.getDifficultyMultiplier();
            this.level++;
            this.updateDisplay();
            
            this.disableButtons();
            this.showMessage('¡Correcto!', 'success');
            
            setTimeout(() => {
                this.addToSequence();
                this.showSequence();
            }, 1500);
        }
    }

    gameOver() {
        this.isPlaying = false;
        this.gameStarted = false;
        this.disableButtons();
        
        const message =  `¡Juego terminado! Llegaste al nivel ${this.level}`;
        
        this.showMessage(message, 'error');
        
        // Actualizar mejor puntuación
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('simon_best_score', this.bestScore.toString());
            this.updateDisplay();
            
            setTimeout(() => {
                this.showMessage('¡Nueva mejor puntuación!', 'success');
            }, 2000);
        }
        
        this.startButton.disabled = false;
        this.updateHighScores();
        this.recordGameResult();
    }

    resetGame() {
        this.isPlaying = false;
        this.gameStarted = false;
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        this.updateDisplay();
        this.enableButtons();
        this.startButton.disabled = false;
        this.showMessage('', '');
        
        // Quitar cualquier iluminación
        this.buttons.forEach(button => {
            button.classList.remove('lit', 'pulse');
        });
    }

    enableButtons() {
        this.buttons.forEach(button => {
            button.classList.remove('disabled');
        });
    }

    disableButtons() {
        this.buttons.forEach(button => {
            button.classList.add('disabled');
        });
    }

    updateDisplay() {
        this.levelDisplay.textContent = this.level;
        this.scoreDisplay.textContent = this.score;
        this.bestScoreDisplay.textContent = this.bestScore;
    }

    showMessage(text, type) {
        this.gameMessage.textContent = text;
        this.gameMessage.className = `game-message ${type}`;
    }

    getSequenceDelay() {
        const baseDelay = 1000;
        const speedMultiplier = (6 - this.settings.speed) * 0.2;
        const difficultyMultiplier = this.settings.difficulty === 'easy' ? 1.5 : 
                                    this.settings.difficulty === 'hard' ? 0.7 : 1;
        
        return Math.max(300, baseDelay * speedMultiplier * difficultyMultiplier);
    }

    getDifficultyMultiplier() {
        return this.settings.difficulty === 'easy' ? 1 : 
               this.settings.difficulty === 'hard' ? 3 : 2;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    saveSettings() {
        localStorage.setItem('simon_settings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('simon_settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        
        // Aplicar configuración a los controles
        document.getElementById('difficulty-select').value = this.settings.difficulty;
        document.getElementById('sound-toggle').checked = this.settings.soundEnabled;
        document.getElementById('speed-slider').value = this.settings.speed;
    }

    updateHighScores() {
        const scores = JSON.parse(localStorage.getItem('simon_high_scores') || '[]');
        scores.push({
            score: this.score,
            level: this.level,
            date: new Date().toLocaleDateString()
        });
        
        scores.sort((a, b) => b.score - a.score);
        const topScores = scores.slice(0, 5);
        localStorage.setItem('simon_high_scores', JSON.stringify(topScores));
        
        this.displayHighScores(topScores);
    }

    displayHighScores(scores) {
        const container = document.getElementById('high-scores-list');
        container.innerHTML = '';
        
        if (scores.length === 0) {
            container.innerHTML = '<p>No hay puntuaciones registradas</p>';
            return;
        }
        
        scores.forEach((score, index) => {
            const scoreElement = document.createElement('div');
            scoreElement.className = 'score-item';
            scoreElement.innerHTML = `
                <span>#${index + 1}</span>
                <span>Nivel ${score.level}</span>
                <span>${score.score} pts</span>
            `;
            container.appendChild(scoreElement);
        });
    }

    updateConnectionStatus() {
        const statusIcon = document.getElementById('status-icon');
        const statusText = document.getElementById('status-text');
        const statusContainer = document.getElementById('connection-status');
        
        if (window.apiClient && !window.apiClient.offlineMode) {
            statusIcon.textContent = '🟢';
            statusText.textContent = 'En línea';
            statusContainer.className = 'connection-status online';
        } else {
            statusIcon.textContent = '🔴';
            statusText.textContent ='Modo offline';
            statusContainer.className = 'connection-status offline';
        }
    }

    async recordGameStart() {
        try {
            if (window.apiClient) {
                await window.apiClient.updateActivity('simon-dice');
            }
        } catch (error) {
            console.log('No se pudo registrar el inicio del juego');
        }
    }

    async recordGameResult() {
        try {
            if (window.apiClient) {
                await window.apiClient.recordGameResult('simon-dice', {
                    level: this.level,
                    score: this.score,
                    difficulty: this.settings.difficulty
                });
            }
        } catch (error) {
            console.log('No se pudo registrar el resultado del juego');
        }
    }
}

// Función para mostrar/ocultar configuración
function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    panel.classList.toggle('active');
}

// Función para volver al menú (usar la existente)
function volverAlMenu() {
    window.location.href = 'index.html';
}

// Inicializar el juego cuando se carga la página
let simonGame;

document.addEventListener('DOMContentLoaded', () => {
    simonGame = new SimonDice();
    
    // Cargar y mostrar puntuaciones altas
    const highScores = JSON.parse(localStorage.getItem('simon_high_scores') || '[]');
    simonGame.displayHighScores(highScores);
});