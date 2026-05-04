// Snake Game - Modularized

let snakeGameState = {
    canvas: null,
    ctx: null,
    snake: [],
    direction: 'right',
    nextDirection: 'right',
    food: {x: 0, y: 0},
    walls: [],
    score: 0,
    gameOver: false,
    lastMoveTime: 0,
    moveInterval: 150,
    gameLoopId: null,
    gameWidth: 960,
    gameHeight: 640,
    SEGMENT_SIZE: 20,
    keydownHandler: null  // Store handler reference for removal
};

function initSnakeGame() {
    console.log('Initializing Snake Game...');
    
    // Get canvas and container
    snakeGameState.canvas = document.getElementById('game-canvas');
    snakeGameState.ctx = snakeGameState.canvas.getContext('2d');
    const gameContent = document.getElementById('game-content');
    
    // Set canvas size based on game-content container
    snakeGameState.gameWidth = gameContent.clientWidth;
    snakeGameState.gameHeight = gameContent.clientHeight;
    snakeGameState.canvas.width = snakeGameState.gameWidth;
    snakeGameState.canvas.height = snakeGameState.gameHeight;
    
    console.log('Canvas size:', snakeGameState.gameWidth, 'x', snakeGameState.gameHeight);
    
    // Reset game state
    snakeGameState.snake = [
        {x: Math.floor(snakeGameState.gameWidth / 2 / snakeGameState.SEGMENT_SIZE) * snakeGameState.SEGMENT_SIZE, 
         y: Math.floor(snakeGameState.gameHeight / 2 / snakeGameState.SEGMENT_SIZE) * snakeGameState.SEGMENT_SIZE},
        {x: Math.floor(snakeGameState.gameWidth / 2 / snakeGameState.SEGMENT_SIZE) * snakeGameState.SEGMENT_SIZE - snakeGameState.SEGMENT_SIZE, 
         y: Math.floor(snakeGameState.gameHeight / 2 / snakeGameState.SEGMENT_SIZE) * snakeGameState.SEGMENT_SIZE},
        {x: Math.floor(snakeGameState.gameWidth / 2 / snakeGameState.SEGMENT_SIZE) * snakeGameState.SEGMENT_SIZE - 2 * snakeGameState.SEGMENT_SIZE, 
         y: Math.floor(snakeGameState.gameHeight / 2 / snakeGameState.SEGMENT_SIZE) * snakeGameState.SEGMENT_SIZE}
    ];
    snakeGameState.direction = 'right';
    snakeGameState.nextDirection = 'right';
    snakeGameState.score = 0;
    snakeGameState.gameOver = false;
    
    // Spawn food
    spawnSnakeFood();
    
    // Setup keyboard controls
    setupSnakeControls();
    
    // Update score
    gameController.setScore(0);
    
    // Start game loop
    snakeGameState.gameLoopId = setInterval(updateSnakeGame, snakeGameState.moveInterval);
    
    // Initial render
    renderSnakeGame();
}

function cleanupSnakeGame() {
    console.log('Cleaning up Snake Game...');
    
    // Stop game loop
    if (snakeGameState.gameLoopId) {
        clearInterval(snakeGameState.gameLoopId);
        snakeGameState.gameLoopId = null;
    }
    
    // Remove keyboard event listener
    if (snakeGameState.keydownHandler) {
        window.removeEventListener('keydown', snakeGameState.keydownHandler);
        snakeGameState.keydownHandler = null;
    }
    
    // Clear canvas
    if (snakeGameState.canvas && snakeGameState.ctx) {
        snakeGameState.ctx.clearRect(0, 0, snakeGameState.gameWidth, snakeGameState.gameHeight);
    }
    
    console.log('Snake Game cleaned up');
}

function setupSnakeControls() {
    // Create handler function
    snakeGameState.keydownHandler = (e) => {
        if (gameController.currentGame !== 'snake') return;
        
        const key = e.key.toLowerCase();
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
            e.preventDefault();
        }
        
        // Map keys to directions
        if (key === 'arrowup' || key === 'w') snakeGameState.nextDirection = 'up';
        if (key === 'arrowdown' || key === 's') snakeGameState.nextDirection = 'down';
        if (key === 'arrowleft' || key === 'a') snakeGameState.nextDirection = 'left';
        if (key === 'arrowright' || key === 'd') snakeGameState.nextDirection = 'right';
    };
    
    // Add the handler
    window.addEventListener('keydown', snakeGameState.keydownHandler);
}

