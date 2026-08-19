class ThrowableObject extends MovableObject {
  IMAGES_ROTATE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  width = 50;
  height = 60;
  offset = { top: 10, left: 20, right: 20, bottom: 10 };
  throwSound = new Audio("audio/throw-bottle.mp3");
  burstSound = new Audio("audio/bottle-break.mp3");
  isBroken = false;

  /** @param {number} x - Starting x position.
   * @param {number} y - Starting y position.
   * @param {boolean} otherDirection - Whether the character was facing left.
   * @param {World} world - Reference to the game world. */
  constructor(x, y, otherDirection, world) {
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.x = x;
    this.y = y;
    this.otherDirection = otherDirection;
    this.world = world;
    this.loadAssets();
    this.throw();
  }

  /** Registers sounds and preloads the rotation/splash animation frames. */
  loadAssets() {
    soundManager.addSound(this.throwSound);
    soundManager.addSound(this.burstSound);
    this.loadImages(this.IMAGES_ROTATE);
    this.loadImages(this.IMAGES_SPLASH);
  }

  /** Launches the bottle: plays the throw sound and starts its flight. */
  throw() {
    this.playThrowSound();
    this.speedY = 12;
    this.applyGravity();
    this.applyMovement();
    this.startRotationAnimation();
  }

  /** Moves the bottle horizontally in the throw direction while airborne. */
  applyMovement() {
    let direction = this.otherDirection ? -10 : 10;
    this.throwInterval = setInterval(() => {
      if (!this.isBroken) this.x += direction;
    }, 25);
  }

  /** Starts the looping mid-air rotation animation. */
  startRotationAnimation() {
    this.rotationInterval = setInterval(() => {
      if (!this.isBroken) this.playAnimation(this.IMAGES_ROTATE);
    }, 80);
  }

  /** Plays the throw sound effect. */
  playThrowSound() {
    this.throwSound.currentTime = 0;
    this.world.playSound(this.throwSound, 0.1);
  }

  /** Marks the bottle as broken and plays its burst animation/sound. */
  burst() {
    this.isBroken = true;
    this.stopMovement();
    this.playBurstSound();
    this.startSplashAnimation();
  }

  /** Stops all of the bottle's movement/rotation intervals. */
  stopMovement() {
    clearInterval(this.throwInterval);
    clearInterval(this.rotationInterval);
    this.speedX = this.speedY = this.acceleration = this.speed = 0;
  }

  /** Plays the bottle-breaking sound effect. */
  playBurstSound() {
    this.world.playSound(this.burstSound, 0.3);
  }

  /** Plays the splash animation, then removes the bottle from the world. */
  startSplashAnimation() {
    this.splashInterval = setInterval(() => {
        this.playAnimation(this.IMAGES_SPLASH);
    }, 100);
    setTimeout(() => {
        clearInterval(this.splashInterval);
        this.world.throwableObjects = this.world.throwableObjects.filter(obj => obj !== this);
    }, 500);
  }
}