class Ruleta {
    constructor() {
        this.opciones = [
            "Opción 1",
            "Opción 2", 
            "Opción 3",
            "Opción 4",
            "Opción 5",
            "Opción 6"
        ];
        this.colores = [
            '#DC143C', '#228B22', '#1E90FF', '#FF8C00', '#9370DB', '#FF1493', 
            '#00CED1', '#32CD32', '#FFD700', '#FF6347', '#8A2BE2', '#00FF7F',
            '#FF69B4', '#4169E1', '#FFA500', '#8B008B', '#00FA9A', '#FF4500'
        ];
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
        this.mostrarOpciones();
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
        // Botón de girar
        document.getElementById('spinButton').addEventListener('click', () => {
            this.girarRuleta();
        });

        // Botón de reiniciar
        document.getElementById('resetButton').addEventListener('click', () => {
            this.reiniciarRuleta();
        });

        // Botón de agregar opción
        document.getElementById('addOption').addEventListener('click', () => {
            this.agregarOpcion();
        });

        // Enter en el input para agregar opción
        document.getElementById('newOption').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.agregarOpcion();
            }
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
        this.ctx.font = `bold ${texto.length > 10 ? '12' : '14'}px Arial`;
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
        this.ctx.fillText('Agrega opciones para comenzar', this.centerX, this.centerY);
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
        spinButton.textContent = 'Girando...';
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

        // Mostrar resultado
        const result = document.getElementById('result');
        result.textContent = `🎉 ¡${ganador}! 🎉`;
        result.classList.add('winner-animation');

        // Efectos adicionales
        this.crearConfetti();
        console.log(`🎉 ¡GANADOR: ${ganador}! 🎉`);

        // Resetear botón
        this.girando = false;
        const spinButton = document.getElementById('spinButton');
        spinButton.disabled = false;
        spinButton.textContent = '¡GIRAR RULETA!';
    }

    agregarOpcion() {
        const input = document.getElementById('newOption');
        const nuevaOpcion = input.value.trim();

        if (nuevaOpcion && !this.opciones.includes(nuevaOpcion)) {
            this.opciones.push(nuevaOpcion);
            input.value = '';
            this.dibujarRuleta();
            this.mostrarOpciones();
        } else if (this.opciones.includes(nuevaOpcion)) {
            alert('Esta opción ya existe');
        }
    }

    eliminarOpcion(index) {
        if (this.opciones.length > 1) {
            this.opciones.splice(index, 1);
            this.dibujarRuleta();
            this.mostrarOpciones();
        }
    }

    mostrarOpciones() {
        const lista = document.getElementById('optionsList');
        lista.innerHTML = '';

        this.opciones.forEach((opcion, index) => {
            const tag = document.createElement('div');
            tag.className = 'option-tag';
            
            const texto = document.createElement('span');
            texto.textContent = opcion;
            
            const botonEliminar = document.createElement('button');
            botonEliminar.className = 'remove-option';
            botonEliminar.innerHTML = '×';
            botonEliminar.onclick = () => this.eliminarOpcion(index);
            
            tag.appendChild(texto);
            if (this.opciones.length > 1) {
                tag.appendChild(botonEliminar);
            }
            
            lista.appendChild(tag);
        });
    }

    reiniciarRuleta() {
        if (this.girando) return;

        this.rotacionActual = 0;
        this.dibujarRuleta();
        
        const result = document.getElementById('result');
        result.textContent = '';
        result.classList.remove('winner-animation');

        // Opcional: Resetear a opciones por defecto
        const confirmar = confirm('¿Quieres resetear también las opciones a las predeterminadas?');
        if (confirmar) {
            this.opciones = [
                "Opción 1",
                "Opción 2", 
                "Opción 3",
                "Opción 4",
                "Opción 5",
                "Opción 6"
            ];
            this.dibujarRuleta();
            this.mostrarOpciones();
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

    // Método para agregar múltiples opciones desde código
    configurarOpciones(nuevasOpciones) {
        if (Array.isArray(nuevasOpciones) && nuevasOpciones.length > 0) {
            this.opciones = nuevasOpciones;
            this.dibujarRuleta();
            this.mostrarOpciones();
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

// Ejemplos de uso que puedes llamar desde la consola del navegador:
// ruleta.configurarOpciones(['Pizza', 'Hamburguesa', 'Tacos', 'Sushi', 'Pasta']);
// ruleta.obtenerOpciones();
