// Bubble Popper Game - Click bubbles before they disappear!

let bubbleGameState = {
    canvas: null,
    ctx: null,
    bubbleCanvas: null,
    bubbleCtx: null,

    bubbles: [],
    score: 0,
    gameOver: false,
    gameWidth: 960,
    gameHeight: 640,
    gameLoopId: null,
    clickHandler: null,
    keydownHandler: null,

    // Game mechanics
    bubbleSpawnRate: 0.015,
    lastBubbleSpawn: 0,
    bubbleLifetime: 240, // frames (4 seconds at 60fps)
    bubbleSpeed: 0.5,
    comboMultiplier: 1,
    comboTimer: 0,
    maxComboTimer: 180 // 3 seconds
};

function initBubbleGame() {
    console.log('Initializing Bubble Popper Game...');

    // Get canvas and container
    bubbleGameState.canvas = document.getElementById('game-canvas');
    bubbleGameState.ctx = bubbleGameState.canvas.getContext('2d');
    const gameContent = document.getElementById('game-content');

    // Set canvas size based on game-content container
    bubbleGameState.gameWidth = gameContent.clientWidth;
    bubbleGameState.gameHeight = gameContent.clientHeight;
    bubbleGameState.canvas.width = bubbleGameState.gameWidth;
    bubbleGameState.canvas.height = bubbleGameState.gameHeight;

    console.log('Canvas size:', bubbleGameState.gameWidth, 'x', bubbleGameState.gameHeight);

    // Reset game state
    bubbleGameState.bubbles = [];
    bubbleGameState.score = 0;
    bubbleGameState.gameOver = false;
    bubbleGameState.lastBubbleSpawn = 0;
    bubbleGameState.comboMultiplier = 1;
    bubbleGameState.comboTimer = 0;

    // Setup controls
    setupBubbleControls();

    // Start game loop
    console.log('[Bubble] Starting game loop...');
    bubbleGameState.gameLoopId = setInterval(() => {
        updateBubble();
        renderBubble();
    }, 1000 / 60); // 60 FPS

    // Update score
    gameController.setScore(0);

    // Spawn initial bubbles
    for (let i = 0; i < 3; i++) {
        spawnBubble();
    }
}

function setupBubbleControls() {
    // Click to pop bubbles
    bubbleGameState.clickHandler = (e) => {
        if (!bubbleGameState.gameOver) {
            const rect = bubbleGameState.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            popBubbleAt(clickX, clickY);
        }
    };

    bubbleGameState.canvas.addEventListener('click', bubbleGameState.clickHandler);
}

function popBubbleAt(x, y) {
    let popped = false;
    let closestBubble = null;
    let closestDistance = Infinity;

    // Find the closest bubble to the click
    for (let i = bubbleGameState.bubbles.length - 1; i >= 0; i--) {
        const bubble = bubbleGameState.bubbles[i];
        if (bubble.type === 'effect') continue;

        const distance = Math.sqrt(
            Math.pow(x - bubble.x, 2) + Math.pow(y - bubble.y, 2)
        );

        // Allow clicking slightly outside the bubble (more forgiving)
        const clickTolerance = bubble.radius * 1.2;

        if (distance <= clickTolerance && distance < closestDistance) {
            closestBubble = { bubble, index: i, distance };
            closestDistance = distance;
        }
    }

    if (closestBubble) {
        // Pop the closest bubble
        const { bubble, index } = closestBubble;
        bubbleGameState.bubbles.splice(index, 1);
        bubbleGameState.score += 10 * bubbleGameState.comboMultiplier;
        bubbleGameState.comboMultiplier++;
        bubbleGameState.comboTimer = bubbleGameState.maxComboTimer;
        gameController.setScore(bubbleGameState.score);
        popped = true;

        // Create pop effect
        createPopEffect(bubble.x, bubble.y, bubble.color);
    }

    if (!popped) {
        // Missed click - reset combo more gently
        bubbleGameState.comboMultiplier = Math.max(1, bubbleGameState.comboMultiplier - 1);
        bubbleGameState.comboTimer = Math.max(0, bubbleGameState.comboTimer - 30);
    }
}

