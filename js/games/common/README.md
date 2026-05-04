# Common Utilities for Games

## Location
`js/games/common/`

## Available Utilities

### tiledLoader.js
Handles loading and parsing of Tiled map format (JSON).

#### Functions

**`loadTiledMap(filePath)`**
- Loads a Tiled map JSON file using XMLHttpRequest
- Returns a Promise that resolves with the parsed map data
- Usage:
  ```javascript
  const mapData = await loadTiledMap('js/games/yourgame/tiles/level.json');
  ```

**`parseTiledObstacles(tiledData, tileSize)`**
- Converts Tiled tile data into obstacle coordinates
- Parameters:
  - `tiledData`: Parsed JSON from Tiled file
  - `tileSize`: Size of each tile (default: 32)
- Returns: Array of obstacle objects with `{x, y, size}`

#### Example Usage
```javascript
// Load and parse tiles
const mapData = await loadTiledMap('js/games/yourgame/tiles/level.json');
const obstacles = parseTiledObstacles(mapData, 32);

// Use obstacles
gameState.obstacles = obstacles;
```

## Future Common Utilities

Consider adding:
- `spriteLoader.js` - Load and cache sprite sheets
- `assetManager.js` - Manage all game assets
- `soundManager.js` - Handle game audio
- `particleSystem.js` - Create particle effects
