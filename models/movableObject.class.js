class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 3;
  groundY = 150;
  energy = 100;
  lastHit = 0;
  offset = { top: 0, left: 0, right: 0, bottom: 0 };
  hurtFlag = false;
  isDefeated = false;
  currentImage = 0;

  applyGravity() {
    const loop = () => {
      this.updateGravity();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  updateGravity() {
    this.acceleration = 0.4;

    if (this.isAboveGround() || this.speedY > 0) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
    } else if (this.y > this.groundY) {
      this.resetToGround();
    }
  }

  resetToGround() {
    this.y = this.groundY;
    this.speedY = 0;
  }

  isAboveGround() {
    return this instanceof ThrowableObject || this.y < this.groundY;
  }

  isColliding(mo) {
    let [left, right, top, bottom] = this.getBounds();
    let [moLeft, moRight, moTop, moBottom] = mo.getBounds();
    return right > moLeft && left < moRight && bottom > moTop && top < moBottom;
  }

  getBounds() {
    let left = this.x + (this.otherDirection ? this.offset.right : this.offset.left);
    let right = this.x + this.width - (this.otherDirection ? this.offset.left : this.offset.right);
    let top = this.y + this.offset.top;
    let bottom = this.y + this.height - this.offset.bottom;
    return [left, right, top, bottom];
  }

  isCollidingOnTop(obj) {
    if (obj instanceof Endboss) return false;
    return (
      this.x + this.width > obj.x &&
      this.x < obj.x + obj.width &&
      this.y + this.height >= obj.y &&
      this.y + this.height <= obj.y + obj.height * 0.9 &&
      this.speedY <= 0
    );
  }

  hit() {
    if (this.canTakeDamage()) {
      this.energy -= 2;
      if (this.isDead()) this.die();
      this.lastHit = Date.now();
      if (!this.isDead()) {
        this.hurtFlag = true;
      }

      if (this.isDead()) {
        this.die();
      }
    }
  }

  canTakeDamage() {
    return Date.now() - this.lastHit > 100;
  }

  isHurt() {
    return (Date.now() - this.lastHit) / 1000 < 1;
  }

  isDead() {
    return this.energy <= 0;
  }

  playAnimation(images) {
    let path = images[this.currentImage % images.length];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 8;
    this.applyGravity();
  }

  die() {
    if (this.isDefeated) return;
    this.isDefeated = true;
    this.speed = 0;
    this.playDeathAnimation();
    this.playDeathSound();
  }

  playDeathAnimation() {
    if (this.IMAGES_DEAD) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.DEATH_IMAGE) {
      this.loadImage(this.DEATH_IMAGE);
    }
  }

  playDeathSound() {
    let sound = this.getDeathSound();
    if (sound) {
      sound.volume = 0.1;
      sound.currentTime = 0;
      sound.play();
    }
  }

  getDeathSound() {
    if (this instanceof Chicken) return this.chickenDieSound;
    if (this instanceof Endboss) return this.bossDieSound;
    if (this instanceof Chick) return this.chickDieSound;
    return null;
  }
}