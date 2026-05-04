# HyperCasual Games Platform

## Overview
A modular game development platform built with vanilla JavaScript and HTML5 Canvas. Currently features three games (Snake, Runner, and Bubble Popper) with a unified menu system, pause/resume, and restart functionality.

## Current Games

### 🐍 Snake Game
- Classic snake gameplay - eat food and grow
- Grid-based movement
- Simple, addictive mechanics
- **Controls**: Arrow keys or WASD, P to pause, R to restart

### 🏃 Runner Game
- Endless runner with jumping mechanics
- Progressive difficulty scaling
- **Controls**: Click or SPACE to jump, P to pause, R to restart

### 🫧 Bubble Popper Game
- Click bubbles before they disappear
- Combo system for higher scores
- **Controls**: Click to pop bubbles, P to pause, R to restart

## Project Structure

```
my-js-game/
├── index.html                      # Main entry point
├── PROJECT_STRUCTURE.md            # Detailed project organization guide
│
├── css/
│   ├── styles.css                  # Main UI and game styling
│   └── menu.css                    # Menu styling
│
├── js/
│   ├── gameController.js           # Core game platform logic
│   ├── menu.js                     # Menu interaction
│   │
│   └── games/
│       ├── snake/
│       │   ├── snake.js            # Snake game logic
│       │   ├── README.md           # Snake documentation
│       │   ├── config.json         # Snake configuration
│       │   ├── tiles/              # Reserved for future tile-based levels
│       │   └── assets/             # Game assets folder
│       ││       ├── runner/
│       │   ├── runner.js           # Runner game logic
│       │   ├── README.md           # Runner documentation
│       │   ├── config.json         # Runner configuration
│       │   ├── tiles/              # Reserved for future tile-based levels
│       │   └── assets/             # Game assets folder
│       │
│       ├── bubblepopper/
│       │   ├── bubblepopper.js     # Bubble popper game logic
│       │   ├── README.md           # Bubble popper documentation
│       │   ├── config.json         # Bubble popper configuration
│       │   ├── tiles/              # Reserved for future tile-based levels
│       │   └── assets/             # Game assets folder
│       ││       └── common/
│           ├── tiledLoader.js      # Shared tile loading utility
│           └── README.md           # Common utilities documentation
```

## Features

### Platform Features
✅ Multi-game launcher with professional UI  
✅ Unified pause/resume system (P key)  
✅ Game restart functionality (R key)  
✅ Clean game state management  
✅ Proper cleanup between game switches  
✅ Responsive canvas sizing  
✅ Interactive control guide per game  

### Technical Highlights
- Modular architecture - each game is self-contained
- Proper event listener management (no memory leaks)
- AABB collision detection
- Game state isolation (prevents cross-contamination)
- Organized data folders for future scalability

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No external dependencies required

### Running the Game
1. Clone or download the repository
2. Open `index.html` in your web browser
3. Select a game from the menu
4. Play and enjoy!

### Game Controls Summary

| Action | Key(s) |
|--------|---------|
| Pause Game | P |
| Restart Game | R |
| Back to Menu | Click button or press ESC |
| Snake: Move | Arrow keys or WASD |
| Runner: Jump | Click or SPACE |
| Bubble Popper: Pop | Click |

## Development Guide

### For Game Creators
1. Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed architecture
2. See individual game README files in `js/games/[game-name]/README.md`
3. Each game folder has its own:
   - Game logic file (game-name.js)
   - Configuration file (config.json)
   - Dedicated tiles/ and assets/ folders

### Adding a New Game
1. Create `js/games/mygame/` folder structure
2. Implement required functions (init, update, render, cleanup)
3. Add script reference to `index.html`
4. Register game in `gameController.js`
5. See PROJECT_STRUCTURE.md for detailed instructions

### Common Utilities
Located in `js/games/common/`:
- **tiledLoader.js** - Load and parse Tiled map format
- Easily extensible for new shared utilities

## Architecture Highlights

### Game Controller
- Central hub for game lifecycle management
- Handles scene transitions (menu ↔ game)
- Manages pause/resume state
- Keyboard shortcut handling (P, R)

### Game State Objects
Each game maintains isolated state:
```javascript
const snakeGameState = { /* snake data */ };
```

This prevents data cross-contamination and makes games independent.

### Event Management
All event handlers are stored and removed properly:
- Prevents memory leaks
- Allows clean game switching
- No ghost listeners from previous games

## Future Enhancements

### Planned Features
- [ ] Sound effects and music system
- [ ] Particle effects engine
- [ ] Sprite management system
- [ ] Asset loader utility
- [ ] Game difficulty settings
- [ ] Leaderboard/high scores
- [ ] More games (Puzzle, Racing, etc.)

### Extensibility
The platform is designed to easily add:
- New games without affecting existing ones
- Shared utilities in `common/` folder
- Game-specific assets in dedicated folders
- Configuration-driven game parameters

## Performance
- Efficient canvas rendering (~60 FPS)
- No frame rate drops during game switching
- Minimal memory footprint
- Clean garbage collection on pause/switches

## Debugging
Each game logs important events to browser console:
- Game initialization
- Cleanup operations
- Event listener management
- Pause/resume state changes

Open DevTools (F12) and check Console tab for logs.

## Technologies Used
- HTML5 Canvas for graphics
- Vanilla JavaScript (ES6)
- CSS3 for styling
- Tiled Editor for level design (optional)

## License
Open source - feel free to use and modify for learning purposes.