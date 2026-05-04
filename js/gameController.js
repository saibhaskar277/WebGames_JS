// Game Controller - Manages game state and switching

const gameController = {
    currentGame: null,
    gameWidth: 960,
    gameHeight: 640,
    gameOver: false,
    score: 0,
    isPaused: false,
    pauseKeyHandler: null,
    
    init() {
        this.setupUI();
        this.showMenu();
    },
    
    setupUI() {
        // Menu button
        document.getElementById('menu-btn').addEventListener('click', () => {
            this.returnToMenu();
        });
        
        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
        
        // Pause button
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.togglePause();
        });
        
        // Resume button
        document.getElementById('resume-btn').addEventListener('click', () => {
            this.hidePauseModal();
        });
        
        // Back to menu from pause modal
        document.getElementById('pause-menu-btn').addEventListener('click', () => {
            this.hidePauseModal();
            this.returnToMenu();
        });
    },
    
    togglePause() {
        if (this.currentGame && !this.gameOver) {
            this.isPaused = !this.isPaused;
            if (this.isPaused) {
                this.showPauseModal();
            } else {
                this.hidePauseModal();
            }
        }
    },
    
    restartGame() {
        if (this.currentGame) {
            console.log('Restarting game:', this.currentGame);
            this.startGame(this.currentGame);
        }
    },
    
    showPauseModal() {
        document.getElementById('pause-modal').classList.add('active');
        document.getElementById('pause-btn').classList.add('active');
        console.log('[Game Controller] Pause modal shown');
    },
    
    hidePauseModal() {
        document.getElementById('pause-modal').classList.remove('active');
        document.getElementById('pause-btn').classList.remove('active');
        this.isPaused = false;
        console.log('[Game Controller] Pause modal hidden');
    },
    
    startGame(gameName) {
        console.log('Starting game:', gameName);
        
        // Clean up old game FIRST
        this.cleanupCurrentGame();
        
        this.currentGame = gameName;
        this.gameOver = false;
        this.isPaused = false;
        this.score = 0;
        
        // Hide menu, show game
        document.getElementById('menu-container').classList.remove('active');
        document.getElementById('game-container').classList.add('active');
        
        // Update UI
        const gameInfoMap = {
            snake: { title: '🐍 Snake Game', desc: 'Use arrow keys to move' },
            runner: { title: '🏃 Runner Game', desc: 'Click or SPACE to jump' },
            bubblepopper: { title: '🫧 Bubble Popper', desc: 'Click bubbles before they disappear' }
        };
        
        const info = gameInfoMap[gameName];
        document.getElementById('game-title').textContent = info.title;
        document.getElementById('game-status').textContent = info.desc;
        
        // Update input guide
        this.updateInputGuide(gameName);
        
        // Setup P key for pause and R key for restart
        this.pauseKeyHandler = (e) => {
            if (this.currentGame) {
                if (e.key.toLowerCase() === 'p') {
                    e.preventDefault();
                    this.togglePause();
                } else if (e.key.toLowerCase() === 'r') {
                    e.preventDefault();
                    this.restartGame();
                }
            }
        };
        window.addEventListener('keydown', this.pauseKeyHandler);
        
        // Initialize the game
        if (gameName === 'snake') {
            if (typeof initSnakeGame !== 'undefined') {
                initSnakeGame();
            }
        } else if (gameName === 'runner') {
            if (typeof initRunnerGame !== 'undefined') {
                initRunnerGame();
            }
        } else if (gameName === 'bubblepopper') {
            if (typeof initBubbleGame !== 'undefined') {
                initBubbleGame();
            }
        }
    },
    
    updateInputGuide(gameName) {
        const inputList = document.getElementById('input-list');
        inputList.innerHTML = ''; // Clear previous inputs
        
        const controls = {
            snake: [
                { key: '↑', action: 'Move Up' },
                { key: '↓', action: 'Move Down' },
                { key: '←', action: 'Move Left' },
                { key: '→', action: 'Move Right' },
                { key: 'WASD', action: 'Also works' },
                { key: 'P', action: 'Pause/Resume' },
                { key: 'R', action: 'Restart' }
            ],
            runner: [
                { key: 'Click', action: 'Jump' },
                { key: 'Space', action: 'Jump' },
                { key: 'P', action: 'Pause/Resume' },
                { key: 'R', action: 'Restart' }
            ],
            bubblepopper: [
                { key: 'Click', action: 'Pop Bubbles' },
                { key: 'P', action: 'Pause/Resume' },
                { key: 'R', action: 'Restart' }
            ]
        };
        
        const gameControls = controls[gameName] || [];
        gameControls.forEach(control => {
            const item = document.createElement('div');
            item.className = 'input-item';
            item.innerHTML = `<span class="input-key">${control.key}</span>${control.action}`;
            inputList.appendChild(item);
        });
    },
    
    cleanupCurrentGame() {
        // Remove pause key listener
        if (this.pauseKeyHandler) {
            window.removeEventListener('keydown', this.pauseKeyHandler);
            this.pauseKeyHandler = null;
        }
        
        // Hide pause modal
        this.hidePauseModal();
        
        if (this.currentGame === 'snake' && typeof cleanupSnakeGame !== 'undefined') {
            cleanupSnakeGame();
        } else if (this.currentGame === 'runner' && typeof cleanupRunnerGame !== 'undefined') {
            cleanupRunnerGame();
        } else if (this.currentGame === 'bubblepopper' && typeof cleanupBubbleGame !== 'undefined') {
            cleanupBubbleGame();
        }
    },
    
    returnToMenu() {
        console.log('Returning to menu');
        
        // Clean up current game BEFORE setting to null
        this.cleanupCurrentGame();
        
        this.currentGame = null;
        this.gameOver = false;
        
        // Show menu, hide game
        document.getElementById('menu-container').classList.add('active');
        document.getElementById('game-container').classList.remove('active');
    },
    
    showMenu() {
        document.getElementById('menu-container').classList.add('active');
        document.getElementById('game-container').classList.remove('active');
    },
    
    updateScore(points) {
        this.score += points;
        document.getElementById('score').textContent = `Score: ${this.score}`;
    },
    
    setScore(points) {
        this.score = points;
        document.getElementById('score').textContent = `Score: ${this.score}`;
    },
    
    endGame(finalScore) {
        this.gameOver = true;
        document.getElementById('game-status').textContent = `Game Over! Final Score: ${finalScore}`;
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    gameController.init();
});