function createPopEffect(x, y, color) {
    // Simple pop effect - could be expanded with particles
    // For now, just a visual flash
    const effect = {
        x: x,
        y: y,
        radius: 20,
        color: color,
        lifetime: 15,
        maxLifetime: 15
    };

    // Add to bubbles array temporarily for rendering
    bubbleGameState.bubbles.push({
        ...effect,
        type: 'effect',
        update: function() {
            this.lifetime--;
            this.radius += 2;
            return this.lifetime > 0;
        }
    });
}

function updateBubble() {
    if (bubbleGameState.gameOver) return;

    // Update combo timer
    if (bubbleGameState.comboTimer > 0) {
        bubbleGameState.comboTimer--;
        if (bubbleGameState.comboTimer === 0) {
            bubbleGameState.comboMultiplier = 1;
        }
    }

    // Spawn new bubbles
    bubbleGameState.lastBubbleSpawn += bubbleGameState.bubbleSpawnRate;
    if (bubbleGameState.lastBubbleSpawn >= 1) {
        spawnBubble();
        bubbleGameState.lastBubbleSpawn = 0;
    }

    // Update existing bubbles
    for (let i = bubbleGameState.bubbles.length - 1; i >= 0; i--) {
        const bubble = bubbleGameState.bubbles[i];

        if (bubble.type === 'effect') {
            if (!bubble.update()) {
                bubbleGameState.bubbles.splice(i, 1);
            }
            continue;
        }

        // Update bubble lifetime
        bubble.lifetime--;

        // Move bubble slightly
        bubble.x += bubble.velocityX;
        bubble.y += bubble.velocityY;

        // Bounce off edges
        if (bubble.x - bubble.radius <= 0 || bubble.x + bubble.radius >= bubbleGameState.gameWidth) {
            bubble.velocityX *= -1;
        }
        if (bubble.y - bubble.radius <= 0 || bubble.y + bubble.radius >= bubbleGameState.gameHeight) {
            bubble.velocityY *= -1;
        }

        // Remove expired bubbles
        if (bubble.lifetime <= 0) {
            bubbleGameState.bubbles.splice(i, 1);
            // Penalty for missing bubbles
            bubbleGameState.score = Math.max(0, bubbleGameState.score - 5);
            gameController.setScore(bubbleGameState.score);
        }
    }

    // Increase difficulty over time
    if (bubbleGameState.score > 0 && bubbleGameState.score % 300 === 0) {
        bubbleGameState.bubbleSpawnRate = Math.min(bubbleGameState.bubbleSpawnRate + 0.003, 0.04);
        bubbleGameState.bubbleLifetime = Math.max(bubbleGameState.bubbleLifetime - 15, 120);
    }

    // Game over condition (too many bubbles on screen)
    if (bubbleGameState.bubbles.filter(b => b.type !== 'effect').length > 25) {
        bubbleGameState.gameOver = true;
        console.log('[Bubble] Game Over! Too many bubbles! Final Score:', bubbleGameState.score);
    }
}

function spawnBubble() {
    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        const radius = 25 + Math.random() * 25; // 25-50px radius
        const x = radius + Math.random() * (bubbleGameState.gameWidth - radius * 2);
        const y = radius + Math.random() * (bubbleGameState.gameHeight - radius * 2);

        // Check for overlap with existing bubbles
        let overlaps = false;
        for (const existingBubble of bubbleGameState.bubbles) {
            if (existingBubble.type === 'effect') continue;

            const distance = Math.sqrt(
                Math.pow(x - existingBubble.x, 2) + Math.pow(y - existingBubble.y, 2)
            );

            if (distance < radius + existingBubble.radius + 10) { // 10px minimum spacing
                overlaps = true;
                break;
            }
        }

        if (!overlaps) {
            const bubble = {
                x: x,
                y: y,
                radius: radius,
                color: colors[Math.floor(Math.random() * colors.length)],
                lifetime: bubbleGameState.bubbleLifetime,
                velocityX: (Math.random() - 0.5) * bubbleGameState.bubbleSpeed,
                velocityY: (Math.random() - 0.5) * bubbleGameState.bubbleSpeed
            };

            bubbleGameState.bubbles.push(bubble);
            return;
        }

        attempts++;
    }

    // If we couldn't find a spot, just spawn anyway (fallback)
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const radius = 20 + Math.random() * 20;
    const bubble = {
        x: Math.random() * (bubbleGameState.gameWidth - radius * 2) + radius,
        y: Math.random() * (bubbleGameState.gameHeight - radius * 2) + radius,
        radius: radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        lifetime: bubbleGameState.bubbleLifetime,
        velocityX: (Math.random() - 0.5) * bubbleGameState.bubbleSpeed,
        velocityY: (Math.random() - 0.5) * bubbleGameState.bubbleSpeed
    };

    bubbleGameState.bubbles.push(bubble);
}

