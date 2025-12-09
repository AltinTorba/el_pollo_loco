class Chicken extends MovableObject {
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  DEATH_IMAGE = "img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

  chickenDieSound = new Audio("audio/chicken-die.mp3");

  MIN_X = 300;
  MAX_X = 2000;
  MIN_SPEED = 0.15;
  MAX_SPEED = 0.65;
  
  y = 365;
  height = 60;
  width = 60;
  isDefeated = false;

  /** @param {World} world – reference to the game world */
  constructor(world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.world = world;
    this.energy = 2;
    this.x = this.MIN_X + Math.random() * this.MAX_X;
    this.speed = this.MIN_SPEED + Math.random() * this.MAX_SPEED;
    this.loadImages(this.IMAGES_WALKING);
    soundManager.addSound(this.chickenDieSound);
    this.animate();
  }

  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.handleAnimation(), 100);
  }

  handleMovement() {
    if (!this.isDefeated) this.moveLeft();
  }

  handleAnimation() {
    if (!this.isDefeated) this.playAnimation(this.IMAGES_WALKING);
  }
}
