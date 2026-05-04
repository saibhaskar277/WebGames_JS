# Runner Game

A simple hyper casual endless runner where you tap to jump over obstacles.

## Gameplay

- **Objective**: Jump over obstacles to survive as long as possible
- **Controls**: Click anywhere or press SPACE to jump
- **Scoring**: Earn 10 points for each obstacle you pass
- **Difficulty**: Speed increases as your score grows

## Features

- Simple one-tap controls
- Progressive difficulty scaling
- Multiple obstacle types (tall, wide, small)
- Physics-based jumping with gravity
- Score tracking and speed indicator
- Game over screen with restart instructions

## Technical Details

- **Canvas Size**: Responsive to container
- **Frame Rate**: 60 FPS
- **Physics**: Gravity-based jumping with ground collision
- **Difficulty**: Progressive speed increase every 200 points
- **Obstacle Spacing**: Minimum 200px between obstacles
- **Collision**: Forgiving hit detection with 5px tolerance

## Controls

- **Jump**: Click canvas or SPACE key
- **Pause**: P key
- **Restart**: R key
- **Menu**: Back to Menu button

## Game States

1. **Playing**: Character runs automatically, player jumps over obstacles
2. **Game Over**: Collision with obstacle ends the game
3. **Paused**: Game loop stops, can resume with P

## Future Enhancements

- Power-ups (temporary speed boost, shield)
- Different character skins
- Leaderboard integration
- Sound effects
- Mobile touch optimization