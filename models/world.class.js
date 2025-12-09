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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level1;
    this.throwCooldown = false;

    this.healthStatusbar = new StatusBar("health", 20, 0);
    this.coinStatusbar = new StatusBar("coin", 0, 25);
    this.bottleStatusbar = new StatusBar("bottle", 0, 70);
    this.bossHealthStatusBar = null;

    this.loadSounds();
    this.initialize();
  }

  loadSounds() {
    soundManager.addSound(this.collectCoinSound);
    soundManager.addSound(this.collectBottleSound);
    soundManager.addSound(this.gameoverSound);
    soundManager.addSound(this.winnerSound);
  }

  initialize() {
    this.assignWorldToEnemies();
    this.character.world = this;
    this.run();
    this.draw();
  }

  assignWorldToEnemies() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
        this.bossHealthStatusBar = new StatusBar("bossHealth", 400, 0, enemy);
      }
    });
  }

  run() {
    const loop = () => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkGameOver();
      requestAnimationFrame(loop);
    };
    loop();
  }

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

  endGame(imageSrc, sound) {
    document.getElementById("canvas").classList.add("hidden");
    document.getElementById("endscreen").classList.remove("hidden");
    document.getElementById("end-image").src = imageSrc;
    soundManager.stopAllSounds();
    this.playSound(sound, 0.1);
    this.clearWorld();
  }

  clearWorld() {
    let highestIntervalId = setInterval(() => { }, 1000);
    for (let i = 0; i < highestIntervalId; i++) clearInterval(i);
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

  checkCollisions() {
    this.checkEnemyCollisions();
    this.checkItemCollisions(this.level.coins, this.coinStatusbar, this.collectCoinSound);
    this.checkItemCollisions(this.level.bottles, this.bottleStatusbar, this.collectBottleSound);
    this.checkThrowableCollisions();
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isCollidingOnTop(enemy)) {
        this.character.jump();
        enemy.hit();

        if (enemy instanceof Endboss) {
          enemy.hitSound.currentTime = 0;
          enemy.hitSound.play();
        }

        if (enemy.isDead()) this.defeatEnemy(enemy);
      } else if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.healthStatusbar.setPercentage(this.character.energy);
        this.playHurtSound();
      }
    });
  }

  playHurtSound() {
    const now = Date.now();
    if (this.character.isHurt() && (!this.character.lastHurtSoundTime || now - this.character.lastHurtSoundTime >= 1000)) {
      this.playSound(this.character.hurtSound, 0.1);
      this.character.lastHurtSoundTime = now;
    }
  }

  checkItemCollisions(items, statusbar, sound) {
    items.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        items.splice(index, 1);
        statusbar.increaseCounter();
        this.playSound(sound, 0.02);
      }
    });
  }

  checkThrowableCollisions() {
    this.throwableObjects.forEach((bottle) => {
      if (!bottle.hasHit) {
        this.level.enemies.forEach((enemy) => {
          if (bottle.isColliding(enemy)) {
            bottle.hasHit = true;
            enemy.hit();
            if (enemy instanceof Endboss && this.bossHealthStatusBar) this.bossHealthStatusBar.endboss = enemy;
            bottle.burst();
            setTimeout(() => {
              if (enemy.isDead()) this.defeatEnemy(enemy);
            }, 500);
          }
        });
      }
    });
  }

  defeatEnemy(enemy) {
    enemy.die();
    setTimeout(() => {
      this.level.enemies = this.level.enemies.filter(e => e !== enemy);
    }, 250);
  }

  draw() {
    if (this.stopDrawing) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addBackgroundObjects()
    this.ctx.translate(-this.camera_x, 0);

    this.addStatusbars();
    this.ctx.translate(this.camera_x, 0);

    this.addMovableObjects();
    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addBackgroundObjects() {
    this.addObjectsToMap(this.level.bgObjects);
    this.addObjectsToMap(this.level.clouds);
  }

  addMovableObjects() {
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObjects);
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  addStatusbars() {
    this.addToMap(this.healthStatusbar);
    this.addToMap(this.coinStatusbar);
    this.addToMap(this.bottleStatusbar);
    if (this.bossHealthStatusBar) this.addToMap(this.bossHealthStatusBar);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x *= -1;
  }

  flipImageBack(mo) {
    mo.x *= -1;
    this.ctx.restore();
  }

  playSound(sound, volume) {
    sound.currentTime = 0;
    sound.volume = volume;
    sound.play();
  }
}