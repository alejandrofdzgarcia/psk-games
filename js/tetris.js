// Variables globales
let canvas;
let ctx;
let gameLoop;
let gameOver = false;
let score = 0;
let level = 1;
let linesCleared = 0;
let dropSpeed = 1000; // velocidad inicial en milisegundos
let lastTime = 0;
let dropCounter = 0;
let frameId;

// Dimensiones del tablero
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;

// Colores de las piezas
const COLORS = [
    null,
    '#FF0D72', // I
    '#0DC2FF', // J
    '#0DFF72', // L
    '#F538FF', // O
    '#FF8E0D', // S
    '#FFE138', // T
    '#3877FF'  // Z
];

// Formas de las piezas (tetrominós)
const PIECES = [
    null,
    // I
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // J
    [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    // L
    [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ],
    // O
    [
        [4, 4],
        [4, 4]
    ],
    // S
    [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ],
    // T
    [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    // Z
    [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
    ]
];

// Tablero de juego
const board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));

// Pieza actual
const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0
};

// Función para inicializar el juego
function initGame() {
    // Crear y configurar el canvas
    canvas = document.createElement('canvas');
    canvas.width = BLOCK_SIZE * BOARD_WIDTH;
    canvas.height = BLOCK_SIZE * BOARD_HEIGHT;
    canvas.id = 'tetris-canvas';
    ctx = canvas.getContext('2d');

    // Crear contenedor del juego
    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';

    // Crear panel para mostrar puntuación y nivel
    const scorePanel = document.createElement('div');
    scorePanel.className = 'score-panel';
    scorePanel.innerHTML = `
        <div class="score">Puntuación<span id="score">0</span></div>
        <div class="level">Nivel<span id="level">1</span></div>
    `;

    // Controles en pantalla para dispositivos móviles
    const mobileControls = document.createElement('div');
    mobileControls.className = 'mobile-controls';
    mobileControls.innerHTML = `
        <button id="left-btn" class="control-btn">←</button>
        <button id="rotate-btn" class="control-btn">↻</button>
        <button id="right-btn" class="control-btn">→</button>
        <button id="down-btn" class="control-btn">↓</button>
        <button id="hard-drop-btn" class="control-btn hard-drop-btn">CAÍDA RÁPIDA</button>
    `;

    // Añadir título
    const title = document.createElement('h1');
    title.textContent = 'TETRIS';
    title.className = 'game-title';

    // Añadir elementos al contenedor
    gameContainer.appendChild(title);
    gameContainer.appendChild(scorePanel);
    gameContainer.appendChild(canvas);
    gameContainer.appendChild(mobileControls);

    // Añadir contenedor a la página
    document.body.appendChild(gameContainer);

    // Inicializar la pieza
    playerReset();

    // Configurar los controles
    setupControls();

    // Iniciar el bucle del juego
    update();
}

// Dibujar el tablero de juego
function drawBoard() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(board, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

// Dibujar una matriz (pieza o tablero)
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = COLORS[value];
                ctx.fillRect(
                    (x + offset.x) * BLOCK_SIZE,
                    (y + offset.y) * BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                );
                ctx.strokeStyle = '#000';
                ctx.strokeRect(
                    (x + offset.x) * BLOCK_SIZE,
                    (y + offset.y) * BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                );
            }
        });
    });
}

