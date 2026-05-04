# HyperCasual Games - Project Structure

## Overview
This project is organized with a modular game architecture where each game has its own isolated folder containing all necessary files and data.

## Directory Structure

```
my-js-game/
├── index.html              # Main entry point - Menu and game container
├── README.md              # Project README
├── PROJECT_STRUCTURE.md   # This file
│
├── css/
│   ├── styles.css         # Main game styling (canvas, layout, UI)
│   └── menu.css           # Menu styling
│
├── js/
│   ├── gameController.js  # Core game management (pause, restart, scene switching)
│   ├── menu.js            # Menu interaction handlers
│   │
│   └── games/
│       │
│       ├── snake/
│       │   ├── snake.js           # Snake game logic
│       │   ├── tiles/             # Snake tilemap data (for future use)
│       │   │   └── (tile files)
│       │   └── assets/            # Snake game assets (sprites, etc.)
│       │       └── (asset files)
│       │
│       ├── runner/
│       │   ├── runner.js          # Runner game logic
│       │   ├── tiles/             # Runner tilemap data (for future use)
│       │   │   └── (tile files)
│       │   └── assets/            # Runner game assets (sprites, etc.)
│       │       └── (asset files)
│       │
│       ├── bubblepopper/
│       │   ├── bubblepopper.js    # Bubble popper game logic
│       │   ├── tiles/             # Bubble popper tilemap data (for future use)
│       │   │   └── (tile files)
│       │   └── assets/            # Bubble popper game assets (sprites, etc.)
│       │       └── (asset files)
│       │
│       └── common/
│           └── tiledLoader.js     # Shared tile loading utility
│
└── TileMap/                       # Original Tiled projects (can be deleted)
    └── (old project files)
```

## Adding New Games

When adding a new game to the platform:

1. **Create Game Folder Structure:**
   ```
   js/games/mygame/
   ├── mygame.js          # Game logic file
   ├── tiles/             # Tilemap/level data
   ├── assets/            # Game-specific assets
   ```

2. **Update HTML Script References:**
   Add to `index.html`:
   ```html
   <script src="js/games/mygame/mygame.js"></script>
   ```

3. **Game State Object:**
   Create a game state object similar to `snakeGameState`:
   ```javascript
   const mygameGameState = {
       // Game variables here
   };
   ```

4. **Required Functions:**
   Each game must implement:
   - `initMygameGame()` - Initialize game
   - `updateMygame()` - Update game logic
   - `renderMygame()` - Render game
   - `cleanupMygameGame()` - Clean up resources

5. **Register Game in gameController:**
   Update `startGame()` method to handle your game type.

## File Organization Rules

### By Game
- Each game's code lives in its own folder
- Only shared utilities go in the `common/` folder
- Game-specific data (tiles, assets) stays with the game

### Data Folders
- **tiles/**: Tilemap data, level layouts, JSON from Tiled editor
- **assets/**: Sprites, images, audio files

## Key Game Files

### gameController.js
- Manages game lifecycle (init, pause, restart)
- Handles scene switching between menu and games
- Controls pause/resume functionality
- Keyboard shortcuts (P for pause, R for restart)

### tiledLoader.js
- Shared utility for loading Tiled map JSON files
- Used by games that leverage tile-based level design
- Provides `loadTiledMap()` and `parseTiledObstacles()` functions

### Each Game File (e.g., snake.js)
- Complete game implementation
- Manages own state in isolated object
- Handles own event listeners (cleaned up on exit)
- Updates canvas independently

## Current Games

### Snake Game
- Location: `js/games/snake/snake.js`
- Data: (Reserved for future tiles)
- Controls: Arrow keys or WASD

### Runner Game
- Location: `js/games/runner/runner.js`
- Data: (Reserved for future tiles)
- Controls: Click or SPACE to jump

### Bubble Popper Game
- Location: `js/games/bubblepopper/bubblepopper.js`
- Data: (Reserved for future tiles)
- Controls: Click to pop bubbles

## Development Tips

1. **Game State Isolation**: Each game maintains its own state object to prevent cross-contamination
2. **Event Management**: Store all event handlers in the state object for proper cleanup
3. **Canvas Sizing**: Games use the actual game-content container dimensions
4. **Pause Support**: Games check `gameController.isPaused` in update loop
5. **Path References**: Use relative paths from HTML root for all resources

## Future Enhancements

- Add sprite/asset management system
- Create asset loader utility
- Implement Tiled map loader integration for more games
- Add game difficulty/level progression
- Create particle system for effects
