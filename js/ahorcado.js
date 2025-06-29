class Ahorcado {
    constructor() {
        this.currentWord = '';
        this.guessedWord = '';
        this.guessedLetters = [];
        this.wrongGuesses = 0;
        this.maxWrongGuesses = 6;
        this.score = 0;
        this.level = 1;
        this.gameActive = false;
        this.hintUsed = false;
        this.currentCategory = 'animals';
        this.difficulty = 'medium';
        this.soundEnabled = true;
        this.animationsEnabled = true;
        this.hintsAvailable = 3;
        
        // Estadísticas
        this.stats = {
            wordsGuessed: 0,
            totalWords: 0,
            bestScore: 0,
            currentStreak: 0,
            bestStreak: 0
        };
        
        // Palabras por categoría y dificultad
        this.words = {
            animals: {
                easy: [
                    { word: 'PERRO', hint: 'Mejor amigo del hombre' },
                    { word: 'GATO', hint: 'Mascota que hace miau' },
                    { word: 'PATO', hint: 'Ave acuática que hace cuac' },
                    { word: 'LEON', hint: 'Rey de la selva' },
                    { word: 'OSO', hint: 'Animal grande que hiberna' }
                ],
                medium: [
                    { word: 'ELEFANTE', hint: 'Animal más grande de la tierra' },
                    { word: 'JIRAFA', hint: 'Animal con cuello muy largo' },
                    { word: 'COCODRILO', hint: 'Reptil del agua con dientes afilados' },
                    { word: 'RINOCERONTE', hint: 'Animal con cuerno en la nariz' },
                    { word: 'HIPOPOTAMO', hint: 'Animal grande que vive en ríos africanos' }
                ],
                hard: [
                    { word: 'QUETZAL', hint: 'Ave tropical de colores brillantes' },
                    { word: 'ORNITORRINCO', hint: 'Mamífero que pone huevos' },
                    { word: 'AXOLOTL', hint: 'Anfibio mexicano en peligro de extinción' },
                    { word: 'PANGOLIN', hint: 'Mamífero cubierto de escamas' },
                    { word: 'OKAPI', hint: 'Pariente de la jirafa con rayas' }
                ]
            },
            countries: {
                easy: [
                    { word: 'ESPAÑA', hint: 'País europeo famoso por el flamenco' },
                    { word: 'ITALIA', hint: 'País con forma de bota' },
                    { word: 'MEXICO', hint: 'País al sur de Estados Unidos' },
                    { word: 'BRASIL', hint: 'País más grande de Sudamérica' },
                    { word: 'JAPON', hint: 'País del sol naciente' }
                ],
                medium: [
                    { word: 'ARGENTINA', hint: 'País del tango y el mate' },
                    { word: 'ALEMANIA', hint: 'País europeo famoso por sus cervezas' },
                    { word: 'AUSTRALIA', hint: 'Continente y país a la vez' },
                    { word: 'TAILANDIA', hint: 'País asiático famoso por su comida picante' },
                    { word: 'MARRUECOS', hint: 'País africano famoso por Casablanca' }
                ],
                hard: [
                    { word: 'AZERBAIYAN', hint: 'País entre Europa y Asia' },
                    { word: 'KIRGUISTAN', hint: 'País de Asia Central' },
                    { word: 'LIECHTENSTEIN', hint: 'Pequeño país entre Austria y Suiza' },
                    { word: 'MADAGASCAR', hint: 'Isla país frente a África' },
                    { word: 'UZBEKISTAN', hint: 'País sin salida al mar en Asia Central' }
                ]
            },
            food: {
                easy: [
                    { word: 'PIZZA', hint: 'Comida italiana redonda con queso' },
                    { word: 'TACO', hint: 'Comida mexicana en tortilla' },
                    { word: 'PASTA', hint: 'Comida italiana con salsa' },
                    { word: 'SUSHI', hint: 'Comida japonesa con pescado crudo' },
                    { word: 'PAELLA', hint: 'Plato español con arroz' }
                ],
                medium: [
                    { word: 'HAMBURGUESA', hint: 'Comida rápida con carne entre panes' },
                    { word: 'EMPANADA', hint: 'Masa rellena y horneada' },
                    { word: 'CROISSANT', hint: 'Pan francés en forma de media luna' },
                    { word: 'LASAGNA', hint: 'Pasta italiana en capas' },
                    { word: 'BURRITO', hint: 'Tortilla mexicana enrollada' }
                ],
                hard: [
                    { word: 'RATATOUILLE', hint: 'Guiso francés de verduras' },
                    { word: 'BOUILLABAISSE', hint: 'Sopa de pescado francesa' },
                    { word: 'GAZPACHO', hint: 'Sopa fría española' },
                    { word: 'COUSCOUS', hint: 'Plato del norte de África' },
                    { word: 'CHURRASCO', hint: 'Carne a la parrilla sudamericana' }
                ]
            },
            objects: {
                easy: [
                    { word: 'MESA', hint: 'Mueble para comer' },
                    { word: 'SILLA', hint: 'Mueble para sentarse' },
                    { word: 'LIBRO', hint: 'Objeto para leer' },
                    { word: 'COCHE', hint: 'Vehículo de cuatro ruedas' },
                    { word: 'CASA', hint: 'Lugar donde vives' }
                ],
                medium: [
                    { word: 'TELEFONO', hint: 'Dispositivo para hablar a distancia' },
                    { word: 'COMPUTADORA', hint: 'Máquina para procesar información' },
                    { word: 'REFRIGERADOR', hint: 'Electrodoméstico que enfría' },
                    { word: 'ASPIRADORA', hint: 'Máquina para limpiar el suelo' },
                    { word: 'MICROONDAS', hint: 'Electrodoméstico para calentar comida' }
                ],
                hard: [
                    { word: 'ESTETOSCOPIO', hint: 'Instrumento médico para auscultar' },
                    { word: 'CALEIDOSCOPIO', hint: 'Juguete óptico con patrones' },
                    { word: 'TERMOSTATO', hint: 'Dispositivo que controla temperatura' },
                    { word: 'BAROMETRO', hint: 'Instrumento que mide presión atmosférica' },
                    { word: 'CRONOMETRO', hint: 'Instrumento para medir tiempo preciso' }
                ]
            },
            professions: {
                easy: [
                    { word: 'DOCTOR', hint: 'Profesional que cura enfermos' },
                    { word: 'MAESTRO', hint: 'Persona que enseña' },
                    { word: 'CHEF', hint: 'Profesional que cocina' },
                    { word: 'PILOTO', hint: 'Persona que vuela aviones' },
                    { word: 'POLICIA', hint: 'Persona que mantiene el orden' }
                ],
                medium: [
                    { word: 'INGENIERO', hint: 'Profesional que diseña y construye' },
                    { word: 'ABOGADO', hint: 'Profesional que defiende en tribunales' },
                    { word: 'VETERINARIO', hint: 'Doctor de animales' },
                    { word: 'ARQUITECTO', hint: 'Profesional que diseña edificios' },
                    { word: 'PSICOLOGO', hint: 'Profesional que estudia la mente' }
                ],
                hard: [
                    { word: 'EPIDEMIOLOGO', hint: 'Científico que estudia enfermedades' },
                    { word: 'NEUROCIRUJANO', hint: 'Médico que opera el cerebro' },
                    { word: 'PALEONTÓLOGO', hint: 'Científico que estudia fósiles' },
                    { word: 'OFTALMÓLOGO', hint: 'Médico especialista en ojos' },
                    { word: 'METEORÓLOGO', hint: 'Científico que estudia el clima' }
                ]
            }
        };
        
        this.initializeGame();
        this.loadStats();
        this.loadSettings();
    }
    
    initializeGame() {
        this.canvas = document.getElementById('hangman-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.setupEventListeners();
        this.createKeyboard();
        this.updateDisplay();
        this.updateConnectionStatus();
        this.showMessage('¡Presiona "Nueva Palabra" para comenzar!', 'info');
        
        // Registrar actividad en API
        if (window.apiClient) {
            window.apiClient.updateActivity('ahorcado');
        }
    }
    
    setupEventListeners() {
        document.getElementById('start-game').addEventListener('click', () => this.startNewGame());
        document.getElementById('get-hint').addEventListener('click', () => this.showHint());
        document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
        
        // Configuración
        document.getElementById('difficulty-select').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.saveSettings();
        });
        
        document.getElementById('category-select').addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
            this.saveSettings();
        });
        
        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('animations-toggle').addEventListener('change', (e) => {
            this.animationsEnabled = e.target.checked;
            this.saveSettings();
        });
        
        // Teclado físico
        document.addEventListener('keydown', (e) => {
            if (this.gameActive && /^[A-Za-z]$/.test(e.key)) {
                this.guessLetter(e.key.toUpperCase());
            }
        });
    }
    
    createKeyboard() {
        const keyboard = document.getElementById('keyboard');
        const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
        
        keyboard.innerHTML = '';
        
        for (let letter of letters) {
            const key = document.createElement('button');
            key.className = 'key';
            key.textContent = letter;
            key.addEventListener('click', () => this.guessLetter(letter));
            keyboard.appendChild(key);
        }
    }
    
    startNewGame() {
        this.resetKeyboard();
        this.selectRandomWord();
        this.guessedLetters = [];
        this.wrongGuesses = 0;
        this.gameActive = true;
        this.hintUsed = false;
        
        this.initializeGuessedWord();
        this.updateDisplay();
        this.drawHangman();
        this.showMessage('¡Adivina la palabra!', 'info');
        
        document.getElementById('get-hint').disabled = false;
        
        // Registrar inicio de juego en API
        this.recordGameStart();
    }
    
    selectRandomWord() {
        let categories = [];
        
        if (this.currentCategory === 'all') {
            categories = Object.keys(this.words);
        } else {
            categories = [this.currentCategory];
        }
        
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const categoryWords = this.words[randomCategory][this.difficulty];
        const wordData = categoryWords[Math.floor(Math.random() * categoryWords.length)];
        
        this.currentWord = wordData.word;
        this.currentHint = wordData.hint;
        this.currentWordCategory = randomCategory;
        
        document.getElementById('current-category').textContent = this.getCategoryName(randomCategory);
    }
    
    getCategoryName(category) {
        const names = {
            animals: 'Animales',
            countries: 'Países',
            food: 'Comida',
            objects: 'Objetos',
            professions: 'Profesiones'
        };
        return names[category] || category;
    }
    
    initializeGuessedWord() {
        this.guessedWord = this.currentWord.replace(/[A-ZÑÁÉÍÓÚÜ]/g, '_');
        this.displayWord();
    }
    
    displayWord() {
        const wordDisplay = document.getElementById('word-display');
        wordDisplay.innerHTML = '';
        
        for (let i = 0; i < this.currentWord.length; i++) {
            const letterBox = document.createElement('div');
            const char = this.currentWord[i];
            
            if (char === ' ') {
                letterBox.className = 'letter-box space';
            } else {
                letterBox.className = 'letter-box';
                if (this.guessedLetters.includes(char)) {
                    letterBox.textContent = char;
                    letterBox.classList.add('revealed');
                }
            }
            
            wordDisplay.appendChild(letterBox);
        }
    }
    
    guessLetter(letter) {
        if (!this.gameActive || this.guessedLetters.includes(letter)) {
            return;
        }
        
        this.guessedLetters.push(letter);
        
        const keyElement = Array.from(document.querySelectorAll('.key'))
            .find(key => key.textContent === letter);
        
        if (this.currentWord.includes(letter)) {
            // Letra correcta
            if (keyElement) {
                keyElement.classList.add('correct');
                keyElement.classList.add('disabled');
            }
            
            this.updateGuessedWord();
            this.displayWord();
            
            if (this.soundEnabled) {
                this.playCorrectSound();
            }
            
            // Verificar si ganó
            if (!this.guessedWord.includes('_')) {
                this.winGame();
            }
        } else {
            // Letra incorrecta
            if (keyElement) {
                keyElement.classList.add('incorrect');
                keyElement.classList.add('disabled');
            }
            
            this.wrongGuesses++;
            this.drawHangman();
            
            if (this.soundEnabled) {
                this.playIncorrectSound();
            }
            
            if (this.animationsEnabled) {
                this.shakeHangman();
            }
            
            // Verificar si perdió
            if (this.wrongGuesses >= this.maxWrongGuesses) {
                this.loseGame();
            }
        }
        
        this.updateDisplay();
    }
    
    updateGuessedWord() {
        let newGuessedWord = '';
        for (let i = 0; i < this.currentWord.length; i++) {
            const char = this.currentWord[i];
            if (char === ' ' || this.guessedLetters.includes(char)) {
                newGuessedWord += char;
            } else {
                newGuessedWord += '_';
            }
        }
        this.guessedWord = newGuessedWord;
    }
    
    showHint() {
        if (this.hintUsed || !this.gameActive || this.hintsAvailable <= 0) {
            return;
        }
        
        this.hintUsed = true;
        this.hintsAvailable--;
        this.score = Math.max(0, this.score - 10);
        
        document.getElementById('word-hint').textContent = `💡 ${this.currentHint}`;
        document.getElementById('get-hint').disabled = true;
        
        this.updateDisplay();
        this.showMessage('Pista revelada (-10 puntos)', 'warning');
    }
    
    winGame() {
        this.gameActive = false;
        this.stats.wordsGuessed++;
        this.stats.totalWords++;
        this.stats.currentStreak++;
        
        if (this.stats.currentStreak > this.stats.bestStreak) {
            this.stats.bestStreak = this.stats.currentStreak;
        }
        
        // Calcular puntos
        let points = 50; // Puntos base
        points += (this.maxWrongGuesses - this.wrongGuesses) * 10; // Bonus por errores evitados
        points += this.level * 5; // Bonus por nivel
        if (!this.hintUsed) points += 20; // Bonus por no usar pista
        
        this.score += points;
        
        if (this.score > this.stats.bestScore) {
            this.stats.bestScore = this.score;
            this.showMessage(`¡Nueva mejor puntuación! +${points} puntos`, 'success');
        } else {
            this.showMessage(`¡Correcto! +${points} puntos`, 'success');
        }
        
        if (this.soundEnabled) {
            this.playWinSound();
        }
        
        this.level++;
        this.hintsAvailable = Math.min(5, this.hintsAvailable + 1);
        
        this.updateDisplay();
        this.saveStats();
        this.recordGameResult(true);
        
        // Sugerir nueva palabra después de 3 segundos
        setTimeout(() => {
            if (!this.gameActive) {
                this.showMessage('¡Presiona "Nueva Palabra" para continuar!', 'info');
            }
        }, 3000);
    }
    
    loseGame() {
        this.gameActive = false;
        this.stats.totalWords++;
        this.stats.currentStreak = 0;
        
        this.drawHangman(); // Completar el dibujo
        this.revealWord();
        
        this.showMessage(`¡Perdiste! La palabra era: ${this.currentWord}`, 'error');
        
        if (this.soundEnabled) {
            this.playLoseSound();
        }
        
        this.updateDisplay();
        this.saveStats();
        this.recordGameResult(false);
    }
    
    revealWord() {
        const wordDisplay = document.getElementById('word-display');
        const letterBoxes = wordDisplay.querySelectorAll('.letter-box:not(.space)');
        
        letterBoxes.forEach((box, index) => {
            const char = this.currentWord.replace(/ /g, '')[index];
            if (char && !this.guessedLetters.includes(char)) {
                box.textContent = char;
                box.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
                box.style.borderColor = '#f44336';
            }
        });
    }
    
    resetGame() {
        this.score = 0;
        this.level = 1;
        this.hintsAvailable = 3;
        this.gameActive = false;
        this.currentWord = '';
        this.guessedWord = '';
        this.guessedLetters = [];
        this.wrongGuesses = 0;
        this.hintUsed = false;
        
        this.resetKeyboard();
        this.clearCanvas();
        document.getElementById('word-display').innerHTML = '';
        document.getElementById('word-hint').textContent = '';
        document.getElementById('get-hint').disabled = false;
        
        this.updateDisplay();
        this.showMessage('¡Juego reiniciado! Presiona "Nueva Palabra" para comenzar', 'info');
    }
    
    resetKeyboard() {
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('correct', 'incorrect', 'disabled');
        });
    }
    
    drawHangman() {
        this.clearCanvas();
        
        const ctx = this.ctx;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        // Base
        if (this.wrongGuesses >= 1) {
            ctx.beginPath();
            ctx.moveTo(50, 320);
            ctx.lineTo(150, 320);
            ctx.stroke();
        }
        
        // Poste vertical
        if (this.wrongGuesses >= 2) {
            ctx.beginPath();
            ctx.moveTo(100, 320);
            ctx.lineTo(100, 50);
            ctx.stroke();
        }
        
        // Poste horizontal
        if (this.wrongGuesses >= 3) {
            ctx.beginPath();
            ctx.moveTo(100, 50);
            ctx.lineTo(200, 50);
            ctx.stroke();
        }
        
        // Cuerda
        if (this.wrongGuesses >= 4) {
            ctx.beginPath();
            ctx.moveTo(200, 50);
            ctx.lineTo(200, 80);
            ctx.stroke();
        }
        
        // Cabeza
        if (this.wrongGuesses >= 5) {
            ctx.strokeStyle = '#d32f2f';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(200, 100, 20, 0, Math.PI * 2);
            ctx.stroke();
            
            // Cara triste
            ctx.lineWidth = 2;
            // Ojos
            ctx.beginPath();
            ctx.moveTo(192, 95);
            ctx.lineTo(188, 99);
            ctx.moveTo(188, 95);
            ctx.lineTo(192, 99);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(208, 95);
            ctx.lineTo(212, 99);
            ctx.moveTo(212, 95);
            ctx.lineTo(208, 99);
            ctx.stroke();
            
            // Boca triste
            ctx.beginPath();
            ctx.arc(200, 110, 8, 0.2 * Math.PI, 0.8 * Math.PI);
            ctx.stroke();
        }
        
        // Cuerpo
        if (this.wrongGuesses >= 6) {
            ctx.strokeStyle = '#d32f2f';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(200, 120);
            ctx.lineTo(200, 220);
            ctx.stroke();
            
            // Brazos
            ctx.beginPath();
            ctx.moveTo(200, 150);
            ctx.lineTo(170, 180);
            ctx.moveTo(200, 150);
            ctx.lineTo(230, 180);
            ctx.stroke();
            
            // Piernas
            ctx.beginPath();
            ctx.moveTo(200, 220);
            ctx.lineTo(170, 270);
            ctx.moveTo(200, 220);
            ctx.lineTo(230, 270);
            ctx.stroke();
        }
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    shakeHangman() {
        const container = document.querySelector('.hangman-container');
        container.classList.add('shake');
        setTimeout(() => {
            container.classList.remove('shake');
        }, 500);
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('errors').textContent = `${this.wrongGuesses}/${this.maxWrongGuesses}`;
        
        // Estadísticas
        document.getElementById('words-guessed').textContent = this.stats.wordsGuessed;
        document.getElementById('best-score').textContent = this.stats.bestScore;
        document.getElementById('current-streak').textContent = this.stats.currentStreak;
        
        const winPercentage = this.stats.totalWords > 0 
            ? Math.round((this.stats.wordsGuessed / this.stats.totalWords) * 100)
            : 0;
        document.getElementById('win-percentage').textContent = `${winPercentage}%`;
    }
    
    showMessage(text, type = 'info') {
        const messageElement = document.getElementById('game-message');
        messageElement.textContent = text;
        messageElement.className = `game-message ${type} show`;
        
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 4000);
    }
    
    // Sonidos
    playCorrectSound() {
        this.playTone(800, 200, 'sine');
    }
    
    playIncorrectSound() {
        this.playTone(300, 400, 'square');
    }
    
    playWinSound() {
        const frequencies = [523, 659, 784, 1047]; // Do, Mi, Sol, Do alto
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 300, 'sine');
            }, index * 150);
        });
    }
    
    playLoseSound() {
        const frequencies = [400, 350, 300, 250];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 200, 'square');
            }, index * 100);
        });
    }
    
    playTone(frequency, duration, type = 'sine') {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (error) {
            console.log('Audio no disponible');
        }
    }
    
    // Configuración
    saveSettings() {
        const settings = {
            difficulty: this.difficulty,
            category: this.currentCategory,
            soundEnabled: this.soundEnabled,
            animationsEnabled: this.animationsEnabled
        };
        localStorage.setItem('hangman_settings', JSON.stringify(settings));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('hangman_settings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.difficulty = settings.difficulty || 'medium';
            this.currentCategory = settings.category || 'animals';
            this.soundEnabled = settings.soundEnabled !== false;
            this.animationsEnabled = settings.animationsEnabled !== false;
            
            // Aplicar a los controles
            document.getElementById('difficulty-select').value = this.difficulty;
            document.getElementById('category-select').value = this.currentCategory;
            document.getElementById('sound-toggle').checked = this.soundEnabled;
            document.getElementById('animations-toggle').checked = this.animationsEnabled;
        }
    }
    
    // Estadísticas
    saveStats() {
        localStorage.setItem('hangman_stats', JSON.stringify(this.stats));
    }
    
    loadStats() {
        const saved = localStorage.getItem('hangman_stats');
        if (saved) {
            this.stats = { ...this.stats, ...JSON.parse(saved) };
        }
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
            statusText.textContent = 'Modo offline';
            statusContainer.className = 'connection-status offline';
        }
    }
    
    async recordGameStart() {
        try {
            if (window.apiClient) {
                await window.apiClient.updateActivity('ahorcado');
            }
        } catch (error) {
            console.log('No se pudo registrar el inicio del juego');
        }
    }
    
    async recordGameResult(won) {
        try {
            if (window.apiClient) {
                await window.apiClient.recordGameResult('ahorcado', {
                    won: won,
                    score: this.score,
                    level: this.level,
                    word: this.currentWord,
                    category: this.currentWordCategory,
                    difficulty: this.difficulty,
                    wrongGuesses: this.wrongGuesses,
                    hintUsed: this.hintUsed
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

// Función para volver al menú
function volverAlMenu() {
    window.location.href = 'index.html';
}

// Inicializar el juego cuando se carga la página
let ahorcadoGame;

document.addEventListener('DOMContentLoaded', () => {
    ahorcadoGame = new Ahorcado();
    
    // Cerrar panel de configuración al hacer clic fuera
    document.addEventListener('click', (e) => {
        const panel = document.getElementById('settings-panel');
        const settingsButton = document.querySelector('.settings-button');
        
        if (panel.classList.contains('active') && 
            !panel.contains(e.target) && 
            !settingsButton.contains(e.target)) {
            panel.classList.remove('active');
        }
    });
});