// Verificar colisión entre la pieza y el tablero
function collision(board, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (board[y + o.y] &&
                board[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// Fusionar la pieza con el tablero cuando se establece
function merge(board, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                board[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

// Rotar la matriz (pieza)
function rotate(matrix, dir) {
    const rotated = [];
    for (let i = 0; i < matrix[0].length; i++) {
        const row = [];
        for (let j = matrix.length - 1; j >= 0; j--) {
            row.push(matrix[j][i]);
        }
        rotated.push(row);
    }
    if (dir > 0) return rotated;
    return rotate(rotate(rotate(matrix, 1), 1), 1);
}

// Intentar rotar la pieza
function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    const original = player.matrix;
    player.matrix = rotate(player.matrix, dir);
    
    while (collision(board, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            player.matrix = original;
            player.pos.x = pos;
            return;
        }
    }
}

// Mover la pieza a la izquierda o derecha
function playerMove(dir) {
    player.pos.x += dir;
    if (collision(board, player)) {
        player.pos.x -= dir;
    }
}

// Resetear el jugador con una nueva pieza
function playerReset() {
    const pieces = 'IJLOSTZ';
    player.matrix = PIECES[pieces.indexOf(pieces[Math.floor(Math.random() * pieces.length)]) + 1];
    player.pos.y = 0;
    player.pos.x = Math.floor((board[0].length - player.matrix[0].length) / 2);
    
    // Verificar si el juego ha terminado
    if (collision(board, player)) {
        cancelAnimationFrame(frameId);
        gameOver = true;
        
        // Añadir clase para animación de game over
        document.querySelector('.game-title').classList.add('game-over');
        
        setTimeout(() => {
            alert(`¡Juego terminado! Tu puntuación final es: ${score}`);
            board.forEach(row => row.fill(0));
            score = 0;
            level = 1;
            linesCleared = 0;
            dropSpeed = 1000;
            updateScore();
            gameOver = false;
            
            // Eliminar clase de game over
            document.querySelector('.game-title').classList.remove('game-over');
            
            frameId = requestAnimationFrame(update);
        }, 500);
    }
}

// Mover la pieza hacia abajo
function playerDrop() {
    player.pos.y++;
    if (collision(board, player)) {
        player.pos.y--;
        merge(board, player);
        playerReset();
        removeLines();
        updateScore();
    }
}

// Caída rápida (cuando se mantiene pulsada la tecla abajo)
function playerHardDrop() {
    while (!collision(board, player)) {
        player.pos.y++;
    }
    player.pos.y--;
    merge(board, player);
    playerReset();
    removeLines();
    updateScore();
}

// Eliminar líneas completas
function removeLines() {
    let linesRemoved = 0;
    
    outer: for (let y = board.length - 1; y >= 0; --y) {
        for (let x = 0; x < board[y].length; ++x) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }

        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        ++y;
        linesRemoved++;
    }

    if (linesRemoved > 0) {
        // Calcular puntuación según el número de líneas eliminadas de una vez
        const points = [0, 100, 300, 500, 800]; // 0, 1, 2, 3, 4 líneas
        score += points[linesRemoved] * level;
        linesCleared += linesRemoved;
        
        // Subir de nivel cada 10 líneas
        if (linesCleared >= level * 10) {
            level++;
            dropSpeed = Math.max(100, 1000 - (level - 1) * 100); // Disminuir velocidad con cada nivel
        }
    }
}

// Mostrar previsualización de caída
function drawGhostPiece() {
    const ghost = {
        pos: { x: player.pos.x, y: player.pos.y },
        matrix: player.matrix
    };
    
    // Encontrar la posición más baja posible
    while (!collision(board, ghost)) {
        ghost.pos.y++;
    }
    ghost.pos.y--;
    
    // Dibujar la pieza fantasma semitransparente
    ctx.globalAlpha = 0.3;
    drawMatrix(ghost.matrix, ghost.pos);
    ctx.globalAlpha = 1.0;
}

// Actualizar la puntuación y el nivel en la interfaz
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
}

// Configurar controles de teclado y táctiles
function setupControls() {
    // Controles de teclado
    document.addEventListener('keydown', event => {
        if (gameOver) return;
        
        switch(event.keyCode) {
            case 37: // Flecha izquierda
                playerMove(-1);
                break;
            case 39: // Flecha derecha
                playerMove(1);
                break;
            case 40: // Flecha abajo
                event.preventDefault(); // Evitar el desplazamiento hacia abajo
                playerDrop();
                break;
            case 38: // Flecha arriba
                event.preventDefault(); // Evitar el desplazamiento hacia arriba
                playerRotate(1);
                break;
            case 32: // Espacio (caída rápida)
                event.preventDefault(); // También es útil prevenir para la barra espaciadora
                playerHardDrop();
                break;
        }
    });
    
    // Controles táctiles/móviles
    document.getElementById('left-btn').addEventListener('click', () => {
        if (!gameOver) playerMove(-1);
    });
    
    document.getElementById('right-btn').addEventListener('click', () => {
        if (!gameOver) playerMove(1);
    });
    
    document.getElementById('down-btn').addEventListener('click', () => {
        if (!gameOver) playerDrop();
    });
    
    document.getElementById('rotate-btn').addEventListener('click', () => {
        if (!gameOver) playerRotate(1);
    });
    
    document.getElementById('hard-drop-btn').addEventListener('click', () => {
        if (!gameOver) playerHardDrop();
    });
}

// Función para actualizar el juego
function update(time = 0) {
    if (gameOver) return;
    
    const deltaTime = time - lastTime;
    lastTime = time;
    
    dropCounter += deltaTime;
    if (dropCounter > dropSpeed) {
        playerDrop();
        dropCounter = 0;
    }
    
    drawBoard();
    drawGhostPiece();
    frameId = requestAnimationFrame(update);
}

// Iniciar el juego cuando la ventana esté cargada
window.addEventListener('load', initGame);