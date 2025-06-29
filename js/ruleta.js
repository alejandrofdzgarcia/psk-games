class Ruleta {
    constructor() {
        // Configuración de la ruleta europea
        this.opciones = [
            "0", "32", "15", "19", "4", "21", "2", "25", "17", "34", "6", "27",
            "13", "36", "11", "30", "8", "23", "10", "5", "24", "16", "33", "1",
            "20", "14", "31", "9", "22", "18", "29", "7", "28", "12", "35", "3", "26"
        ];
        
        this.colores = this.generarColoresCasino();
        this.girando = false;
        this.rotacionActual = 0;
        
        // Canvas properties
        this.canvas = null;
        this.ctx = null;
        this.centerX = 200;
        this.centerY = 200;
        this.outerRadius = 180;
        this.innerRadius = 40;
        
        // Audio
        this.audioContext = null;
        this.ultimoSegmento = null;
        
        // Sistema de apuestas
        this.bankValue = 1000;
        this.currentBet = 0;
        this.selectedChip = 5;
        this.bets = [];
        this.numRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        
        this.init();
    }

    init() {
        this.initAudio();
        this.initCanvas();
        this.initEventListeners();
        this.buildBettingBoard();
        this.dibujarRuleta();
    }

    generarColoresCasino() {
        return [
            '#00AA00', '#DC143C', '#1A1A1A', '#DC143C', '#1A1A1A', '#DC143C', '#1A1A1A',
            '#DC143C', '#1A1A1A', '#DC143C', '#1A1A1A', '#DC143C', '#1A1A1A', '#DC143C',
            '#1A1A1A', '#DC143C', '#1A1A1A', '#DC143C', '#1A1A1A', '#DC143C', '#1A1A1A',
            '#DC143C', '#1A1A1A', '#DC143C', '#1A1A1A', '#DC143C', '#1A1A1A', '#DC143C',
            '#1A1A1A', '#DC143C', '#1A1A1A', '#DC143C', '#1A1A1A', '#DC143C', '#1A1A1A',
            '#DC143C', '#1A1A1A'
        ];
    }

    // =================== AUDIO ===================
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

    // =================== CANVAS ===================
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
        document.getElementById('spinButton').addEventListener('click', () => {
            this.girarRuleta();
        });
    }

    dibujarRuleta() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.opciones.length === 0) {
            this.dibujarMensajeVacio();
            return;
        }

        const anguloPorSegmento = 360 / this.opciones.length;

        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(this.gradosARadianes(this.rotacionActual));
        this.ctx.translate(-this.centerX, -this.centerY);

        this.opciones.forEach((opcion, index) => {
            const anguloInicio = index * anguloPorSegmento;
            const anguloFin = (index + 1) * anguloPorSegmento;
            this.dibujarSegmento(anguloInicio, anguloFin, this.colores[index], opcion);
        });

        this.ctx.restore();
        this.dibujarCentro();
        this.dibujarIndicador();
    }

    dibujarSegmento(anguloInicio, anguloFin, color, texto) {
        const startAngleRad = this.gradosARadianes(anguloInicio - 90);
        const endAngleRad = this.gradosARadianes(anguloFin - 90);

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.outerRadius, startAngleRad, endAngleRad);
        this.ctx.arc(this.centerX, this.centerY, this.innerRadius, endAngleRad, startAngleRad, true);
        this.ctx.closePath();

        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.dibujarTextoSegmento(anguloInicio, anguloFin, texto);
    }

    dibujarTextoSegmento(anguloInicio, anguloFin, texto) {
        const anguloMedio = (anguloInicio + anguloFin) / 2;
        const anguloMedioRad = this.gradosARadianes(anguloMedio - 90);
        const radioTexto = this.outerRadius - 25;
        const x = this.centerX + Math.cos(anguloMedioRad) * radioTexto;
        const y = this.centerY + Math.sin(anguloMedioRad) * radioTexto;

        this.ctx.save();
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = `bold ${texto.length > 1 ? '14' : '16'}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 3;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;

        this.ctx.translate(x, y);
        if (anguloMedio > 90 && anguloMedio < 270) {
            this.ctx.rotate(this.gradosARadianes(anguloMedio + 180));
        } else {
            this.ctx.rotate(this.gradosARadianes(anguloMedio));
        }

        this.ctx.fillText(texto, 0, 0);
        this.ctx.restore();
    }

    dibujarCentro() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.innerRadius, 0, 2 * Math.PI);
        
        const gradient = this.ctx.createRadialGradient(
            this.centerX - 10, this.centerY - 10, 0,
            this.centerX, this.centerY, this.innerRadius
        );
        gradient.addColorStop(0, '#F3C620');
        gradient.addColorStop(0.6, '#DAA520');
        gradient.addColorStop(1, '#1A1608');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.strokeStyle = '#B8860B';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.innerRadius * 0.6, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#8B6914';
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 3, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#2F1B14';
        this.ctx.fill();
    }

    dibujarIndicador() {
        this.ctx.save();
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#B8860B';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, 10);
        this.ctx.lineTo(this.centerX - 12, 30);
        this.ctx.lineTo(this.centerX + 12, 30);
        this.ctx.closePath();
        
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }

    dibujarMensajeVacio() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Ruleta de Casino Lista', this.centerX, this.centerY);
    }

    // =================== GIRO ===================
    girarRuleta() {
        if (this.girando || this.opciones.length === 0) return;

        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.girando = true;
        const spinButton = document.getElementById('spinButton');
        const result = document.getElementById('result');
        
        spinButton.disabled = true;
        spinButton.textContent = 'Girando...';
        result.textContent = '';
        result.classList.remove('winner-animation');

        const vueltasMinimas = 5;
        const vueltasExtras = Math.random() * 5;
        const anguloFinal = Math.random() * 360;
        const rotacionTotal = (vueltasMinimas + vueltasExtras) * 360 + anguloFinal;

        const rotacionInicial = this.rotacionActual;
        const rotacionObjetivo = rotacionInicial + rotacionTotal;
        const duracion = 4000;
        const tiempoInicio = Date.now();
        this.ultimoSegmento = null;

        const animar = () => {
            const tiempoActual = Date.now();
            const tiempoTranscurrido = tiempoActual - tiempoInicio;
            const progreso = Math.min(tiempoTranscurrido / duracion, 1);
            const easeOut = 1 - Math.pow(1 - progreso, 3);
            
            this.rotacionActual = rotacionInicial + (rotacionTotal * easeOut);
            this.dibujarRuleta();
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
        const anguloNormalizado = (360 - (this.rotacionActual % 360)) % 360;
        const anguloPorSegmento = 360 / this.opciones.length;
        const indiceGanador = Math.floor(anguloNormalizado / anguloPorSegmento) % this.opciones.length;
        const ganador = this.opciones[indiceGanador];

        const ganancias = this.calcularGanancias(ganador);
        this.mostrarResultado(ganador, indiceGanador, ganancias);
        this.guardarResultado(ganador, this.colores[indiceGanador]);
        this.resetearControles();
    }

    mostrarResultado(ganador, indice, ganancias) {
        const result = document.getElementById('result');
        let mensajeColor = '#FFD700';
        let resultText = '';
        
        if (ganador === "0") {
            mensajeColor = '#00AA00';
            resultText = `🎉 ¡${ganador} - VERDE! 🎉`;
        } else {
            const colorGanador = this.colores[indice];
            if (colorGanador === '#DC143C') {
                mensajeColor = '#DC143C';
                resultText = `🎉 ¡${ganador} - ROJO! 🎉`;
            } else {
                mensajeColor = '#1A1A1A';
                resultText = `🎉 ¡${ganador} - NEGRO! 🎉`;
            }
        }

        if (ganancias > 0) {
            resultText += ` 💰 Ganaste: ${ganancias}`;
        }

        result.textContent = resultText;
        result.style.color = mensajeColor;
        result.classList.add('winner-animation');
        
        this.crearConfetti();
    }

    resetearControles() {
        this.girando = false;
        const spinButton = document.getElementById('spinButton');
        spinButton.disabled = false;
        spinButton.textContent = '¡GIRAR RULETA!';
    }

    // =================== API ===================
    async guardarResultado(numero, color) {
        try {
            const colorName = this.getColorName(color);
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

    getColorName(hexColor) {
        if (window.apiClient && typeof window.apiClient.getColorName === 'function') {
            return window.apiClient.getColorName(hexColor);
        }
        
        switch (hexColor) {
            case '#00AA00': return 'VERDE';
            case '#DC143C': return 'ROJO';
            case '#1A1A1A': return 'NEGRO';
            default: return 'DESCONOCIDO';
        }
    }

    // =================== EFECTOS ===================
    crearConfetti() {
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    width: ${Math.random() * 8 + 4}px;
                    height: ${Math.random() * 8 + 4}px;
                    background-color: ${this.colores[Math.floor(Math.random() * this.colores.length)]};
                    pointer-events: none;
                    z-index: 1000;
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                    opacity: ${Math.random() * 0.7 + 0.3};
                `;
                
                document.body.appendChild(confetti);
                
                let position = -10;
                let rotation = 0;
                let velocity = Math.random() * 3 + 2;
                const wind = (Math.random() - 0.5) * 2;
                
                const fall = setInterval(() => {
                    position += velocity;
                    rotation += 5;
                    velocity += 0.1;
                    
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

    // =================== APUESTAS ===================
    buildBettingBoard() {
        const bettingBoard = document.getElementById('betting_board');
        if (!bettingBoard) return;

        bettingBoard.innerHTML = '';
        this.createChipSection(bettingBoard);
        this.createBetInfo(bettingBoard);
        this.createNumberBoard(bettingBoard);
        this.createOutsideBets(bettingBoard);
        this.createBettingControls(bettingBoard);
    }

    createChipSection(container) {
        const chipSection = document.createElement('div');
        chipSection.className = 'chip-section';

        [1, 5, 10, 25, 100].forEach(value => {
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

        // Casilla del 0
        const zero = document.createElement('div');
        zero.className = 'number-block number-0 green';
        zero.textContent = '0';
        zero.onclick = () => this.placeBet('0', 'straight', 35);
        numberBoard.appendChild(zero);

        // Números 1-36
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

            // Apuesta de columna
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

        // Docenas
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

    // =================== MÉTODOS DE APUESTAS ===================
    selectChip(value) {
        this.selectedChip = value;
        document.querySelectorAll('.chip').forEach(chip => chip.classList.remove('active'));
        document.querySelector(`.chip-${value}`).classList.add('active');
        document.getElementById('selected-chip').textContent = value;
    }

    placeBet(numbers, type, odds) {
        if (this.girando || this.selectedChip > this.bankValue) return;

        const betAmount = Math.min(this.selectedChip, this.bankValue);
        if (betAmount <= 0) return;

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
        setTimeout(() => this.showPlacedChips(), 50);
    }

    clearAllBets() {
        this.bankValue += this.currentBet;
        this.currentBet = 0;
        this.bets = [];
        this.updateBetInfo();
        this.removePlacedChips();
    }

    calcularGanancias(numeroGanador) {
        let totalWin = 0;

        this.bets.forEach(bet => {
            if (bet.numbers.includes(parseInt(numeroGanador))) {
                const winAmount = bet.amount * bet.odds;
                totalWin += winAmount + bet.amount;
            }
        });

        if (totalWin > 0) {
            this.bankValue += totalWin;
        }

        this.currentBet = 0;
        this.bets = [];
        this.updateBetInfo();
        this.removePlacedChips();

        return totalWin;
    }

    // =================== MÉTODOS AUXILIARES ===================
    gradosARadianes(grados) {
        return grados * Math.PI / 180;
    }

    updateBetInfo() {
        document.getElementById('bank-value').textContent = this.bankValue;
        document.getElementById('total-bet').textContent = this.currentBet;
    }

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
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    getEvenNumbers() {
        return Array.from({ length: 18 }, (_, i) => (i + 1) * 2);
    }

    getOddNumbers() {
        return Array.from({ length: 18 }, (_, i) => (i * 2) + 1);
    }

    getBlackNumbers() {
        return Array.from({ length: 36 }, (_, i) => i + 1).filter(n => !this.numRed.includes(n));
    }

    arraysEqual(a, b) {
        return Array.isArray(a) && Array.isArray(b) && 
               a.length === b.length && 
               a.every((val, index) => val === b[index]);
    }

    // Métodos adicionales para fichas (versión simplificada)
    showPlacedChips() {
        this.removePlacedChips();
        // Implementación simplificada para mostrar fichas
    }

    removePlacedChips() {
        document.querySelectorAll('.placed-chip').forEach(chip => chip.remove());
    }

    findTargetElement(bet) {
        // Implementación simplificada para encontrar elementos objetivo
        return null;
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    if (window.apiClient) {
        window.apiClient.updateActivity('roulette');
    }
    window.ruleta = new Ruleta();
});
