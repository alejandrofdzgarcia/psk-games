/**
 * Juego de Ahorcado - Versión Optimizada
 * Características: Múltiples categorías, dificultades, sonidos, estadísticas
 */
class Ahorcado {
    constructor() {
        this.initializeProperties();
        this.initializeGame();
        this.loadUserData();
    }

    // Inicialización de propiedades del juego
    initializeProperties() {
        // Estado del juego
        this.currentWord = '';
        this.guessedWord = '';
        this.guessedLetters = [];
        this.wrongGuesses = 0;
        this.maxWrongGuesses = 6;
        this.gameActive = false;
        this.hintUsed = false;

        // Progreso y puntuación
        this.score = 0;
        this.level = 1;
        this.hintsAvailable = 3;

        // Configuración
        this.currentCategory = 'animals';
        this.difficulty = 'medium';
        this.soundEnabled = true;
        this.animationsEnabled = true;

        // Estadísticas
        this.stats = {
            wordsGuessed: 0,
            totalWords: 0,
            bestScore: 0,
            currentStreak: 0,
            bestStreak: 0
        };

        // Base de datos de palabras
        this.words = this.initializeWordDatabase();
    }

    // Base de datos de palabras organizadas por categoría y dificultad
    initializeWordDatabase() {
        return {
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
    }

    // Inicialización del juego
    initializeGame() {
        this.setupCanvas();
        this.setupEventListeners();
        this.createKeyboard();
        this.updateDisplay();
        this.updateConnectionStatus();
        this.showMessage('¡Presiona "Nueva Palabra" para comenzar!', 'info');
        this.registerActivity();
    }

    // Configuración del canvas para el dibujo del ahorcado
    setupCanvas() {
        this.canvas = document.getElementById('hangman-canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    // Configuración de todos los event listeners
    setupEventListeners() {
        // Botones principales
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

    // Crear teclado virtual
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

    // === MÉTODOS DE JUEGO ===

    // Iniciar nuevo juego
    startNewGame() {
        this.resetGameState();
        this.selectRandomWord();
        this.initializeGuessedWord();
        this.updateDisplay();
        this.drawHangman();
        this.showMessage('¡Adivina la palabra!', 'info');
        this.recordGameStart();
    }

    // Resetear estado del juego
    resetGameState() {
        this.resetKeyboard();
        this.guessedLetters = [];
        this.wrongGuesses = 0;
        this.gameActive = true;
        this.hintUsed = false;
        document.getElementById('get-hint').disabled = false;
    }

    // Seleccionar palabra aleatoria
    selectRandomWord() {
        const categories = this.currentCategory === 'all' 
            ? Object.keys(this.words) 
            : [this.currentCategory];

        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const categoryWords = this.words[randomCategory][this.difficulty];
        const wordData = categoryWords[Math.floor(Math.random() * categoryWords.length)];

        this.currentWord = wordData.word;
        this.currentHint = wordData.hint;
        this.currentWordCategory = randomCategory;

        document.getElementById('current-category').textContent = this.getCategoryName(randomCategory);
    }

    // Obtener nombre de categoría en español
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

    // Inicializar palabra adivinada
    initializeGuessedWord() {
        this.guessedWord = this.currentWord.replace(/[A-ZÑÁÉÍÓÚÜ]/g, '_');
        this.displayWord();
    }

    // Mostrar palabra en pantalla
    displayWord() {
        const wordDisplay = document.getElementById('word-display');
        wordDisplay.innerHTML = '';

        for (let char of this.currentWord) {
            const letterBox = document.createElement('div');
            
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

    // Procesar letra adivinada
    guessLetter(letter) {
        if (!this.gameActive || this.guessedLetters.includes(letter)) return;

        this.guessedLetters.push(letter);
        const keyElement = this.getKeyElement(letter);

        if (this.currentWord.includes(letter)) {
            this.handleCorrectGuess(keyElement);
        } else {
            this.handleIncorrectGuess(keyElement);
        }

        this.updateDisplay();
    }

    // Obtener elemento de tecla
    getKeyElement(letter) {
        return Array.from(document.querySelectorAll('.key'))
            .find(key => key.textContent === letter);
    }

    // Manejar letra correcta
    handleCorrectGuess(keyElement) {
        if (keyElement) {
            keyElement.classList.add('correct', 'disabled');
        }

        this.updateGuessedWord();
        this.displayWord();

        if (this.soundEnabled) this.playCorrectSound();

        if (!this.guessedWord.includes('_')) {
            this.winGame();
        }
    }

    // Manejar letra incorrecta
    handleIncorrectGuess(keyElement) {
        if (keyElement) {
            keyElement.classList.add('incorrect', 'disabled');
        }

        this.wrongGuesses++;
        this.drawHangman();

        if (this.soundEnabled) this.playIncorrectSound();
        if (this.animationsEnabled) this.shakeHangman();

        if (this.wrongGuesses >= this.maxWrongGuesses) {
            this.loseGame();
        }
    }

    // Actualizar palabra adivinada
    updateGuessedWord() {
        this.guessedWord = this.currentWord
            .split('')
            .map(char => (char === ' ' || this.guessedLetters.includes(char)) ? char : '_')
            .join('');
    }

    // Mostrar pista
    showHint() {
        if (this.hintUsed || !this.gameActive || this.hintsAvailable <= 0) return;

        this.hintUsed = true;
        this.hintsAvailable--;
        this.score = Math.max(0, this.score - 10);

        document.getElementById('word-hint').textContent = `💡 ${this.currentHint}`;
        document.getElementById('get-hint').disabled = true;

        this.updateDisplay();
        this.showMessage('Pista revelada (-10 puntos)', 'warning');
    }

    // === MÉTODOS DE FIN DE JUEGO ===

    // Ganar juego
    winGame() {
        this.gameActive = false;
        this.updateWinStats();
        
        const points = this.calculatePoints();
        this.score += points;

        this.checkBestScore(points);
        this.levelUp();
        
        if (this.soundEnabled) this.playWinSound();
        
        this.updateDisplay();
        this.saveStats();
        this.recordGameResult(true);
        this.scheduleNextGamePrompt();
    }

    // Actualizar estadísticas de victoria
    updateWinStats() {
        this.stats.wordsGuessed++;
        this.stats.totalWords++;
        this.stats.currentStreak++;

        if (this.stats.currentStreak > this.stats.bestStreak) {
            this.stats.bestStreak = this.stats.currentStreak;
        }
    }

    // Calcular puntos
    calculatePoints() {
        let points = 50; // Puntos base
        points += (this.maxWrongGuesses - this.wrongGuesses) * 10; // Bonus por errores evitados
        points += this.level * 5; // Bonus por nivel
        if (!this.hintUsed) points += 20; // Bonus por no usar pista
        return points;
    }

    // Verificar mejor puntuación
    checkBestScore(points) {
        if (this.score > this.stats.bestScore) {
            this.stats.bestScore = this.score;
            this.showMessage(`¡Nueva mejor puntuación! +${points} puntos`, 'success');
        } else {
            this.showMessage(`¡Correcto! +${points} puntos`, 'success');
        }
    }

    // Subir de nivel
    levelUp() {
        this.level++;
        this.hintsAvailable = Math.min(5, this.hintsAvailable + 1);
    }

    // Programar próximo juego
    scheduleNextGamePrompt() {
        setTimeout(() => {
            if (!this.gameActive) {
                this.showMessage('¡Presiona "Nueva Palabra" para continuar!', 'info');
            }
        }, 3000);
    }

    // Perder juego
    loseGame() {
        this.gameActive = false;
        this.updateLossStats();
        this.drawHangman();
        this.revealWord();
        
        this.showMessage(`¡Perdiste! La palabra era: ${this.currentWord}`, 'error');
        
        if (this.soundEnabled) this.playLoseSound();
        
        this.updateDisplay();
        this.saveStats();
        this.recordGameResult(false);
    }

    // Actualizar estadísticas de derrota
    updateLossStats() {
        this.stats.totalWords++;
        this.stats.currentStreak = 0;
    }

    // Revelar palabra completa
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

    // === MÉTODOS DE DIBUJO ===

    // Dibujar ahorcado
    drawHangman() {
        this.clearCanvas();
        
        const ctx = this.ctx;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        const drawingSteps = [
            () => this.drawBase(ctx),
            () => this.drawPole(ctx),
            () => this.drawHorizontalBeam(ctx),
            () => this.drawNoose(ctx),
            () => this.drawHead(ctx),
            () => this.drawBodyAndLimbs(ctx)
        ];

        for (let i = 0; i < this.wrongGuesses; i++) {
            if (drawingSteps[i]) drawingSteps[i]();
        }
    }

    // Dibujar base
    drawBase(ctx) {
        ctx.beginPath();
        ctx.moveTo(50, 320);
        ctx.lineTo(150, 320);
        ctx.stroke();
    }

    // Dibujar poste vertical
    drawPole(ctx) {
        ctx.beginPath();
        ctx.moveTo(100, 320);
        ctx.lineTo(100, 50);
        ctx.stroke();
    }

    // Dibujar viga horizontal
    drawHorizontalBeam(ctx) {
        ctx.beginPath();
        ctx.moveTo(100, 50);
        ctx.lineTo(200, 50);
        ctx.stroke();
    }

    // Dibujar cuerda
    drawNoose(ctx) {
        ctx.beginPath();
        ctx.moveTo(200, 50);
        ctx.lineTo(200, 80);
        ctx.stroke();
    }

    // Dibujar cabeza
    drawHead(ctx) {
        ctx.strokeStyle = '#d32f2f';
        ctx.lineWidth = 3;
        
        // Cabeza
        ctx.beginPath();
        ctx.arc(200, 100, 20, 0, Math.PI * 2);
        ctx.stroke();

        // Cara triste
        ctx.lineWidth = 2;
        this.drawSadFace(ctx);
    }

    // Dibujar cara triste
    drawSadFace(ctx) {
        // Ojos
        ctx.beginPath();
        ctx.moveTo(192, 95); ctx.lineTo(188, 99);
        ctx.moveTo(188, 95); ctx.lineTo(192, 99);
        ctx.moveTo(208, 95); ctx.lineTo(212, 99);
        ctx.moveTo(212, 95); ctx.lineTo(208, 99);
        ctx.stroke();

        // Boca triste
        ctx.beginPath();
        ctx.arc(200, 110, 8, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
    }

    // Dibujar cuerpo y extremidades
    drawBodyAndLimbs(ctx) {
        ctx.strokeStyle = '#d32f2f';
        ctx.lineWidth = 4;

        // Cuerpo
        ctx.beginPath();
        ctx.moveTo(200, 120);
        ctx.lineTo(200, 220);
        ctx.stroke();

        // Brazos
        ctx.beginPath();
        ctx.moveTo(200, 150); ctx.lineTo(170, 180);
        ctx.moveTo(200, 150); ctx.lineTo(230, 180);
        ctx.stroke();

        // Piernas
        ctx.beginPath();
        ctx.moveTo(200, 220); ctx.lineTo(170, 270);
        ctx.moveTo(200, 220); ctx.lineTo(230, 270);
        ctx.stroke();
    }

    // Limpiar canvas
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // === MÉTODOS DE INTERFAZ ===

    // Reiniciar juego completo
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

    // Reiniciar teclado
    resetKeyboard() {
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('correct', 'incorrect', 'disabled');
        });
    }

    // Animación de sacudida
    shakeHangman() {
        const container = document.querySelector('.hangman-container');
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 500);
    }

    // Actualizar display
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

    // Mostrar mensaje
    showMessage(text, type = 'info') {
        const messageElement = document.getElementById('game-message');
        messageElement.textContent = text;
        messageElement.className = `game-message ${type} show`;

        setTimeout(() => messageElement.classList.remove('show'), 4000);
    }

    // === MÉTODOS DE SONIDO ===

    playCorrectSound() { this.playTone(800, 200, 'sine'); }
    playIncorrectSound() { this.playTone(300, 400, 'square'); }

    playWinSound() {
        const frequencies = [523, 659, 784, 1047];
        frequencies.forEach((freq, index) => {
            setTimeout(() => this.playTone(freq, 300, 'sine'), index * 150);
        });
    }

    playLoseSound() {
        const frequencies = [400, 350, 300, 250];
        frequencies.forEach((freq, index) => {
            setTimeout(() => this.playTone(freq, 200, 'square'), index * 100);
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

    // === MÉTODOS DE PERSISTENCIA ===

    // Cargar datos del usuario
    loadUserData() {
        this.loadStats();
        this.loadSettings();
    }

    // Guardar configuración
    saveSettings() {
        const settings = {
            difficulty: this.difficulty,
            category: this.currentCategory,
            soundEnabled: this.soundEnabled,
            animationsEnabled: this.animationsEnabled
        };
        localStorage.setItem('hangman_settings', JSON.stringify(settings));
    }

    // Cargar configuración
    loadSettings() {
        const saved = localStorage.getItem('hangman_settings');
        if (!saved) return;

        const settings = JSON.parse(saved);
        this.difficulty = settings.difficulty || 'medium';
        this.currentCategory = settings.category || 'animals';
        this.soundEnabled = settings.soundEnabled !== false;
        this.animationsEnabled = settings.animationsEnabled !== false;

        this.applySettingsToUI();
    }

    // Aplicar configuración a la interfaz
    applySettingsToUI() {
        document.getElementById('difficulty-select').value = this.difficulty;
        document.getElementById('category-select').value = this.currentCategory;
        document.getElementById('sound-toggle').checked = this.soundEnabled;
        document.getElementById('animations-toggle').checked = this.animationsEnabled;
    }

    // Guardar estadísticas
    saveStats() {
        localStorage.setItem('hangman_stats', JSON.stringify(this.stats));
    }

    // Cargar estadísticas
    loadStats() {
        const saved = localStorage.getItem('hangman_stats');
        if (saved) {
            this.stats = { ...this.stats, ...JSON.parse(saved) };
        }
    }

    // === MÉTODOS DE API ===

    // Actualizar estado de conexión
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

    // Registrar actividad
    async registerActivity() {
        try {
            if (window.apiClient) {
                await window.apiClient.updateActivity('ahorcado');
            }
        } catch (error) {
            console.log('No se pudo registrar actividad');
        }
    }

    // Registrar inicio de juego
    async recordGameStart() {
        try {
            if (window.apiClient) {
                await window.apiClient.updateActivity('ahorcado');
            }
        } catch (error) {
            console.log('No se pudo registrar inicio de juego');
        }
    }

    // Registrar resultado de juego
    async recordGameResult(won) {
        try {
            if (window.apiClient) {
                await window.apiClient.recordGameResult('ahorcado', {
                    won,
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
            console.log('No se pudo registrar resultado');
        }
    }
}

// === FUNCIONES GLOBALES ===

function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    panel.classList.toggle('active');
}

function volverAlMenu() {
    window.location.href = 'index.html';
}

// === INICIALIZACIÓN ===

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