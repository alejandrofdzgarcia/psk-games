class Ruleta {
    constructor() {
        // Ruleta de casino con orden tradicional (sin 00 para versión europea)
        this.opciones = [
            "0", "32", "15", "19", "4", "21", "2", "25", "17", "34", "6", "27",
            "13", "36", "11", "30", "8", "23", "10", "5", "24", "16", "33", "1",
            "20", "14", "31", "9", "22", "18", "29", "7", "28", "12", "35", "3", "26"
        ];
        
        // Colores según el orden tradicional de casino
        this.colores = this.generarColoresCasino();
        this.girando = false;
        this.rotacionActual = 0;
        this.canvas = null;
        this.ctx = null;
        this.centerX = 200;
        this.centerY = 200;
        this.outerRadius = 180;
        this.innerRadius = 40;
        this.audioContext = null;
        this.ultimoSegmento = null;
        
        // Variables para el sistema de apuestas
        this.bankValue = 1000;
        this.currentBet = 0;
        this.selectedChip = 5;
        this.bets = [];
        this.numRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        
        this.initAudio();
        this.initCanvas();
        this.initEventListeners();
        this.buildBettingBoard();
        this.dibujarRuleta();
    }

    generarColoresCasino() {
        const colores = [];
        // Colores según el orden exacto proporcionado por el usuario
        const coloresPorPosicion = [
            '#00AA00', // 0 - Verde
            '#DC143C', // 32 - Rojo
            '#1A1A1A', // 15 - Negro
            '#DC143C', // 19 - Rojo
            '#1A1A1A', // 4 - Negro
            '#DC143C', // 21 - Rojo
            '#1A1A1A', // 2 - Negro
            '#DC143C', // 25 - Rojo
            '#1A1A1A', // 17 - Negro
            '#DC143C', // 34 - Rojo
            '#1A1A1A', // 6 - Negro
            '#DC143C', // 27 - Rojo
            '#1A1A1A', // 13 - Negro
            '#DC143C', // 36 - Rojo
            '#1A1A1A', // 11 - Negro
            '#DC143C', // 30 - Rojo
            '#1A1A1A', // 8 - Negro
            '#DC143C', // 23 - Rojo
            '#1A1A1A', // 10 - Negro
            '#DC143C', // 5 - Rojo
            '#1A1A1A', // 24 - Negro
            '#DC143C', // 16 - Rojo
            '#1A1A1A', // 33 - Negro
            '#DC143C', // 1 - Rojo
            '#1A1A1A', // 20 - Negro
            '#DC143C', // 14 - Rojo
            '#1A1A1A', // 31 - Negro
            '#DC143C', // 9 - Rojo
            '#1A1A1A', // 22 - Negro
            '#DC143C', // 18 - Rojo
            '#1A1A1A', // 29 - Negro
            '#DC143C', // 7 - Rojo
            '#1A1A1A', // 28 - Negro
            '#DC143C', // 12 - Rojo
            '#1A1A1A', // 35 - Negro
            '#DC143C', // 3 - Rojo
            '#1A1A1A'  // 26 - Negro
        ];
        
        return coloresPorPosicion;
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio no disponible');
        }
    }

    reproducirSonidoTic() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    initCanvas() {
        this.canvas = document.getElementById('wheelCanvas');
        if (!this.canvas) {
            console.error('Canvas no encontrado');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;
    }

    initEventListeners() {
        // Solo botón de girar
        document.getElementById('spinButton').addEventListener('click', () => {
            this.girarRuleta();
        });
    }

    dibujarRuleta() {
        if (!this.ctx) return;

        // Limpiar el canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.opciones.length === 0) {
            this.dibujarMensajeVacio();
            return;
        }

        const anguloPorSegmento = 360 / this.opciones.length;

        // Guardar el estado del contexto
        this.ctx.save();

        // Aplicar rotación
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(this.gradosARadianes(this.rotacionActual));
        this.ctx.translate(-this.centerX, -this.centerY);

        // Dibujar cada segmento
        this.opciones.forEach((opcion, index) => {
            const anguloInicio = index * anguloPorSegmento;
            const anguloFin = (index + 1) * anguloPorSegmento;
            
            this.dibujarSegmento(anguloInicio, anguloFin, this.colores[index % this.colores.length], opcion);
        });

        // Restaurar el estado del contexto
        this.ctx.restore();

        // Dibujar el centro de la ruleta
        this.dibujarCentro();
        
        // Dibujar el indicador/puntero en la parte superior
        this.dibujarIndicador();
    }

    dibujarSegmento(anguloInicio, anguloFin, color, texto) {
        const startAngleRad = this.gradosARadianes(anguloInicio - 90);
        const endAngleRad = this.gradosARadianes(anguloFin - 90);

        // Dibujar el segmento principal
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.outerRadius, startAngleRad, endAngleRad);
        this.ctx.arc(this.centerX, this.centerY, this.innerRadius, endAngleRad, startAngleRad, true);
        this.ctx.closePath();

        // Rellenar el segmento con el color correspondiente
        this.ctx.fillStyle = color;
        this.ctx.fill();

        // Borde dorado/amarillo para simular los separadores metálicos
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Dibujar el texto del número
        this.dibujarTextoSegmento(anguloInicio, anguloFin, texto);
    }

    dibujarTextoSegmento(anguloInicio, anguloFin, texto) {
        const anguloMedio = (anguloInicio + anguloFin) / 2;
        const anguloMedioRad = this.gradosARadianes(anguloMedio - 90);
        
        // Posicionar el texto más hacia el exterior, similar al ejemplo
        const radioTexto = this.outerRadius - 25;
        const x = this.centerX + Math.cos(anguloMedioRad) * radioTexto;
        const y = this.centerY + Math.sin(anguloMedioRad) * radioTexto;

        // Guardar el estado del contexto
        this.ctx.save();

        // Configurar el texto (similar al ejemplo: blanco con sombra negra)
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = `bold ${texto.length > 1 ? '14' : '16'}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 3;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;

        // Rotar el texto para que sea legible
        this.ctx.translate(x, y);
        if (anguloMedio > 90 && anguloMedio < 270) {
            this.ctx.rotate(this.gradosARadianes(anguloMedio + 180));
        } else {
            this.ctx.rotate(this.gradosARadianes(anguloMedio));
        }

        // Dibujar el texto
        this.ctx.fillText(texto, 0, 0);

        // Restaurar el estado del contexto
        this.ctx.restore();
    }

    dibujarCentro() {
        // Dibujar el centro de la ruleta similar al ejemplo de referencia
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.innerRadius, 0, 2 * Math.PI);
        
        // Gradiente radial para simular el aspecto metálico del centro
        const gradient = this.ctx.createRadialGradient(
            this.centerX - 10, this.centerY - 10, 0,
            this.centerX, this.centerY, this.innerRadius
        );
        gradient.addColorStop(0, '#F3C620');  // Dorado claro (similar al ejemplo)
        gradient.addColorStop(0.6, '#DAA520'); // Dorado medio
        gradient.addColorStop(1, '#1A1608');   // Sombra oscura
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Borde metálico
        this.ctx.strokeStyle = '#B8860B';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Círculo interior más pequeño para dar efecto de profundidad
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.innerRadius * 0.6, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#8B6914';
        this.ctx.fill();
        
        // Pequeño punto central
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 3, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#2F1B14';
        this.ctx.fill();
    }

    dibujarMensajeVacio() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        const mensaje = window.i18n ? window.i18n.t('roulette.ready') : 'Ruleta de Casino Lista';
        this.ctx.fillText(mensaje, this.centerX, this.centerY);
    }

    dibujarIndicador() {
        // Dibujar un pequeño triángulo/puntero en la parte superior para indicar el ganador
        this.ctx.save();
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#B8860B';
        this.ctx.lineWidth = 2;
        
        // Triángulo apuntando hacia el centro desde arriba
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, 10); // Punto superior
        this.ctx.lineTo(this.centerX - 12, 30); // Punto izquierdo
        this.ctx.lineTo(this.centerX + 12, 30); // Punto derecho
        this.ctx.closePath();
        
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    gradosARadianes(grados) {
        return grados * Math.PI / 180;
    }

    girarRuleta() {
        if (this.girando || this.opciones.length === 0) return;

        // Inicializar AudioContext en el primer clic del usuario
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.girando = true;
        const spinButton = document.getElementById('spinButton');
        const result = document.getElementById('result');
        
        spinButton.disabled = true;
        const spinningText = window.i18n ? window.i18n.t('roulette.spinning') : 'Girando...';
        spinButton.textContent = spinningText;
        result.textContent = '';
        result.classList.remove('winner-animation');

        // Generar rotación aleatoria con más realismo
        const vueltasMinimas = 5;
        const vueltasExtras = Math.random() * 5;
        const anguloFinal = Math.random() * 360;
        const rotacionTotal = (vueltasMinimas + vueltasExtras) * 360 + anguloFinal;

        // Animación más suave usando requestAnimationFrame
        const rotacionInicial = this.rotacionActual;
        const rotacionObjetivo = rotacionInicial + rotacionTotal;
        const duracion = 4000; // 4 segundos
        const tiempoInicio = Date.now();
        this.ultimoSegmento = null;

        const animar = () => {
            const tiempoActual = Date.now();
            const tiempoTranscurrido = tiempoActual - tiempoInicio;
            const progreso = Math.min(tiempoTranscurrido / duracion, 1);

            // Función de easing para desaceleración suave
            const easeOut = 1 - Math.pow(1 - progreso, 3);
            
            this.rotacionActual = rotacionInicial + (rotacionTotal * easeOut);
            this.dibujarRuleta();

            // Efectos de sonido durante la rotación
            this.verificarCambioSegmento();

            if (progreso < 1) {
                requestAnimationFrame(animar);
            } else {
                this.completarGiro();
            }
        };

        requestAnimationFrame(animar);
    }

    verificarCambioSegmento() {
        if (!this.audioContext || this.opciones.length === 0) return;

        const anguloNormalizado = (360 - (this.rotacionActual % 360)) % 360;
        const anguloPorSegmento = 360 / this.opciones.length;
        const segmentoActual = Math.floor(anguloNormalizado / anguloPorSegmento) % this.opciones.length;

        if (this.ultimoSegmento !== null && this.ultimoSegmento !== segmentoActual) {
            this.reproducirSonidoTic();
        }
        
        this.ultimoSegmento = segmentoActual;
    }

    completarGiro() {
        // Calcular el ganador basado en la posición visual correcta
        // El punto de referencia está en la parte superior (0 grados)
        const anguloNormalizado = (360 - (this.rotacionActual % 360)) % 360;
        const anguloPorSegmento = 360 / this.opciones.length;
        const indiceGanador = Math.floor(anguloNormalizado / anguloPorSegmento) % this.opciones.length;
        const ganador = this.opciones[indiceGanador];

        console.log(`Debug: Ángulo: ${this.rotacionActual}, Normalizado: ${anguloNormalizado}, Índice: ${indiceGanador}, Ganador: ${ganador}`);

        // Calcular ganancias
        const ganancias = this.calcularGanancias(ganador);

        // Mostrar resultado con color apropiado
        const result = document.getElementById('result');
        let mensajeColor = '#FFD700'; // Dorado por defecto
        let resultText = '';
        
        if (ganador === "0") {
            mensajeColor = '#00AA00'; // Verde
            resultText = window.i18n ? window.i18n.t('roulette.winner_green', ganador) : `🎉 ¡${ganador} - VERDE! 🎉`;
        } else {
            // Obtener el color basado en la posición del número ganador
            const colorGanador = this.colores[indiceGanador];
            if (colorGanador === '#DC143C') {
                mensajeColor = '#DC143C'; // Rojo
                resultText = window.i18n ? window.i18n.t('roulette.winner_red', ganador) : `🎉 ¡${ganador} - ROJO! 🎉`;
            } else {
                mensajeColor = '#1A1A1A'; // Negro
                resultText = window.i18n ? window.i18n.t('roulette.winner_black', ganador) : `🎉 ¡${ganador} - NEGRO! 🎉`;
            }
        }

        // Agregar información de ganancias al resultado
        if (ganancias > 0) {
            resultText += ` 💰 Ganaste: ${ganancias}`;
        }

        result.textContent = resultText;
        
        result.style.color = mensajeColor;
        result.classList.add('winner-animation');

        // Efectos adicionales
        this.crearConfetti();
        console.log(`🎉 ¡GANADOR: ${ganador}! 🎉`);

        // Guardar resultado en la API
        this.guardarResultado(ganador, this.colores[indiceGanador]);

        // Calcular y mostrar ganancias
        this.calcularGanancias(ganador);

        // Resetear botón
        this.girando = false;
        const spinButton = document.getElementById('spinButton');
        spinButton.disabled = false;
        const spinText = window.i18n ? window.i18n.t('roulette.spin') : '¡GIRAR RULETA!';
        spinButton.textContent = spinText;
    }

    // Método para guardar el resultado del giro en la API
    async guardarResultado(numero, color) {
        try {
            const colorName = this.getColorName(color);
            const startTime = Date.now();
            
            await window.apiClient.recordGameResult('roulette', {
                number: numero,
                color: colorName,
                colorHex: color,
                option: `${numero} - ${colorName}`
            });
            
            console.log(`✅ Resultado guardado: ${numero} - ${colorName}`);
        } catch (error) {
            console.log('⚠️ No se pudo guardar el resultado en la API:', error.message);
        }
    }

    // Método para obtener el nombre del color
    getColorName(hexColor) {
        if (window.apiClient && typeof window.apiClient.getColorName === 'function') {
            return window.apiClient.getColorName(hexColor);
        }
        
        // Fallback local
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

    crearConfetti() {
        // Simulación de confetti mejorada
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.width = Math.random() * 8 + 4 + 'px';
                confetti.style.height = confetti.style.width;
                confetti.style.backgroundColor = this.colores[Math.floor(Math.random() * this.colores.length)];
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '1000';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                confetti.style.opacity = Math.random() * 0.7 + 0.3;
                
                document.body.appendChild(confetti);
                
                // Animación de caída mejorada
                let position = -10;
                let rotation = 0;
                let velocity = Math.random() * 3 + 2;
                const wind = (Math.random() - 0.5) * 2;
                
                const fall = setInterval(() => {
                    position += velocity;
                    rotation += 5;
                    velocity += 0.1; // Aceleración por gravedad
                    
                    confetti.style.top = position + 'px';
                    confetti.style.transform = `rotate(${rotation}deg) translateX(${wind * position * 0.01}px)`;
                    
                    if (position > window.innerHeight + 20) {
                        clearInterval(fall);
                        confetti.remove();
                    }
                }, 20);
            }, i * 30);
        }
    }

    // Método para obtener el color de un número
    obtenerColorNumero(numero) {
        const indice = this.opciones.indexOf(numero.toString());
        if (indice === -1) return "No encontrado";
        
        const color = this.colores[indice];
        if (numero === "0") {
            return window.i18n ? window.i18n.t('color.green') : "Verde";
        }
        if (color === '#DC143C') {
            return window.i18n ? window.i18n.t('color.red') : "Rojo";
        } else {
            return window.i18n ? window.i18n.t('color.black') : "Negro";
        }
    }

    // Método para obtener todas las opciones
    obtenerOpciones() {
        return [...this.opciones];
    }

    buildBettingBoard() {
        const bettingBoard = document.getElementById('betting_board');
        if (!bettingBoard) return;

        bettingBoard.innerHTML = '';

        // Crear sección de fichas
        this.createChipSection(bettingBoard);

        // Crear información de apuestas
        this.createBetInfo(bettingBoard);

        // Crear tablero de números
        this.createNumberBoard(bettingBoard);

        // Crear apuestas exteriores
        this.createOutsideBets(bettingBoard);

        // Crear controles
        this.createBettingControls(bettingBoard);
    }

    createChipSection(container) {
        const chipSection = document.createElement('div');
        chipSection.className = 'chip-section';

        const chipValues = [1, 5, 10, 25, 100];
        chipValues.forEach(value => {
            const chip = document.createElement('div');
            chip.className = `chip chip-${value} ${value === this.selectedChip ? 'active' : ''}`;
            chip.textContent = value;
            chip.onclick = () => this.selectChip(value);
            chipSection.appendChild(chip);
        });

        container.appendChild(chipSection);
    }

    createBetInfo(container) {
        const betInfo = document.createElement('div');
        betInfo.className = 'bet-info';

        betInfo.innerHTML = `
            <div class="bet-info-item">
                <span class="bet-info-label">Banco</span>
                <span class="bet-info-value" id="bank-value">${this.bankValue}</span>
            </div>
            <div class="bet-info-item">
                <span class="bet-info-label">Apuesta Total</span>
                <span class="bet-info-value" id="total-bet">${this.currentBet}</span>
            </div>
            <div class="bet-info-item">
                <span class="bet-info-label">Ficha Seleccionada</span>
                <span class="bet-info-value" id="selected-chip">${this.selectedChip}</span>
            </div>
        `;

        container.appendChild(betInfo);
    }

    createNumberBoard(container) {
        const numberBoard = document.createElement('div');
        numberBoard.className = 'number-board';

        // Crear casilla del 0
        const zero = document.createElement('div');
        zero.className = 'number-block number-0 green';
        zero.textContent = '0';
        zero.onclick = () => this.placeBet('0', 'straight', 35);
        numberBoard.appendChild(zero);

        // Crear filas de números
        for (let row = 0; row < 3; row++) {
            for (let col = 1; col <= 12; col++) {
                const number = (row * 12) + col + (2 - row);
                if (number <= 36) {
                    const numberBlock = document.createElement('div');
                    numberBlock.className = `number-block ${this.getNumberClass(number)}`;
                    numberBlock.textContent = number;
                    numberBlock.onclick = () => this.placeBet(number.toString(), 'straight', 35);
                    numberBoard.appendChild(numberBlock);
                }
            }

            // Agregar apuesta de columna
            const columnBet = document.createElement('div');
            columnBet.className = 'number-block column-bet';
            columnBet.textContent = '2:1';
            const columnNumbers = this.getColumnNumbers(row);
            columnBet.onclick = () => this.placeBet(columnNumbers, 'column', 2);
            numberBoard.appendChild(columnBet);
        }

        container.appendChild(numberBoard);
    }

    createOutsideBets(container) {
        const outsideBets = document.createElement('div');
        outsideBets.className = 'outside-bets';

        const bets = [
            { label: '1-18', numbers: this.getRange(1, 18), type: 'low', odds: 1 },
            { label: 'PAR', numbers: this.getEvenNumbers(), type: 'even', odds: 1 },
            { label: 'ROJO', numbers: this.numRed, type: 'red', odds: 1, class: 'red-bet' },
            { label: 'NEGRO', numbers: this.getBlackNumbers(), type: 'black', odds: 1, class: 'black-bet' },
            { label: 'IMPAR', numbers: this.getOddNumbers(), type: 'odd', odds: 1 },
            { label: '19-36', numbers: this.getRange(19, 36), type: 'high', odds: 1 }
        ];

        bets.forEach(bet => {
            const betElement = document.createElement('div');
            betElement.className = `outside-bet ${bet.class || ''}`;
            betElement.textContent = bet.label;
            betElement.onclick = () => this.placeBet(bet.numbers, bet.type, bet.odds);
            outsideBets.appendChild(betElement);
        });

        // Agregar apuestas de docenas
        const dozens = [
            { label: '1-12', numbers: this.getRange(1, 12) },
            { label: '13-24', numbers: this.getRange(13, 24) },
            { label: '25-36', numbers: this.getRange(25, 36) }
        ];

        dozens.forEach(dozen => {
            const dozenElement = document.createElement('div');
            dozenElement.className = 'outside-bet';
            dozenElement.textContent = dozen.label;
            dozenElement.onclick = () => this.placeBet(dozen.numbers, 'dozen', 2);
            outsideBets.appendChild(dozenElement);
        });

        container.appendChild(outsideBets);
    }

    createBettingControls(container) {
        const controls = document.createElement('div');
        controls.className = 'betting-controls';

        const clearButton = document.createElement('button');
        clearButton.className = 'clear-bets-btn';
        clearButton.textContent = 'Limpiar Apuestas';
        clearButton.onclick = () => this.clearAllBets();

        controls.appendChild(clearButton);
        container.appendChild(controls);
    }

    // Métodos auxiliares para el sistema de apuestas
    selectChip(value) {
        this.selectedChip = value;
        // Actualizar visualización de fichas
        document.querySelectorAll('.chip').forEach(chip => {
            chip.classList.remove('active');
        });
        document.querySelector(`.chip-${value}`).classList.add('active');
        document.getElementById('selected-chip').textContent = value;
    }

    placeBet(numbers, type, odds) {
        if (this.girando || this.selectedChip > this.bankValue) return;

        const betAmount = Math.min(this.selectedChip, this.bankValue);
        if (betAmount <= 0) return;

        // Crear o actualizar apuesta
        const existingBet = this.bets.find(bet => 
            bet.type === type && this.arraysEqual(bet.numbers, numbers)
        );

        if (existingBet) {
            existingBet.amount += betAmount;
        } else {
            this.bets.push({
                numbers: Array.isArray(numbers) ? numbers : [parseInt(numbers)],
                type,
                odds,
                amount: betAmount
            });
        }

        this.bankValue -= betAmount;
        this.currentBet += betAmount;
        this.updateBetInfo();
        
        // Mostrar fichas después de un breve delay para una mejor experiencia visual
        setTimeout(() => {
            this.showPlacedChips();
        }, 50);
    }

    clearAllBets() {
        this.bankValue += this.currentBet;
        this.currentBet = 0;
        this.bets = [];
        this.updateBetInfo();
        this.removePlacedChips();
    }

    updateBetInfo() {
        document.getElementById('bank-value').textContent = this.bankValue;
        document.getElementById('total-bet').textContent = this.currentBet;
    }

    showPlacedChips() {
        this.removePlacedChips();
        
        // Agrupar apuestas por elemento objetivo
        const chipsByElement = new Map();
        
        this.bets.forEach((bet, betIndex) => {
            const targetElement = this.findTargetElement(bet);
            if (targetElement) {
                if (!chipsByElement.has(targetElement)) {
                    chipsByElement.set(targetElement, []);
                }
                chipsByElement.get(targetElement).push(bet);
            }
        });

        // Crear fichas para cada elemento
        chipsByElement.forEach((bets, targetElement) => {
            this.createChipsForElement(targetElement, bets);
        });
    }

    createChipsForElement(targetElement, bets) {
        targetElement.style.position = 'relative';
        
        // Calcular el total de fichas y su valor
        const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
        const chipCount = bets.length;
        
        // Crear un contenedor para las fichas
        const chipContainer = document.createElement('div');
        chipContainer.className = 'chip-container placed-chip';
        chipContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            pointer-events: none;
        `;

        if (chipCount === 1) {
            // Una sola ficha
            const chip = this.createSingleChip(bets[0]);
            chipContainer.appendChild(chip);
        } else {
            // Múltiples fichas - crear stack
            this.createChipStack(chipContainer, bets, totalAmount);
        }

        targetElement.appendChild(chipContainer);
    }

    createSingleChip(bet) {
        const chip = document.createElement('div');
        chip.className = 'placed-chip-element';
        
        // Obtener color de la ficha basado en el valor
        const chipColor = this.getChipColor(bet.amount);
        
        chip.style.cssText = `
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${chipColor.gradient};
            border: 2px solid ${chipColor.border};
            color: ${chipColor.text};
            font-size: 10px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            position: relative;
        `;
        chip.textContent = bet.amount;
        return chip;
    }

    getChipColor(amount) {
        // Colores de fichas basados en valores de casino real
        if (amount >= 100) {
            return {
                gradient: 'linear-gradient(145deg, #800080, #4B0082)',
                border: '#4B0080',
                text: '#FFF'
            };
        } else if (amount >= 25) {
            return {
                gradient: 'linear-gradient(145deg, #00AA00, #006600)',
                border: '#004400',
                text: '#FFF'
            };
        } else if (amount >= 10) {
            return {
                gradient: 'linear-gradient(145deg, #FF8C00, #FF4500)',
                border: '#CC3300',
                text: '#FFF'
            };
        } else if (amount >= 5) {
            return {
                gradient: 'linear-gradient(145deg, #0066CC, #004499)',
                border: '#002266',
                text: '#FFF'
            };
        } else {
            return {
                gradient: 'linear-gradient(145deg, #DC143C, #8B0000)',
                border: '#660000',
                text: '#FFF'
            };
        }
    }

    createChipStack(container, bets, totalAmount) {
        // Crear fichas apiladas con efecto 3D
        bets.forEach((bet, index) => {
            const chip = document.createElement('div');
            chip.className = 'placed-chip-element';
            
            // Obtener color de la ficha
            const chipColor = this.getChipColor(bet.amount);
            
            chip.style.cssText = `
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: ${chipColor.gradient};
                border: 2px solid ${chipColor.border};
                color: ${chipColor.text};
                font-size: 8px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                position: absolute;
                top: ${index * -2}px;
                left: ${index * -1}px;
                z-index: ${10 + index};
            `;
            
            // Mostrar valor individual en cada ficha, o total en la superior
            if (index === bets.length - 1 && bets.length > 2) {
                chip.textContent = totalAmount; // Mostrar total en la ficha superior
                // Color especial para la ficha superior cuando hay múltiples apuestas
                chip.style.background = 'linear-gradient(145deg, #FFD700, #FFA500)';
                chip.style.borderColor = '#B8860B';
                chip.style.color = '#000';
            } else {
                chip.textContent = bet.amount;
            }
            
            container.appendChild(chip);
        });
    }

    removePlacedChips() {
        document.querySelectorAll('.placed-chip').forEach(chip => chip.remove());
    }

    // Métodos utilitarios
    getNumberClass(number) {
        if (number === 0) return 'green';
        return this.numRed.includes(number) ? 'red' : 'black';
    }

    getColumnNumbers(row) {
        const numbers = [];
        for (let i = 3 - row; i <= 36; i += 3) {
            numbers.push(i);
        }
        return numbers;
    }

    getRange(start, end) {
        const range = [];
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    }

    getEvenNumbers() {
        const evens = [];
        for (let i = 2; i <= 36; i += 2) {
            evens.push(i);
        }
        return evens;
    }

    getOddNumbers() {
        const odds = [];
        for (let i = 1; i <= 36; i += 2) {
            odds.push(i);
        }
        return odds;
    }

    getBlackNumbers() {
        const blacks = [];
        for (let i = 1; i <= 36; i++) {
            if (!this.numRed.includes(i)) {
                blacks.push(i);
            }
        }
        return blacks;
    }

    arraysEqual(a, b) {
        if (!Array.isArray(a) || !Array.isArray(b)) return false;
        if (a.length !== b.length) return false;
        return a.every((val, index) => val === b[index]);
    }

    // Modificar el método completarGiro para incluir cálculo de ganancias
    calcularGanancias(numeroGanador) {
        let totalWin = 0;
        let winningBets = [];

        this.bets.forEach(bet => {
            if (bet.numbers.includes(parseInt(numeroGanador))) {
                const winAmount = bet.amount * bet.odds;
                totalWin += winAmount + bet.amount; // Incluye la apuesta original
                winningBets.push({ ...bet, winAmount });
            }
        });

        if (totalWin > 0) {
            this.bankValue += totalWin;
            console.log(`🎉 ¡Ganaste ${totalWin}! Apuestas ganadoras:`, winningBets);
        }

        // Limpiar apuestas después del giro
        this.currentBet = 0;
        this.bets = [];
        this.updateBetInfo();
        this.removePlacedChips();

        return totalWin;
    }

    // Métodos auxiliares para mostrar fichas

    findTargetElement(bet) {
        const bettingBoard = document.getElementById('betting_board');
        if (!bettingBoard) return null;

        switch (bet.type) {
            case 'straight':
                // Apuesta a un número específico
                const number = bet.numbers[0];
                const numberBlocks = bettingBoard.querySelectorAll('.number-block');
                for (let block of numberBlocks) {
                    if (block.textContent.trim() === number.toString()) {
                        return block;
                    }
                }
                return null;
            
            case 'red':
                return this.findElementByText(bettingBoard, '.red-bet, .outside-bet', 'ROJO');
            
            case 'black':
                return this.findElementByText(bettingBoard, '.black-bet, .outside-bet', 'NEGRO');
            
            case 'even':
                return this.findElementByText(bettingBoard, '.outside-bet', 'PAR');
            
            case 'odd':
                return this.findElementByText(bettingBoard, '.outside-bet', 'IMPAR');
            
            case 'low':
                return this.findElementByText(bettingBoard, '.outside-bet', '1-18');
            
            case 'high':
                return this.findElementByText(bettingBoard, '.outside-bet', '19-36');
            
            case 'dozen':
                const firstNumber = bet.numbers[0];
                if (firstNumber <= 12) {
                    return this.findElementByText(bettingBoard, '.outside-bet', '1-12');
                } else if (firstNumber <= 24) {
                    return this.findElementByText(bettingBoard, '.outside-bet', '13-24');
                } else {
                    return this.findElementByText(bettingBoard, '.outside-bet', '25-36');
                }
            
            case 'column':
                const columnIndex = this.getColumnIndex(bet.numbers);
                const columnBets = bettingBoard.querySelectorAll('.column-bet');
                return columnBets[columnIndex] || null;
            
            default:
                return null;
        }
    }

    findElementByText(container, selector, text) {
        const elements = container.querySelectorAll(selector);
        for (let element of elements) {
            if (element.textContent.trim() === text) {
                return element;
            }
        }
        return null;
    }

    positionChipOnElement(chipElement, targetElement, betIndex) {
        targetElement.style.position = 'relative';
        
        // Calcular posición para evitar superposiciones
        const existingChips = targetElement.querySelectorAll('.placed-chip').length;
        const offset = existingChips * 3; // Desplazamiento incremental
        
        // Posicionar la ficha
        chipElement.style.top = `${5 + offset}px`;
        chipElement.style.right = `${5 + offset}px`;
        
        // Si hay muchas fichas, usar una estrategia en espiral
        if (existingChips >= 3) {
            const angle = (existingChips - 3) * 60; // 60 grados entre fichas
            const radius = 15;
            const centerX = targetElement.offsetWidth / 2;
            const centerY = targetElement.offsetHeight / 2;
            
            const x = centerX + Math.cos(angle * Math.PI / 180) * radius;
            const y = centerY + Math.sin(angle * Math.PI / 180) * radius;
            
            chipElement.style.top = `${y - 10}px`;
            chipElement.style.left = `${x - 10}px`;
            chipElement.style.right = 'auto';
        }
    }

    getColumnIndex(numbers) {
        // Determinar qué columna basándose en los números
        const firstNumber = numbers[0];
        if (firstNumber % 3 === 1) return 0; // Primera columna
        if (firstNumber % 3 === 2) return 1; // Segunda columna
        return 2; // Tercera columna
    }

    // ...existing code...
}

// Inicializar la ruleta cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que la API esté disponible
    if (window.apiClient) {
        window.apiClient.updateActivity('roulette');
    }
    
    window.ruleta = new Ruleta();
});

// La ruleta ahora sigue el orden tradicional de casino europeo:
// 0(Verde), 32(Rojo), 15(Negro), 19(Rojo), 4(Negro), 21(Rojo), 2(Negro), 25(Rojo), 17(Negro), 34(Rojo), 6(Negro), 27(Rojo),
// 13(Negro), 36(Rojo), 11(Negro), 30(Rojo), 8(Negro), 23(Rojo), 10(Negro), 5(Rojo), 24(Negro), 16(Rojo), 33(Negro), 1(Rojo),
// 20(Negro), 14(Rojo), 31(Negro), 9(Rojo), 22(Negro), 18(Rojo), 29(Negro), 7(Rojo), 28(Negro), 12(Rojo), 35(Negro), 3(Rojo), 26(Negro)
