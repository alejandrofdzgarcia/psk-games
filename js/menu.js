// JavaScript para el menú principal
class MenuPrincipal {
    constructor() {
        this.initEventListeners();
        this.initAnimations();
    }

    initEventListeners() {
        // Agregar eventos de hover para efectos adicionales
        const cards = document.querySelectorAll('.menu-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', this.onCardHover);
            card.addEventListener('mouseleave', this.onCardLeave);
        });

        // Efecto de paralaje suave al scroll
        window.addEventListener('scroll', this.onScroll);
    }

    onCardHover(event) {
        // Efecto de brillo en hover
        event.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 255, 255, 0.1)';
    }

    onCardLeave(event) {
        // Restaurar sombra original
        event.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
    }

    onScroll() {
        // Efecto parallax suave para las cards
        const scrolled = window.pageYOffset;
        const cards = document.querySelectorAll('.menu-card');
        
        cards.forEach((card, index) => {
            const rate = scrolled * -0.1 * (index % 2 === 0 ? 1 : -1);
            card.style.transform = `translateY(${rate}px)`;
        });
    }

    initAnimations() {
        // Animación de entrada progresiva para las cards
        const cards = document.querySelectorAll('.menu-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });

        // Animación del título
        const title = document.querySelector('h1');
        title.style.opacity = '0';
        title.style.transform = 'translateY(-30px)';
        
        setTimeout(() => {
            title.style.transition = 'all 0.8s ease';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 100);

        // Animación del subtítulo
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                subtitle.style.transition = 'all 0.8s ease';
                subtitle.style.opacity = '1';
                subtitle.style.transform = 'translateY(0)';
            }, 300);
        }
    }
}

// Función de navegación
function navigateTo(page) {
    // Efecto de transición antes de navegar
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0.7';
    
    setTimeout(() => {
        // Navegar a la página específica
        window.location.href = page;
    }, 200);
}

// Función para crear páginas de ruleta específicas
function createRuletaPage(page) {
    const pageType = page.replace('.html', '');
    
    // Configuraciones predefinidas para cada tipo de ruleta
    const ruletaConfigs = {
        'ruleta-personalizada': {
            title: 'Ruleta Personalizada',
            options: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6'],
            allowCustomOptions: true
        },
        'ruleta-comida': {
            title: 'Ruleta de Comida',
            options: ['Pizza', 'Hamburguesa', 'Tacos', 'Sushi', 'Pasta', 'Ensalada', 'Pollo', 'Pescado'],
            allowCustomOptions: true
        },
        'ruleta-actividades': {
            title: 'Ruleta de Actividades',
            options: ['Ver Netflix', 'Leer un libro', 'Hacer ejercicio', 'Cocinar', 'Videojuegos', 'Pasear', 'Llamar a un amigo', 'Estudiar'],
            allowCustomOptions: true
        },
        'ruleta-decisiones': {
            title: 'Ruleta de Decisiones',
            options: ['Sí', 'No', 'Tal vez', 'Mejor no', 'Definitivamente', 'Espera un poco', 'Pregunta mañana', 'Es posible'],
            allowCustomOptions: false
        },
        'ruleta-colores': {
            title: 'Ruleta de Colores',
            options: ['Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja', 'Violeta', 'Rosa', 'Turquesa'],
            allowCustomOptions: false
        },
        'ruleta-numeros': {
            title: 'Ruleta de Números',
            options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            allowCustomOptions: false
        }
    };

    const config = ruletaConfigs[pageType];
    
    if (config) {
        // Simular navegación creando una nueva página temporalmente
        alert(`Navegando a: ${config.title}\n\nOpciones disponibles:\n${config.options.join(', ')}\n\n¡Próximamente crearemos esta página!`);
        
        // Restaurar la opacidad
        document.body.style.opacity = '1';
        
        // Aquí podrías llamar a una función para crear la página real
        console.log(`Configuración para ${pageType}:`, config);
    }
}

// Efectos adicionales
function createFloatingParticles() {
    // Crear partículas flotantes de fondo
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
        `;
        document.body.appendChild(particle);
    }
}

// CSS para partículas flotantes
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }
    
    .floating-particle {
        animation-delay: ${Math.random() * 3}s !important;
    }
`;
document.head.appendChild(style);

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const menu = new MenuPrincipal();
    createFloatingParticles();
    
    // Mensaje de bienvenida
    console.log('🎯 Bienvenido a Ruleta de la Suerte!');
    console.log('Navega por las diferentes opciones para encontrar tu ruleta ideal.');
});

// Función para volver al menú principal (útil para otras páginas)
function volverAlMenu() {
    window.location.href = 'index.html';
}
