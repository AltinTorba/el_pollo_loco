let canvas;
let world;
let keyboard = new Keyboard();
let introMusic = new Audio('audio/intro-music.mp3');
let gameMusic = new Audio('audio/bg-music.mp3');
setupAudio();

function setupAudio() {
    introMusic.loop = true;
    gameMusic.loop = true;
    soundManager.addSound(introMusic);
    soundManager.addSound(gameMusic);
    soundManager.updateButtonUI();
}

function toggleMuteUI() {
    if (soundManager?.toggleMute) soundManager.toggleMute();
}

function toggleFullScreen() {
    const fullscreenButton = document.getElementById('fullscreen-icon');
    const gameContainer = document.getElementById('game-container');
    let startscreen = document.getElementById('startscreen');
    let endscreen = document.getElementById('endscreen')
    const canvas = document.getElementById('canvas');
    const controlButtons = document.querySelector('.control-buttons');
    const panel = document.querySelector('.panel');
    if (!document.fullscreenElement) {
        openFullscreen(gameContainer, [canvas, startscreen, endscreen], controlButtons, panel);
        fullscreenButton.src = "./img/icons/exit-fullscreen.png";
    } else {
        closeFullscreen([canvas, startscreen, endscreen], controlButtons, panel);
        fullscreenButton.src = "./img/icons/fullscreen.png";
    }
}

/** @param {HTMLElement} element */
/** @param {HTMLElement[]} elements */
/** @param {HTMLElement} controlButtons */
/** @param {HTMLElement} panel */
function openFullscreen(element, elements, controlButtons, panel) {
    element.requestFullscreen?.() ||
    element.webkitRequestFullscreen?.() ||
    element.msRequestFullscreen?.();
    elements.forEach(el => {
        el.style.width = "100%";
        el.style.height = "100%";
    });
    controlButtons.style.zIndex = '10';
    panel.style.zIndex = '10';
}

/**  @param {HTMLElement[]} elements */
/** @param {HTMLElement} controlButtons */ 
/**  @param {HTMLElement} panel */
function closeFullscreen(elements, controlButtons, panel) {
    document.exitFullscreen?.() ||
    document.webkitExitFullscreen?.() ||
    document.msExitFullscreen?.();
    elements.forEach(el => {
        el.style.width = "720px";
        el.style.height = "480px";
    });
    controlButtons.style.zIndex = '';
    panel.style.zIndex = '';
}

document.addEventListener('click', handleIntroMusic, { once: true });

/** @param {Event} event */
function handleIntroMusic(event) {
    let playButton = document.getElementById('playButton');
    if (!playButton.contains(event.target) && introMusic.paused) {
        introMusic.volume = 0.1;
        introMusic.play();
    }
}



/** @param {string} id */
function openOverlay(id) {
    document.getElementById('overlay-text').innerHTML = id === 'controls' ? controlsHTML() : infoHTML();
    document.getElementById('overlay').classList.remove('hidden');
}

function closeOverlay() {
    document.getElementById('overlay').classList.add('hidden');
}

function startGame() {
    setupGameUI();
    initGame();
}

function setupGameUI() {
    canvas = document.getElementById('canvas');
    document.getElementById('startscreen').classList.add('hidden');
    canvas.classList.remove('hidden');
    introMusic.pause();
    introMusic.currentTime = 0;
    gameMusic.volume = 0.1;
    gameMusic.play();
}

function initGame() {
    initLevel();
    init();
    setupTouchControls();
}

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

function restartGame() {
    document.getElementById('endscreen').classList.add('hidden');
    startGame();
}

function backToMenu() {
    document.getElementById('endscreen').classList.add('hidden');
    document.getElementById('startscreen').classList.remove('hidden');
}

function setupTouchControls() {
    const controls = [
        { id: 'btnLeft', key: 'LEFT' },
        { id: 'btnRight', key: 'RIGHT' },
        { id: 'btnJump', key: 'SPACE' },
        { id: 'btnThrow', key: 'D' }
    ];
    controls.forEach(setupTouchEvent);
}

/** @param {{ id: string, key: string }} control */
function setupTouchEvent(control) {
    const button = document.getElementById(control.id);
    button.addEventListener('touchstart', (event) => handleTouch(event, control.key, true), { passive: false });
    button.addEventListener('touchend', (event) => handleTouch(event, control.key, false), { passive: false });
}

/** @param {TouchEvent} event */
/** @param {string} key */
/** @param {boolean} isPressed */

function handleTouch(event, key, isPressed) {
    event.preventDefault();
    keyboard[key] = isPressed;
}


/** @param {KeyboardEvent} event */
/** @param {boolean} isPressed */

function handleKeyboardInput(event, isPressed) {
    const keyMap = {
        39: 'RIGHT',
        37: 'LEFT',
        38: 'UP',
        40: 'DOWN',
        32: 'SPACE',
        68: 'D'
    };
    if (keyMap[event.keyCode]) {
        keyboard[keyMap[event.keyCode]] = isPressed;
    }
}

window.addEventListener("keydown", (event) => handleKeyboardInput(event, true));
window.addEventListener("keyup", (event) => handleKeyboardInput(event, false));
