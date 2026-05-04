// Runner Game - Simple Hyper Casual Runner
// Player taps to jump over obstacles

let runnerGameState = {
    canvas: null,
    ctx: null,
    runnerCanvas: null,
    runnerCtx: null,

    player: null,
    obstacles: [],
    score: 0,
    gameOver: false,
    gameWidth: 960,
    gameHeight: 640,
    gameLoopId: null,
    clickHandler: null,
    keydownHandler: null,

    // Game mechanics
    gravity: 0.8,
    jumpForce: -18,
    groundY: 500,
    obstacleSpeed: 3,
    obstacleSpawnRate: 0.008,
    lastObstacleSpawn: 0
};

function initRunnerGame() {
    console.log('Initializing Runner Game...');

    // Get canvas and container
    runnerGameState.canvas = document.getElementById('game-canvas');
    runnerGameState.ctx = runnerGameState.canvas.getContext('2d');
    const gameContent = document.getElementById('game-content');

    // Set canvas size based on game-content container
    runnerGameState.gameWidth = gameContent.clientWidth;
    runnerGameState.gameHeight = gameContent.clientHeight;
    runnerGameState.canvas.width = runnerGameState.gameWidth;
    runnerGameState.canvas.height = runnerGameState.gameHeight;

    runnerGameState.groundY = runnerGameState.gameHeight - 140;

    console.log('Canvas size:', runnerGameState.gameWidth, 'x', runnerGameState.gameHeight);

    // Reset game state
    runnerGameState.player = {
        x: 100,
        y: runnerGameState.groundY,
        width: 40,
        height: 40,
        velocityY: 0,
        isJumping: false,
        color: '#4CAF50'
    };

    runnerGameState.obstacles = [];
    runnerGameState.score = 0;
    runnerGameState.gameOver = false;
    runnerGameState.lastObstacleSpawn = 0;

    // Setup controls
    setupRunnerControls();

    // Start game loop
    console.log('[Runner] Starting game loop...');
    runnerGameState.gameLoopId = setInterval(() => {
        updateRunner();
        renderRunner();
    }, 1000 / 60); // 60 FPS

    // Update score
    gameController.setScore(0);
}

function setupRunnerControls() {
    // Click/tap to jump
    runnerGameState.clickHandler = (e) => {
        if (!runnerGameState.gameOver) {
            jumpRunner();
        }
    };

    // Space bar to jump
    runnerGameState.keydownHandler = (e) => {
        if (gameController.currentGame !== 'runner') return;
        if (e.code === 'Space' && !runnerGameState.gameOver) {
            e.preventDefault();
            jumpRunner();
        }
    };

    runnerGameState.canvas.addEventListener('click', runnerGameState.clickHandler);
    window.addEventListener('keydown', runnerGameState.keydownHandler);
}

function jumpRunner() {
    if (!runnerGameState.player.isJumping) {
        runnerGameState.player.velocityY = runnerGameState.jumpForce;
        runnerGameState.player.isJumping = true;
    }
}

function updateRunner() {
    if (runnerGameState.gameOver) return;

    // Update player physics
    runnerGameState.player.velocityY += runnerGameState.gravity;
    runnerGameState.player.y += runnerGameState.player.velocityY;

    // Ground collision
    if (runnerGameState.player.y >= runnerGameState.groundY) {
        runnerGameState.player.y = runnerGameState.groundY;
        runnerGameState.player.velocityY = 0;
        runnerGameState.player.isJumping = false;
    }

    // Spawn obstacles
    runnerGameState.lastObstacleSpawn += runnerGameState.obstacleSpawnRate;
    if (runnerGameState.lastObstacleSpawn >= 1) {
        spawnRunnerObstacle();
        runnerGameState.lastObstacleSpawn = 0;
    }

    // Update obstacles
    for (let i = runnerGameState.obstacles.length - 1; i >= 0; i--) {
        const obstacle = runnerGameState.obstacles[i];
        obstacle.x -= runnerGameState.obstacleSpeed;

        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
            runnerGameState.obstacles.splice(i, 1);
            runnerGameState.score += 10; // Points for passing obstacles
            gameController.setScore(runnerGameState.score);
        }

        // Collision detection
        if (checkRunnerCollision(runnerGameState.player, obstacle)) {
            runnerGameState.gameOver = true;
            console.log('[Runner] Game Over! Final Score:', runnerGameState.score);
        }
    }

    // Increase difficulty over time
    if (runnerGameState.score > 0 && runnerGameState.score % 200 === 0) {
        runnerGameState.obstacleSpeed = Math.min(runnerGameState.obstacleSpeed + 0.3, 8);
        runnerGameState.obstacleSpawnRate = Math.min(runnerGameState.obstacleSpawnRate + 0.002, 0.015);
    }
}

