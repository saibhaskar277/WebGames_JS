// Menu Handler - Manages menu interactions

document.addEventListener('DOMContentLoaded', () => {
    // Get all game cards
    const gameCards = document.querySelectorAll('.game-card:not(.coming-soon)');
    
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const gameName = card.getAttribute('data-game');
            gameController.startGame(gameName);
        });
    });
    
    // Coming soon cards - show alert
    const comingSoonCards = document.querySelectorAll('.game-card.coming-soon');
    comingSoonCards.forEach(card => {
        card.addEventListener('click', () => {
            alert('This game is coming soon! Check back later! 🚀');
        });
    });
});