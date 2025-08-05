// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameMessage = document.getElementById('gameMessage');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

// Game constants
const CELL_SIZE = 20;
const COLS = canvas.width / CELL_SIZE;
const ROWS = canvas.height / CELL_SIZE;

// Game state
let gameRunning = false;
let score = 0;
let lives = 3;
let dotsRemaining = 0;

// Keyboard state tracking
const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Create a maze layout with lots of dots (1 = wall, 0 = empty, 2 = dot)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,2,1,1,0,0,0,0,0,0,1,1,2,1,1,2,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2],
    [1,1,1,1,1,1,2,1,1,2,1,0,0,0,0,0,0,0,0,1,2,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,1,1,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,1,1,2,2,2,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Player object
const pacman = {
    x: 14,
    y: 18,
    direction: { x: 0, y: 0 },
    nextDirection: { x: 0, y: 0 },
    mouthOpen: true,
    mouthTimer: 0,
    moveTimer: 0,
    moveDelay: 8
};

// Ghost objects
const ghosts = [
    {
        x: 14,
        y: 9,
        direction: { x: 1, y: 0 },
        moveTimer: 0,
        moveDelay: 12,
        color: '#ff0000', // Red
        name: 'red'
    },
    {
        x: 13,
        y: 9,
        direction: { x: -1, y: 0 },
        moveTimer: 0,
        moveDelay: 14,
        color: '#00ffff', // Blue/Cyan
        name: 'blue'
    },
    {
        x: 15,
        y: 9,
        direction: { x: 0, y: -1 },
        moveTimer: 0,
        moveDelay: 10,
        color: '#ffb6c1', // Pink
        name: 'pink'
    }
];

// Initialize game
function initGame() {
    score = 0;
    lives = 3;
    pacman.x = 14;
    pacman.y = 18;
    pacman.direction = { x: 0, y: 0 };
    pacman.nextDirection = { x: 0, y: 0 };
    pacman.moveTimer = 0;
    
    // Clear key states
    keysPressed.ArrowUp = false;
    keysPressed.ArrowDown = false;
    keysPressed.ArrowLeft = false;
    keysPressed.ArrowRight = false;
    
    // Reset all ghosts
    ghosts[0].x = 14; ghosts[0].y = 9; ghosts[0].direction = { x: 1, y: 0 }; ghosts[0].moveTimer = 0;
    ghosts[1].x = 13; ghosts[1].y = 9; ghosts[1].direction = { x: -1, y: 0 }; ghosts[1].moveTimer = 0;
    ghosts[2].x = 15; ghosts[2].y = 9; ghosts[2].direction = { x: 0, y: -1 }; ghosts[2].moveTimer = 0;
    
    // Reset maze and count dots
    dotsRemaining = 0;
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 2) {
                dotsRemaining++;
            }
        }
    }
    
    updateUI();
    gameMessage.textContent = '';
}

// Update UI elements
function updateUI() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
}

// Check if position is valid (not a wall)
function isValidPosition(x, y) {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
    return maze[y][x] !== 1;
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
            keysPressed[e.key] = true;
            e.preventDefault(); // Prevent page scrolling
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
            keysPressed[e.key] = false;
            e.preventDefault();
            break;
    }
});

// Get current direction based on pressed keys
function getCurrentDirection() {
    if (keysPressed.ArrowUp) return { x: 0, y: -1 };
    if (keysPressed.ArrowDown) return { x: 0, y: 1 };
    if (keysPressed.ArrowLeft) return { x: -1, y: 0 };
    if (keysPressed.ArrowRight) return { x: 1, y: 0 };
    return { x: 0, y: 0 }; // No movement when no keys are pressed
}

