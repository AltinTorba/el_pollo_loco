class World {
  character = new Character();
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  healthStatusbar = new StatusBar("health", 20, 0);
  coinStatusbar = new StatusBar("coin", 0, 25);
  bottleStatusbar = new StatusBar("bottle", 0, 70);
  bossHealthStatusBar = null;
  throwableObjects = [];

  collectCoinSound = new Audio("audio/collect-coin.mp3");
  collectBottleSound = new Audio("audio/collect-bottle.mp3");
  gameoverSound = new Audio("audio/gameover.mp3");
  winnerSound = new Audio('audio/winner.mp3')

  /**
   * @param {HTMLCanvasElement} canvas - Canvas the world is rendered onto.
   * @param {Keyboard} keyboard - Shared keyboard/touch input state.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level1;
    this.throwCooldown = false;
    this.loadSounds();
    this.initialize();
  }

  /** Registers this world's one-off sound effects with the SoundManager. */
  loadSounds() {
    soundManager.addSound(this.collectCoinSound);
    soundManager.addSound(this.collectBottleSound);
    soundManager.addSound(this.gameoverSound);
    soundManager.addSound(this.winnerSound);
  }

  /** Links enemies/character back to this world and starts the game loops. */
  initialize() {
    this.assignWorldToEnemies();
    this.character.world = this;
    this.run();
    this.draw();
  }

  /** Gives every enemy a back-reference to this world; sets up the boss bar. */
  assignWorldToEnemies() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
        this.bossHealthStatusBar = new StatusBar("bossHealth", 400, 0, enemy);
      }
    });
  }

  /** Main logic loop: collisions, throwing, and game-over checks every frame. */
  run() {
    const loop = () => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkGameOver();
      requestAnimationFrame(loop);
    };
    loop();
  }

  /** Ends the game once the character dies or the end boss is defeated. */
  checkGameOver() {
    if (this.character && this.character.isDead()) {
      setTimeout(() => {
        this.endGame("img/9_intro_outro_screens/You won, you lost/Game Over.png", this.gameoverSound);
      }, 1000);
    }
    else if (this.level.enemies && this.level.enemies.some(e => e instanceof Endboss && e.isDead())) {
      setTimeout(() => {
        this.endGame("img/9_intro_outro_screens/You won, you lost/You won A.png", this.winnerSound);
      }, 1000);
    }
  }

  /** Shows the end screen, stops every sound, plays the win/lose jingle, and tears the round down.
   * @param {string} imageSrc - Path to the win/lose screen image.
   * @param {HTMLAudioElement} sound - Jingle to play for this outcome. */
  endGame(imageSrc, sound) {
    document.getElementById("canvas").classList.add("hidden");
    document.getElementById("endscreen").classList.remove("hidden");
    document.getElementById("end-image").src = imageSrc;
    document.getElementById("game-container").classList.remove("show-panel");
    soundManager.stopAllSounds();
    this.playSound(sound, 0.1);
    this.clearWorld();
  }

  /**
   * Stops every interval/timeout in the page (character, enemy, and sound
   * loops) and drops references to the current round's objects so they
   * can be garbage collected instead of continuing to run invisibly in
   * the background after the round has ended.
   */
  clearWorld() {
    this.clearAllIntervals();
    this.stopDrawing = true;
    this.level.enemies = [];
    this.level.coins = [];
    this.level.bottles = [];
    this.throwableObjects = [];
    this.character = null;
    this.healthStatusbar = null;
    this.coinStatusbar = null;
    this.bottleStatusbar = null;
    this.bossHealthStatusBar = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /** Clears every setInterval/setTimeout currently scheduled on the page. */
  clearAllIntervals() {
    let highestIntervalId = setInterval(() => { }, 1000);
    for (let i = 0; i < highestIntervalId; i++) clearInterval(i);
  }

  /** Spawns a thrown bottle when the throw key is pressed and one is available. */
  checkThrowObjects() {
    if (!this.bottleStatusbar) return;
    if (this.keyboard.D && this.bottleStatusbar.counter > 0 && !this.throwCooldown) {
      this.throwCooldown = true;
      let offsetX = this.character.otherDirection ? -10 : 100;
      this.throwableObjects.push(new ThrowableObject(this.character.x + offsetX, this.character.y + 100, this.character.otherDirection, this));
      this.bottleStatusbar.counter--;
      setTimeout(() => (this.throwCooldown = false), 500);
    }
  }

  /** Runs every collision check for the current frame. */
  checkCollisions() {
    this.checkEnemyCollisions();
    this.checkItemCollisions(this.level.coins, this.coinStatusbar, this.collectCoinSound);
    this.checkItemCollisions(this.level.bottles, this.bottleStatusbar, this.collectBottleSound);
    this.checkThrowableCollisions();
  }

  /** Handles jump-kills and damage-on-touch against every enemy. */
  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isCollidingOnTop(enemy)) {
        this.character.jump();
        enemy.hit();
        if (enemy.isDead()) this.defeatEnemy(enemy);
      } else if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.healthStatusbar.setPercentage(this.character.energy);
        this.playHurtSound();
      }
    });
  }

  /** Plays the character's hurt sound, throttled to once per second. */
  playHurtSound() {
    const now = Date.now();
    if (this.character.isHurt() && (!this.character.lastHurtSoundTime || now - this.character.lastHurtSoundTime >= 1000)) {
      this.playSound(this.character.hurtSound, 0.1);
      this.character.lastHurtSoundTime = now;
    }
  }

  /** Removes any collectible the character touches and updates its status bar.
   * @param {Array} items - Coins or bottles currently in the level.
   * @param {StatusBar} statusbar - The matching counter status bar.
   * @param {HTMLAudioElement} sound - Pickup sound to play. */
  checkItemCollisions(items, statusbar, sound) {
    items.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        items.splice(index, 1);
        statusbar.increaseCounter();
        this.playSound(sound, 0.02);
      }
    });
  }

  /** Resolves thrown bottles hitting enemies (how the end boss takes damage). */
  checkThrowableCollisions() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.hasHit) return;
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy)) this.resolveBottleHit(bottle, enemy);
      });
    });
  }

  /**
   * Applies a single bottle-vs-enemy hit: marks the bottle spent, damages
   * the enemy, bursts the bottle, and defeats the enemy shortly after if
   * that hit was fatal.
   */
  resolveBottleHit(bottle, enemy) {
    bottle.hasHit = true;
    enemy.hit();
    if (enemy instanceof Endboss && this.bossHealthStatusBar) this.bossHealthStatusBar.endboss = enemy;
    bottle.burst();
    setTimeout(() => {
      if (enemy.isDead()) this.defeatEnemy(enemy);
    }, 500);
  }

  /** Plays an enemy's death sequence and removes it from the level shortly after.
   * @param {MovableObject} enemy - The enemy that was just defeated. */
  defeatEnemy(enemy) {
    enemy.die();
    setTimeout(() => {
      this.level.enemies = this.level.enemies.filter(e => e !== enemy);
    }, 250);
  }

  /** Renders one frame: background, status bars, then movable objects. */
  draw() {
    if (this.stopDrawing) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.withCameraOffset(() => this.addBackgroundObjects());
    this.addStatusbars();
    this.withCameraOffset(() => this.addMovableObjects());
    requestAnimationFrame(() => this.draw());
  }

  /**
   * Runs the given draw callback translated by the current camera offset,
   * then restores the canvas transform afterwards.
   * @param {Function} drawFn - Draw calls to run under the camera offset.
   */
  withCameraOffset(drawFn) {
    this.ctx.translate(this.camera_x, 0);
    drawFn();
    this.ctx.translate(-this.camera_x, 0);
  }

  /** Draws the parallax background layers and clouds. */
  addBackgroundObjects() {
    this.addObjectsToMap(this.level.bgObjects);
    this.addObjectsToMap(this.level.clouds);
  }

  /** Draws the character, enemies, collectibles, and thrown bottles. */
  addMovableObjects() {
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObjects);
  }

  /** Draws a list of objects onto the canvas.
   * @param {DrawableObject[]} objects - Objects to draw. */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /** Draws a single object, flipping it horizontally if it's facing left.
   * @param {DrawableObject} mo - The object to draw. */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /** Draws the health, coin, bottle, and (if active) boss health bars. */
  addStatusbars() {
    this.addToMap(this.healthStatusbar);
    this.addToMap(this.coinStatusbar);
    this.addToMap(this.bottleStatusbar);
    if (this.bossHealthStatusBar) this.addToMap(this.bossHealthStatusBar);
  }

  /** Mirrors the canvas horizontally around an object so it draws facing the opposite direction.
   * @param {DrawableObject} mo - The object about to be drawn flipped. */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x *= -1;
  }

  /** Restores the canvas transform and object position after a flipped draw.
   * @param {DrawableObject} mo - The object that was just drawn flipped. */
  flipImageBack(mo) {
    mo.x *= -1;
    this.ctx.restore();
  }

  /**
   * Plays a sound effect, swallowing the benign "play() interrupted by
   * pause()" rejection that can happen when a sound (e.g. walking) is
   * paused again right after being started.
   */
  playSound(sound, volume) {
    sound.currentTime = 0;
    sound.volume = volume;
    sound.play().catch(() => {});
  }
}