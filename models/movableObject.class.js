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

  /** Starts the per-frame gravity loop that pulls the object back to the ground. */
  applyGravity() {
    const loop = () => {
      this.updateGravity();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /** Applies one frame of gravity: falls while above ground, lands otherwise. */
  updateGravity() {
    this.acceleration = 0.4;

    if (this.isAboveGround() || this.speedY > 0) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
    } else if (this.y > this.groundY) {
      this.resetToGround();
    }
  }

  /** Snaps the object to ground level and stops vertical movement. */
  resetToGround() {
    this.y = this.groundY;
    this.speedY = 0;
  }

  /** @returns {boolean} Whether the object currently counts as airborne. */
  isAboveGround() {
    return this instanceof ThrowableObject || this.y < this.groundY;
  }

  /** Axis-aligned bounding box collision check against another object.
   * @param {MovableObject} mo - The other object to check against.
   * @returns {boolean} Whether the two hitboxes overlap. */
  isColliding(mo) {
    let [left, right, top, bottom] = this.getBounds();
    let [moLeft, moRight, moTop, moBottom] = mo.getBounds();
    return right > moLeft && left < moRight && bottom > moTop && top < moBottom;
  }

  /** Computes this object's real hitbox (sprite bounds shrunk by its offset).
   * @returns {[number, number, number, number]} [left, right, top, bottom] */
  getBounds() {
    let left = this.x + (this.otherDirection ? this.offset.right : this.offset.left);
    let right = this.x + this.width - (this.otherDirection ? this.offset.left : this.offset.right);
    let top = this.y + this.offset.top;
    let bottom = this.y + this.height - this.offset.bottom;
    return [left, right, top, bottom];
  }

  /**
   * Whether this object is falling onto the top of another one (used for
   * "jump kill" enemies). Uses each object's offset-adjusted hitbox (via
   * getBounds()) rather than raw sprite bounds, so the kill only registers
   * once the character's feet visually reach the enemy's head instead of
   * while still airborne above it.
   */
  isCollidingOnTop(obj) {
    if (obj instanceof Endboss) return false;
    let [charLeft, charRight, , charBottom] = this.getBounds();
    let [objLeft, objRight, objTop, objBottom] = obj.getBounds();
    let objHeight = objBottom - objTop;
    return (
      charRight > objLeft &&
      charLeft < objRight &&
      charBottom >= objTop &&
      charBottom <= objTop + objHeight * 0.6 &&
      this.speedY <= 0
    );
  }

  /** Applies one hit of damage, triggering the hurt/death state as needed. */
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

  /** @returns {boolean} Whether enough time has passed since the last hit to take another. */
  canTakeDamage() {
    return Date.now() - this.lastHit > 100;
  }

  /** @returns {boolean} Whether the object was hit within the last second. */
  isHurt() {
    return (Date.now() - this.lastHit) / 1000 < 1;
  }

  /** @returns {boolean} Whether the object has run out of energy. */
  isDead() {
    return this.energy <= 0;
  }

  /** Advances and draws a looping frame animation.
   * @param {string[]} images - Ordered list of image paths to cycle through. */
  playAnimation(images) {
    let path = images[this.currentImage % images.length];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Advances a death animation one frame at a time and then freezes on
   * the last frame, instead of looping back to the start like
   * playAnimation() does. Uses its own frame counter (deathFrameIndex)
   * so it doesn't fight with wherever the shared currentImage counter
   * happens to be from the object's other animations.
   */
  playFinalAnimation(images) {
    if (this.deathFrameIndex === undefined) this.deathFrameIndex = 0;
    if (this.deathFrameIndex < images.length) {
      this.img = this.imageCache[images[this.deathFrameIndex]];
      this.deathFrameIndex++;
    }
  }

  /** Moves the object one step to the right. */
  moveRight() {
    this.x += this.speed;
  }

  /** Moves the object one step to the left. */
  moveLeft() {
    this.x -= this.speed;
  }

  /** Gives the object an upward jump impulse. */
  jump() {
    this.speedY = 8;
    this.applyGravity();
  }

  /** Marks the object as defeated and plays its death animation/sound once. */
  die() {
    if (this.isDefeated) return;
    this.isDefeated = true;
    this.speed = 0;
    this.playDeathAnimation();
    this.playDeathSound();
  }

  /** Plays the single-frame death image for objects that don't have a death sequence. */
  playDeathAnimation() {
    if (this.IMAGES_DEAD) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.DEATH_IMAGE) {
      this.loadImage(this.DEATH_IMAGE);
    }
  }

  /** Plays this object's death sound, if it has one. */
  playDeathSound() {
    let sound = this.getDeathSound();
    if (sound) {
      sound.volume = 0.1;
      sound.currentTime = 0;
      sound.play();
    }
  }

  /** @returns {HTMLAudioElement|null} The death sound for this object's type. */
  getDeathSound() {
    if (this instanceof Chicken) return this.chickenDieSound;
    if (this instanceof Endboss) return this.bossDieSound;
    if (this instanceof Chick) return this.chickDieSound;
    return null;
  }
}