function renderBubble() {
    const ctx = bubbleGameState.ctx;

    // Clear canvas
    ctx.clearRect(0, 0, bubbleGameState.gameWidth, bubbleGameState.gameHeight);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, bubbleGameState.gameHeight);
    gradient.addColorStop(0, '#E8F5E8');
    gradient.addColorStop(1, '#F0F8FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, bubbleGameState.gameWidth, bubbleGameState.gameHeight);

    // Render bubbles
    bubbleGameState.bubbles.forEach(bubble => {
        if (bubble.type === 'effect') {
            // Pop effect
            ctx.globalAlpha = bubble.lifetime / bubble.maxLifetime;
            ctx.strokeStyle = bubble.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
            return;
        }

        // Regular bubble
        const alpha = bubble.lifetime / bubbleGameState.bubbleLifetime;

        // Bubble body
        ctx.globalAlpha = alpha;
        ctx.fillStyle = bubble.color;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();

        // Bubble highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, bubble.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Bubble border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.globalAlpha = 1;

        // Lifetime indicator
        const indicatorHeight = 4;
        const indicatorWidth = bubble.radius * 2 * alpha;
        ctx.fillStyle = '#FF5722';
        ctx.fillRect(bubble.x - bubble.radius, bubble.y + bubble.radius + 5, indicatorWidth, indicatorHeight);
    });

    // Score
    ctx.fillStyle = 'black';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${bubbleGameState.score}`, 20, 40);

    // Combo
    if (bubbleGameState.comboMultiplier > 1) {
        ctx.fillStyle = '#FF5722';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`Combo: ${bubbleGameState.comboMultiplier}x`, 20, 70);

        // Combo timer bar
        const barWidth = 100;
        const barHeight = 8;
        const timerRatio = bubbleGameState.comboTimer / bubbleGameState.maxComboTimer;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(20, 80, barWidth, barHeight);
        ctx.fillStyle = '#FF5722';
        ctx.fillRect(20, 80, barWidth * timerRatio, barHeight);
    }

    // Bubble count
    const bubbleCount = bubbleGameState.bubbles.filter(b => b.type !== 'effect').length;
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(`Bubbles: ${bubbleCount}`, 20, bubbleGameState.gameHeight - 20);

    if (bubbleGameState.gameOver) {
        // Game over overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, bubbleGameState.gameWidth, bubbleGameState.gameHeight);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText('GAME OVER', bubbleGameState.gameWidth / 2, bubbleGameState.gameHeight / 2 - 50);
        ctx.fillText('GAME OVER', bubbleGameState.gameWidth / 2, bubbleGameState.gameHeight / 2 - 50);

        ctx.font = '24px Arial';
        ctx.strokeText(`Final Score: ${bubbleGameState.score}`, bubbleGameState.gameWidth / 2, bubbleGameState.gameHeight / 2);
        ctx.fillText(`Final Score: ${bubbleGameState.score}`, bubbleGameState.gameWidth / 2, bubbleGameState.gameHeight / 2);

        ctx.font = '18px Arial';
        ctx.strokeText('Click bubbles before they disappear!', bubbleGameState.gameWidth / 2, bubbleGameState.gameHeight / 2 + 50);
        ctx.fillText('Click bubbles before they disappear!', bubbleGameState.gameWidth / 2, bubbleGameState.gameHeight / 2 + 50);
    }
}

function cleanupBubbleGame() {
    console.log('[Bubble] Cleaning up bubble game...');

    // Stop the game loop
    if (bubbleGameState.gameLoopId) {
        clearInterval(bubbleGameState.gameLoopId);
        bubbleGameState.gameLoopId = null;
    }

    // Remove event listeners
    if (bubbleGameState.clickHandler) {
        bubbleGameState.canvas.removeEventListener('click', bubbleGameState.clickHandler);
        bubbleGameState.clickHandler = null;
    }

    // Clear canvas
    if (bubbleGameState.ctx && bubbleGameState.canvas) {
        bubbleGameState.ctx.clearRect(0, 0, bubbleGameState.canvas.width, bubbleGameState.canvas.height);
    }

    console.log('[Bubble] Bubble game cleanup complete');
}