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
            '#DC143C', '#228B22', '#DC143C', '#000000', '#DC143C', '#228B22', 
            '#DC143C', '#000000', '#DC143C', '#228B22', '#DC143C', '#000000',
            '#DC143C', '#228B22', '#DC143C', '#000000', '#DC143C', '#228B22'
        ];
        this.girando = false;
        this.rotacionActual = 0;
        
        this.initEventListeners();
        this.actualizarRuleta();
        this.mostrarOpciones();
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

    actualizarRuleta() {
        const wheel = document.getElementById('wheel');
        wheel.innerHTML = '';

        if (this.opciones.length === 0) {
            wheel.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 18px; color: rgba(255,255,255,0.7);">Agrega opciones para comenzar</div>';
            return;
        }

        const anguloPorSeccion = 360 / this.opciones.length;

        this.opciones.forEach((opcion, index) => {
            const seccion = document.createElement('div');
            seccion.className = 'wheel-section';
            seccion.style.backgroundColor = this.colores[index % this.colores.length];
            
            // Crear una sección triangular que apunte al centro
            const anguloInicio = index * anguloPorSeccion;
            const anguloFin = (index + 1) * anguloPorSeccion;
            
            // Posicionar la sección usando clip-path para crear forma triangular
            seccion.style.clipPath = `polygon(50% 50%, 
                ${50 + 50 * Math.cos((anguloInicio - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((anguloInicio - 90) * Math.PI / 180)}%, 
                ${50 + 50 * Math.cos((anguloFin - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((anguloFin - 90) * Math.PI / 180)}%)`;
            
            // Crear el texto de la opción
            const texto = document.createElement('div');
            texto.className = 'wheel-text';
            texto.textContent = opcion;
            
            // Posicionar el texto en el centro de la sección
            const anguloMedio = (anguloInicio + anguloFin) / 2;
            const radioTexto = 60; // Distancia del centro donde aparece el texto
            const x = 50 + radioTexto * Math.cos((anguloMedio - 90) * Math.PI / 180);
            const y = 50 + radioTexto * Math.sin((anguloMedio - 90) * Math.PI / 180);
            
            texto.style.position = 'absolute';
            texto.style.left = x + '%';
            texto.style.top = y + '%';
            texto.style.transform = 'translate(-50%, -50%)';
            texto.style.color = 'white';
            texto.style.fontWeight = 'bold';
            texto.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)';
            texto.style.fontSize = opcion.length > 10 ? '12px' : '14px';
            texto.style.pointerEvents = 'none';
            texto.style.zIndex = '2';

            wheel.appendChild(seccion);
            wheel.appendChild(texto);
        });

        // Agregar el centro de la ruleta
        const centro = document.createElement('div');
        centro.className = 'wheel-center';
        wheel.appendChild(centro);
    }

    girarRuleta() {
        if (this.girando || this.opciones.length === 0) return;

        this.girando = true;
        const spinButton = document.getElementById('spinButton');
        const result = document.getElementById('result');
        
        spinButton.disabled = true;
        spinButton.textContent = 'Girando...';
        result.textContent = '';
        result.classList.remove('winner-animation');

        // Generar rotación aleatoria (múltiples vueltas + ángulo final)
        const vueltasMinimas = 5;
        const vueltasExtras = Math.floor(Math.random() * 5);
        const anguloFinal = Math.random() * 360;
        const rotacionTotal = (vueltasMinimas + vueltasExtras) * 360 + anguloFinal;

        this.rotacionActual += rotacionTotal;

        const wheel = document.getElementById('wheel');
        wheel.style.transform = `rotate(${this.rotacionActual}deg)`;

        // Calcular el ganador
        setTimeout(() => {
            // El puntero está en la parte superior (270 grados), ajustamos el cálculo
            const anguloNormalizado = (90 - (this.rotacionActual % 360) + 360) % 360;
            const anguloPorSeccion = 360 / this.opciones.length;
            const indiceGanador = Math.floor(anguloNormalizado / anguloPorSeccion);
            const ganador = this.opciones[indiceGanador];

            // Mostrar resultado
            result.textContent = `🎉 ¡${ganador}! 🎉`;
            result.classList.add('winner-animation');

            // Efectos de sonido simulados con console
            console.log(`🎉 ¡GANADOR: ${ganador}! 🎉`);

            // Resetear botón
            this.girando = false;
            spinButton.disabled = false;
            spinButton.textContent = '¡GIRAR RULETA!';

        }, 4000); // Duración de la animación
    }

    agregarOpcion() {
        const input = document.getElementById('newOption');
        const nuevaOpcion = input.value.trim();

        if (nuevaOpcion && !this.opciones.includes(nuevaOpcion)) {
            this.opciones.push(nuevaOpcion);
            input.value = '';
            this.actualizarRuleta();
            this.mostrarOpciones();
        } else if (this.opciones.includes(nuevaOpcion)) {
            alert('Esta opción ya existe');
        }
    }

    eliminarOpcion(index) {
        if (this.opciones.length > 1) {
            this.opciones.splice(index, 1);
            this.actualizarRuleta();
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
        const wheel = document.getElementById('wheel');
        const result = document.getElementById('result');
        
        wheel.style.transform = 'rotate(0deg)';
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
            this.actualizarRuleta();
            this.mostrarOpciones();
        }
    }

    // Método para agregar múltiples opciones desde código
    configurarOpciones(nuevasOpciones) {
        if (Array.isArray(nuevasOpciones) && nuevasOpciones.length > 0) {
            this.opciones = nuevasOpciones;
            this.actualizarRuleta();
            this.mostrarOpciones();
        }
    }

    // Método para obtener todas las opciones
    obtenerOpciones() {
        return [...this.opciones];
    }
}

// Funciones auxiliares para efectos adicionales
function crearConfetti() {
    // Simulación de confetti con elementos DOM
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'][Math.floor(Math.random() * 5)];
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            confetti.style.borderRadius = '50%';
            
            document.body.appendChild(confetti);
            
            // Animación de caída
            let position = -10;
            const fall = setInterval(() => {
                position += 5;
                confetti.style.top = position + 'px';
                confetti.style.transform = `rotate(${position * 2}deg)`;
                
                if (position > window.innerHeight) {
                    clearInterval(fall);
                    confetti.remove();
                }
            }, 50);
        }, i * 100);
    }
}

// Inicializar la ruleta cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.ruleta = new Ruleta();
    
    // Agregar evento de confetti cuando hay un ganador
    const originalGirar = window.ruleta.girarRuleta;
    window.ruleta.girarRuleta = function() {
        originalGirar.call(this);
        
        // Agregar confetti después del resultado
        setTimeout(() => {
            crearConfetti();
        }, 4000);
    };
});

// Ejemplos de uso que puedes llamar desde la consola del navegador:
// ruleta.configurarOpciones(['Pizza', 'Hamburguesa', 'Tacos', 'Sushi', 'Pasta']);
// ruleta.obtenerOpciones();
