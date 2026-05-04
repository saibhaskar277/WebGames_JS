# Snake Game

## Overview
Classic snake game - eat food and grow without hitting walls or yourself.

## Files
- **snake.js** - Main game logic
- **config.json** - Game configuration (grid size, spawn rates, etc.)

## Folders
- **tiles/** - For future tile-based maze levels (currently empty)
- **assets/** - Game sprites and assets (not yet implemented)

## Game State
All game data is stored in `snakeGameState` object:
- Snake position and body segments
- Food position
- Current direction
- Score
- Game status

## Controls
- Arrow Keys or WASD - Move snake
- P - Pause/Resume
- R - Restart game

## Future Enhancements
- Tile-based maze mode using JSON levels
- Sprite-based rendering
- Multiple difficulty levels
- Power-ups system
- High scores leaderboard

## Adding Levels
To create a maze-based level:
1. Create a tile JSON file in `tiles/` folder
2. Update `config.json` to reference the level
3. Modify snake.js to load different level types

## Example Level Structure
```json
{
  "level": 1,
  "name": "Maze Mode",
  "tiles": [...],
  "startPosition": {"x": 150, "y": 150},
  "foods": [{"x": 100, "y": 100}]
}
```