function spawnRunnerObstacle() {
    // Check if there's enough space from the last obstacle
    const minSpacing = 200;
    const lastObstacle = runnerGameState.obstacles[runnerGameState.obstacles.length - 1];
    if (lastObstacle && (runnerGameState.gameWidth - lastObstacle.x) < minSpacing) {
        return; // Don't spawn too close to previous obstacle
    }

    const obstacleTypes = [
        { width: 25, height: 50, color: '#FF5722' }, // Tall obstacle
        { width: 40, height: 25, color: '#2196F3' }, // Wide obstacle
        { width: 20, height: 20, color: '#9C27B0' }  // Small square
    ];

    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    const obstacle = {
        x: runnerGameState.gameWidth,
        y: runnerGameState.groundY - type.height + 40,
        width: type.width,
        height: type.height,
        color: type.color
    };

    runnerGameState.obstacles.push(obstacle);
}

function checkRunnerCollision(player, obstacle) {
    // Add some forgiveness to collision detection
    const playerTolerance = 5; // pixels of forgiveness
    return player.x + playerTolerance < obstacle.x + obstacle.width &&
           player.x + player.width - playerTolerance > obstacle.x &&
           player.y + playerTolerance < obstacle.y + obstacle.height &&
           player.y + player.height - playerTolerance > obstacle.y;
}

function renderRunner() {
    const ctx = runnerGameState.ctx;

    // Clear canvas
    ctx.clearRect(0, 0, runnerGameState.gameWidth, runnerGameState.gameHeight);

    // Sky background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, runnerGameState.gameWidth, runnerGameState.gameHeight);

    // Ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, runnerGameState.groundY + 40, runnerGameState.gameWidth, runnerGameState.gameHeight - runnerGameState.groundY - 40);

    // Grass
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, runnerGameState.groundY + 35, runnerGameState.gameWidth, 5);

    // Player (simple square with eyes)
    ctx.fillStyle = runnerGameState.player.color;
    ctx.fillRect(runnerGameState.player.x, runnerGameState.player.y, runnerGameState.player.width, runnerGameState.player.height);

    // Player eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(runnerGameState.player.x + 8, runnerGameState.player.y + 8, 6, 6);
    ctx.fillRect(runnerGameState.player.x + 26, runnerGameState.player.y + 8, 6, 6);
    ctx.fillStyle = 'black';
    ctx.fillRect(runnerGameState.player.x + 10, runnerGameState.player.y + 10, 2, 2);
    ctx.fillRect(runnerGameState.player.x + 28, runnerGameState.player.y + 10, 2, 2);

    // Obstacles
    runnerGameState.obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Add some detail to obstacles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(obstacle.x + 2, obstacle.y + 2, obstacle.width - 4, obstacle.height - 4);
    });

    // Score
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeText(`Score: ${runnerGameState.score}`, 20, 40);
    ctx.fillText(`Score: ${runnerGameState.score}`, 20, 40);

    // Speed indicator
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.strokeText(`Speed: ${runnerGameState.obstacleSpeed.toFixed(1)}x`, 20, 70);
    ctx.fillText(`Speed: ${runnerGameState.obstacleSpeed.toFixed(1)}x`, 20, 70);

    if (runnerGameState.gameOver) {
        // Game over overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, runnerGameState.gameWidth, runnerGameState.gameHeight);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText('GAME OVER', runnerGameState.gameWidth / 2, runnerGameState.gameHeight / 2 - 50);
        ctx.fillText('GAME OVER', runnerGameState.gameWidth / 2, runnerGameState.gameHeight / 2 - 50);

        ctx.font = '24px Arial';
        ctx.strokeText(`Final Score: ${runnerGameState.score}`, runnerGameState.gameWidth / 2, runnerGameState.gameHeight / 2);
        ctx.fillText(`Final Score: ${runnerGameState.score}`, runnerGameState.gameWidth / 2, runnerGameState.gameHeight / 2);

        ctx.font = '18px Arial';
        ctx.strokeText('Click or press SPACE to jump', runnerGameState.gameWidth / 2, runnerGameState.gameHeight / 2 + 50);
        ctx.fillText('Click or press SPACE to jump', runnerGameState.gameWidth / 2, runnerGameState.gameHeight / 2 + 50);
    }
}

function cleanupRunnerGame() {
    console.log('[Runner] Cleaning up runner game...');

    // Stop the game loop
    if (runnerGameState.gameLoopId) {
        clearInterval(runnerGameState.gameLoopId);
        runnerGameState.gameLoopId = null;
    }

    // Remove event listeners
    if (runnerGameState.clickHandler) {
        runnerGameState.canvas.removeEventListener('click', runnerGameState.clickHandler);
        runnerGameState.clickHandler = null;
    }

    if (runnerGameState.keydownHandler) {
        window.removeEventListener('keydown', runnerGameState.keydownHandler);
        runnerGameState.keydownHandler = null;
    }

    // Clear canvas
    if (runnerGameState.ctx && runnerGameState.canvas) {
        runnerGameState.ctx.clearRect(0, 0, runnerGameState.canvas.width, runnerGameState.canvas.height);
    }

    console.log('[Runner] Runner game cleanup complete');
}