// Update Pac-Man position
function updatePacman() {
    pacman.moveTimer++;
    
    // Only move every moveDelay frames
    if (pacman.moveTimer < pacman.moveDelay) {
        // Update mouth animation
        pacman.mouthTimer++;
        if (pacman.mouthTimer % 10 === 0) {
            pacman.mouthOpen = !pacman.mouthOpen;
        }
        return;
    }
    
    pacman.moveTimer = 0;
    
    // Get the current desired direction based on pressed keys
    const desiredDirection = getCurrentDirection();
    
    // Only move if a key is being pressed
    if (desiredDirection.x !== 0 || desiredDirection.y !== 0) {
        // Check if we can move in the desired direction
        const newX = pacman.x + desiredDirection.x;
        const newY = pacman.y + desiredDirection.y;
        
        if (isValidPosition(newX, newY)) {
            pacman.x = newX;
            pacman.y = newY;
            pacman.direction = desiredDirection; // Update facing direction for mouth animation
            
            // Handle tunnel effect (left-right wrap)
            if (pacman.x < 0) pacman.x = COLS - 1;
            if (pacman.x >= COLS) pacman.x = 0;
            
            // Eat dots
            if (maze[pacman.y][pacman.x] === 2) {
                maze[pacman.y][pacman.x] = 0;
                score += 10;
                dotsRemaining--;
                updateUI();
                
                // Check win condition
                if (dotsRemaining === 0) {
                    gameRunning = false;
                    gameMessage.textContent = 'YOU WIN!';
                    gameMessage.className = 'game-message win';
                    showRestartButton();
                }
            }
        }
    } else {
        // No keys pressed, stop moving
        pacman.direction = { x: 0, y: 0 };
    }
    
    // Update mouth animation
    pacman.mouthTimer++;
    if (pacman.mouthTimer % 10 === 0) {
        pacman.mouthOpen = !pacman.mouthOpen;
    }
}

// Update Ghost AI
function updateGhosts() {
    ghosts.forEach((ghost, index) => {
        ghost.moveTimer++;
        
        if (ghost.moveTimer < ghost.moveDelay) return;
        ghost.moveTimer = 0;
        
        // Simple AI: move towards Pac-Man with some randomness
        const directions = [
            { x: 0, y: -1 }, // up
            { x: 0, y: 1 },  // down
            { x: -1, y: 0 }, // left
            { x: 1, y: 0 }   // right
        ];
        
        // Calculate direction towards Pac-Man
        const dx = pacman.x - ghost.x;
        const dy = pacman.y - ghost.y;
        
        let bestDirection = ghost.direction;
        let validDirections = [];
        
        // Find valid directions
        for (let dir of directions) {
            const newX = ghost.x + dir.x;
            const newY = ghost.y + dir.y;
            
            if (isValidPosition(newX, newY)) {
                validDirections.push(dir);
            }
        }
        
        if (validDirections.length > 0) {
            // Different AI behavior for each ghost
            let chaseChance = 0.7;
            if (index === 1) chaseChance = 0.5; // Blue ghost is more random
            if (index === 2) chaseChance = 0.9; // Pink ghost is more aggressive
            
            if (Math.random() < chaseChance) {
                // Find direction that gets closer to Pac-Man
                let bestDistance = Infinity;
                for (let dir of validDirections) {
                    const newX = ghost.x + dir.x;
                    const newY = ghost.y + dir.y;
                    const distance = Math.abs(newX - pacman.x) + Math.abs(newY - pacman.y);
                    
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        bestDirection = dir;
                    }
                }
            } else {
                // Random direction
                bestDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
            }
            
            ghost.direction = bestDirection;
        }
        
        // Move ghost
        const newX = ghost.x + ghost.direction.x;
        const newY = ghost.y + ghost.direction.y;
        
        if (isValidPosition(newX, newY)) {
            ghost.x = newX;
            ghost.y = newY;
            
            // Handle tunnel effect
            if (ghost.x < 0) ghost.x = COLS - 1;
            if (ghost.x >= COLS) ghost.x = 0;
        }
    });
}

