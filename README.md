# 🐔 El Pollo Loco

A browser-based jump-and-run game built with vanilla JavaScript (ES6 classes) and HTML5 Canvas. Guide Pepe through a Mexican desert, collect coins and salsa bottles, defeat chickens along the way, and face off against the final boss to win.

This project was built as part of the [Developer Akademie](https://developerakademie.com) web development bootcamp.

## 🎮 How to Play

| Action | Key |
|---|---|
| Move left | ← |
| Move right | → |
| Jump | SPACE |
| Throw a bottle | D |

On touch devices, on-screen controls appear automatically during gameplay.

**Goal:** collect coins and bottles, defeat chickens by jumping on them or throwing bottles, and defeat the end boss chicken to win. Watch your health bar - too much damage and it's game over!

## 🛠️ Technologies

- **Vanilla JavaScript** (ES6 classes, no frameworks or build tools)
- **HTML5 Canvas** for rendering
- **CSS3** (custom properties, media queries, container queries) for responsive layout
- **ESLint** for code quality checks

## 📁 Project Structure
├── index.html # Entry point
├── style.css # All styling
├── js/game.js # UI/menu logic, input handling, game bootstrapping
├── models/ # Game entity classes
│ ├── world.class.js # Main game loop, collisions, rendering
│ ├── character.class.js # Player character (Pepe)
│ ├── endboss.class.js # Final boss AI
│ ├── chicken.class.js # Regular enemy
│ ├── smallChick.class.js # Small enemy
│ ├── movableObject.class.js # Base class: physics, collisions, animation
│ ├── drawableObject.class.js# Base class: rendering
│ ├── soundManager.class.js # Centralized mute/sound registry
│ └── ...
├── levels/level1.js # Level layout (enemies, background, items)
├── templates/htmlTemplates.js# Overlay content (About/Impressum/Controls)
└── audio/, img/, fonts/ # Game assets

## 🚀 Running the Game

No build step required - it's plain HTML/CSS/JS.

1. Clone the repository
2. Open `index.html` directly in a browser, or serve it locally (e.g. with the VS Code "Live Server" extension) for the best experience
3. Click "Start" to play

## ✅ Code Quality

This project is linted with ESLint. To check the code:

```bash
npm install
npx eslint models/ js/ levels/ templates/
```

## 📄 License & Credits

- Game concept: [Developer Akademie](https://developerakademie.com)
- Sound effects and icons: [Pixabay](https://pixabay.com)
- Additional icons: [Flaticon](https://flaticon.com)
- Fonts: [FontMeme](https://fontmeme.com)

See the in-game "Impressum" for legal/contact information.
