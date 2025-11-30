class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  throwableObject = [];
  collectedCoins = 0;
  collectedBottles = 0;

  constructor(canvas, keyboard) {
    // console.log("World constructor called with canvas:", canvas);

    // if (!canvas) {
    //   console.error("Canvas is null in World constructor!");
    //   return;
    // }
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkCollectItems();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.collectedBottles > 0) {
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      this.throwableObject.push(bottle);
      this.collectedBottles--;
    }
  }

  checkCollectItems() {
    this.checkCollectCoins();
    this.checkCollectBottles();
  }

  checkCollectCoins() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(index, 1);
        this.collectedCoins++;
        // console.log("Monedha të mbledhura:", this.collectedCoins);
      }
    });
  }

  checkCollectBottles() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.level.bottles.splice(index, 1);
        this.collectedBottles++;
        // console.log("Shishe të mbledhura:", this.collectedBottles);
      }
    });
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObject);

    this.ctx.translate(-this.camera_x, 0);

    this.drawHUD();

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  drawHUD() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Coins: " + this.collectedCoins, 60, 90);
    this.ctx.fillText("Bottles: " + this.collectedBottles, 60, 120);
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
