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
        this.innerRadius = 30;
        this.audioContext = null;
        this.ultimoSegmento = null;
        
        this.initAudio();
        this.initCanvas();
        this.initEventListeners();
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
    }

    dibujarSegmento(anguloInicio, anguloFin, color, texto) {
        const startAngleRad = this.gradosARadianes(anguloInicio - 90);
        const endAngleRad = this.gradosARadianes(anguloFin - 90);

        // Dibujar la forma del segmento
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.outerRadius, startAngleRad, endAngleRad);
        this.ctx.arc(this.centerX, this.centerY, this.innerRadius, endAngleRad, startAngleRad, true);
        this.ctx.closePath();

        // Rellenar el segmento
        this.ctx.fillStyle = color;
        this.ctx.fill();

        // Borde del segmento
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Dibujar el texto
        this.dibujarTextoSegmento(anguloInicio, anguloFin, texto);
    }

    dibujarTextoSegmento(anguloInicio, anguloFin, texto) {
        const anguloMedio = (anguloInicio + anguloFin) / 2;
        const anguloMedioRad = this.gradosARadianes(anguloMedio - 90);
        
        // Calcular posición del texto
        const radioTexto = (this.outerRadius + this.innerRadius) / 2;
        const x = this.centerX + Math.cos(anguloMedioRad) * radioTexto;
        const y = this.centerY + Math.sin(anguloMedioRad) * radioTexto;

        // Guardar el estado del contexto
        this.ctx.save();

        // Configurar el texto
        this.ctx.fillStyle = 'white';
        this.ctx.font = `bold ${texto.length > 2 ? '10' : '14'}px Arial`;
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
        // Círculo exterior del centro
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.innerRadius, 0, 2 * Math.PI);
        
        // Gradiente para el centro
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, this.innerRadius
        );
        gradient.addColorStop(0, '#DAA520');
        gradient.addColorStop(0.5, '#B8860B');
        gradient.addColorStop(1, '#8B7355');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Borde del centro
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Estrella en el centro
        this.ctx.fillStyle = '#8B4513';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('★', this.centerX, this.centerY);
    }

    dibujarMensajeVacio() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        const mensaje = window.i18n ? window.i18n.t('roulette.ready') : 'Ruleta de Casino Lista';
        this.ctx.fillText(mensaje, this.centerX, this.centerY);
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

        const anguloNormalizado = (90 - (this.rotacionActual % 360) + 360) % 360;
        const anguloPorSegmento = 360 / this.opciones.length;
        const segmentoActual = Math.floor(anguloNormalizado / anguloPorSegmento);

        if (this.ultimoSegmento !== null && this.ultimoSegmento !== segmentoActual) {
            this.reproducirSonidoTic();
        }
        
        this.ultimoSegmento = segmentoActual;
    }

    completarGiro() {
        // Calcular el ganador
        const anguloNormalizado = (90 - (this.rotacionActual % 360) + 360) % 360;
        const anguloPorSegmento = 360 / this.opciones.length;
        const indiceGanador = Math.floor(anguloNormalizado / anguloPorSegmento);
        const ganador = this.opciones[indiceGanador];

        // Mostrar resultado con color apropiado
        const result = document.getElementById('result');
        let mensajeColor = '#FFD700'; // Dorado por defecto
        
        if (ganador === "0") {
            mensajeColor = '#00AA00'; // Verde
            const greenText = window.i18n ? window.i18n.t('roulette.winner_green', ganador) : `🎉 ¡${ganador} - VERDE! 🎉`;
            result.textContent = greenText;
        } else {
            // Obtener el color basado en la posición del número ganador
            const colorGanador = this.colores[indiceGanador];
            if (colorGanador === '#DC143C') {
                mensajeColor = '#DC143C'; // Rojo
                const redText = window.i18n ? window.i18n.t('roulette.winner_red', ganador) : `🎉 ¡${ganador} - ROJO! 🎉`;
                result.textContent = redText;
            } else {
                mensajeColor = '#1A1A1A'; // Negro
                const blackText = window.i18n ? window.i18n.t('roulette.winner_black', ganador) : `🎉 ¡${ganador} - NEGRO! 🎉`;
                result.textContent = blackText;
            }
        }
        
        result.style.color = mensajeColor;
        result.classList.add('winner-animation');

        // Efectos adicionales
        this.crearConfetti();
        console.log(`🎉 ¡GANADOR: ${ganador}! 🎉`);

        // Resetear botón
        this.girando = false;
        const spinButton = document.getElementById('spinButton');
        spinButton.disabled = false;
        const spinText = window.i18n ? window.i18n.t('roulette.spin') : '¡GIRAR RULETA!';
        spinButton.textContent = spinText;
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
}

// Inicializar la ruleta cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.ruleta = new Ruleta();
});

// La ruleta ahora sigue el orden tradicional de casino europeo:
// 0(Verde), 32(Rojo), 15(Negro), 19(Rojo), 4(Negro), 21(Rojo), 2(Negro), 25(Rojo), 17(Negro), 34(Rojo), 6(Negro), 27(Rojo),
// 13(Negro), 36(Rojo), 11(Negro), 30(Rojo), 8(Negro), 23(Rojo), 10(Negro), 5(Rojo), 24(Negro), 16(Rojo), 33(Negro), 1(Rojo),
// 20(Negro), 14(Rojo), 31(Negro), 9(Rojo), 22(Negro), 18(Rojo), 29(Negro), 7(Rojo), 28(Negro), 12(Rojo), 35(Negro), 3(Rojo), 26(Negro)