// Check collision between Pac-Man and Ghosts
function checkCollision() {
    for (let ghost of ghosts) {
        if (Math.abs(pacman.x - ghost.x) < 1 && Math.abs(pacman.y - ghost.y) < 1) {
            lives--;
            updateUI();
            
            if (lives <= 0) {
                gameRunning = false;
                gameMessage.textContent = 'GAME OVER!';
                gameMessage.className = 'game-message lose';
                showRestartButton();
            } else {
                // Reset positions
                pacman.x = 14;
                pacman.y = 18;
                pacman.direction = { x: 0, y: 0 };
                pacman.moveTimer = 0;
                
                // Reset all ghosts
                ghosts[0].x = 14; ghosts[0].y = 9; ghosts[0].moveTimer = 0;
                ghosts[1].x = 13; ghosts[1].y = 9; ghosts[1].moveTimer = 0;
                ghosts[2].x = 15; ghosts[2].y = 9; ghosts[2].moveTimer = 0;
                
                gameMessage.textContent = `Life lost! ${lives} lives remaining`;
                gameMessage.className = 'game-message info';
                
                setTimeout(() => {
                    if (gameRunning) {
                        gameMessage.textContent = '';
                    }
                }, 2000);
            }
            break; // Exit loop once collision is detected
        }
    }
}

// Render the game
function render() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw maze
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            const pixelX = x * CELL_SIZE;
            const pixelY = y * CELL_SIZE;
            
            if (maze[y][x] === 1) {
                // Wall
                ctx.fillStyle = '#0066ff';
                ctx.fillRect(pixelX, pixelY, CELL_SIZE, CELL_SIZE);
                ctx.strokeStyle = '#0088ff';
                ctx.lineWidth = 1;
                ctx.strokeRect(pixelX, pixelY, CELL_SIZE, CELL_SIZE);
            } else if (maze[y][x] === 2) {
                // Dot
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(pixelX + CELL_SIZE/2, pixelY + CELL_SIZE/2, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    // Draw Pac-Man
    const pacmanPixelX = pacman.x * CELL_SIZE + CELL_SIZE/2;
    const pacmanPixelY = pacman.y * CELL_SIZE + CELL_SIZE/2;
    
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    
    if (pacman.mouthOpen) {
        // Calculate mouth direction
        let startAngle = 0;
        let endAngle = Math.PI * 2;
        
        if (pacman.direction.x > 0) { // Right
            startAngle = 0.2 * Math.PI;
            endAngle = 1.8 * Math.PI;
        } else if (pacman.direction.x < 0) { // Left
            startAngle = 1.2 * Math.PI;
            endAngle = 0.8 * Math.PI;
        } else if (pacman.direction.y > 0) { // Down
            startAngle = 1.7 * Math.PI;
            endAngle = 1.3 * Math.PI;
        } else if (pacman.direction.y < 0) { // Up
            startAngle = 0.7 * Math.PI;
            endAngle = 0.3 * Math.PI;
        }
        
        ctx.arc(pacmanPixelX, pacmanPixelY, CELL_SIZE/2 - 2, startAngle, endAngle);
        ctx.lineTo(pacmanPixelX, pacmanPixelY);
    } else {
        ctx.arc(pacmanPixelX, pacmanPixelY, CELL_SIZE/2 - 2, 0, Math.PI * 2);
    }
      ctx.fill();
    
    // Draw Ghosts
    ghosts.forEach(ghost => {
        const ghostPixelX = ghost.x * CELL_SIZE + CELL_SIZE/2;
        const ghostPixelY = ghost.y * CELL_SIZE + CELL_SIZE/2;
        
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(ghostPixelX, ghostPixelY, CELL_SIZE/2 - 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Ghost eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ghostPixelX - 4, ghostPixelY - 3, 2, 0, Math.PI * 2);
        ctx.arc(ghostPixelX + 4, ghostPixelY - 3, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(ghostPixelX - 3, ghostPixelY - 3, 1, 0, Math.PI * 2);
        ctx.arc(ghostPixelX + 5, ghostPixelY - 3, 1, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Game loop
function gameLoop() {
    if (gameRunning) {
        updatePacman();
        updateGhosts();
        checkCollision();
    }
    
    render();
    requestAnimationFrame(gameLoop);
}

// Show restart button
function showRestartButton() {
    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
}

// Start game
function startGame() {
    gameRunning = true;
    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    gameMessage.textContent = '';
    gameMessage.className = 'game-message';
}

// Event listeners
startBtn.addEventListener('click', () => {
    initGame();
    startGame();
});

restartBtn.addEventListener('click', () => {
    initGame();
    startGame();
});

// Initialize and start game loop
initGame();
gameLoop();
