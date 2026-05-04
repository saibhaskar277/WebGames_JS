# Bubble Popper Game

A fast-paced bubble popping game where you click bubbles before they disappear!

## Gameplay

- **Objective**: Click bubbles before their lifetime runs out
- **Controls**: Click on bubbles to pop them
- **Scoring**: 10 points per bubble, multiplied by combo
- **Combos**: Consecutive pops increase your multiplier
- **Game Over**: Too many bubbles on screen (15+)

## Features

- Colorful floating bubbles with lifetime indicators
- Combo system for higher scores
- Progressive difficulty (faster spawning, shorter lifetimes)
- Visual pop effects
- Smooth bubble physics with bouncing
- Score and combo tracking

## Technical Details

- **Canvas Size**: Responsive to container
- **Frame Rate**: 60 FPS
- **Bubble Physics**: Floating with edge bouncing and overlap prevention
- **Click Detection**: Closest bubble targeting with 20% tolerance
- **Difficulty**: Spawn rate increases, lifetime decreases every 300 points
- **Game Over**: 25+ bubbles on screen

## Controls

- **Pop Bubbles**: Click on bubbles
- **Pause**: P key
- **Restart**: R key
- **Menu**: Back to Menu button

## Game States

1. **Playing**: Bubbles spawn and float, player clicks to pop
2. **Combo Active**: Multiplier increases with consecutive pops
3. **Game Over**: Too many bubbles cause game over

## Scoring System

- **Base Points**: 10 per bubble
- **Combo Multiplier**: 2x, 3x, 4x, etc. for consecutive pops
- **Penalty**: -5 points for missed bubbles
- **Combo Reset**: Missing a click reduces combo by 1

## Future Enhancements

- Special bubble types (multipliers, bombs, slow-motion)
- Power-ups and special effects
- Different bubble sizes and speeds
- Sound effects and music
- Mobile touch optimization
- Leaderboard integration