function spawnSnakeFood() {
    snakeGameState.food = {
        x: Math.floor(Math.random() * snakeGameState.gameWidth / snakeGameState.SEGMENT_SIZE) * snakeGameState.SEGMENT_SIZE,
        y: Math.floor(Math.random() * snakeGameState.gameHeight / snakeGameState.SEGMENT_SIZE) * snakeGameState.SEGMENT_SIZE
    };
}

function updateSnakeGame() {
    if (snakeGameState.gameOver) return;
    if (gameController.isPaused) return;
    
    // Update direction
    snakeGameState.direction = snakeGameState.nextDirection;
    
    // Calculate new head position
    let head = snakeGameState.snake[0];
    let newHead = {x: head.x, y: head.y};
    
    if (snakeGameState.direction === 'right') newHead.x += snakeGameState.SEGMENT_SIZE;
    if (snakeGameState.direction === 'left') newHead.x -= snakeGameState.SEGMENT_SIZE;
    if (snakeGameState.direction === 'up') newHead.y -= snakeGameState.SEGMENT_SIZE;
    if (snakeGameState.direction === 'down') newHead.y += snakeGameState.SEGMENT_SIZE;
    
    // Check boundaries
    if (newHead.x < 0 || newHead.x >= snakeGameState.gameWidth || 
        newHead.y < 0 || newHead.y >= snakeGameState.gameHeight) {
        snakeGameState.gameOver = true;
        gameController.endGame(snakeGameState.score);
        return;
    }
    
    // Check self collision
    for (let segment of snakeGameState.snake) {
        if (newHead.x === segment.x && newHead.y === segment.y) {
            snakeGameState.gameOver = true;
            gameController.endGame(snakeGameState.score);
            return;
        }
    }
    
    // Check food collision
    if (newHead.x === snakeGameState.food.x && newHead.y === snakeGameState.food.y) {
        snakeGameState.score += 10;
        gameController.setScore(snakeGameState.score);
        spawnSnakeFood();
    } else {
        // Remove tail if not eating
        snakeGameState.snake.pop();
    }
    
    // Add new head
    snakeGameState.snake.unshift(newHead);
    
    renderSnakeGame();
}

function renderSnakeGame() {
    const ctx = snakeGameState.ctx;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, snakeGameState.gameWidth, snakeGameState.gameHeight);
    
    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < snakeGameState.gameWidth; i += snakeGameState.SEGMENT_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, snakeGameState.gameHeight);
        ctx.stroke();
    }
    for (let i = 0; i < snakeGameState.gameHeight; i += snakeGameState.SEGMENT_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(snakeGameState.gameWidth, i);
        ctx.stroke();
    }
    
    // Draw snake
    ctx.fillStyle = '#00ff00';
    snakeGameState.snake.forEach((segment, index) => {
        ctx.fillRect(segment.x + 1, segment.y + 1, snakeGameState.SEGMENT_SIZE - 2, snakeGameState.SEGMENT_SIZE - 2);
        
        // Draw head differently
        if (index === 0) {
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(segment.x + 4, segment.y + 4, snakeGameState.SEGMENT_SIZE - 8, snakeGameState.SEGMENT_SIZE - 8);
            ctx.fillStyle = '#00ff00';
        }
    });
    
    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(snakeGameState.food.x + snakeGameState.SEGMENT_SIZE / 2, 
            snakeGameState.food.y + snakeGameState.SEGMENT_SIZE / 2, 
            snakeGameState.SEGMENT_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw game over message
    if (snakeGameState.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, snakeGameState.gameWidth, snakeGameState.gameHeight);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', snakeGameState.gameWidth / 2, snakeGameState.gameHeight / 2);
        
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${snakeGameState.score}`, snakeGameState.gameWidth / 2, snakeGameState.gameHeight / 2 + 50);
    }
}