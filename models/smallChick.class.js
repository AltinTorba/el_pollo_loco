class Chick extends MovableObject {
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  DEATH_IMAGE = "img/3_enemies_chicken/chicken_small/2_dead/dead.png";

  chickDieSound = new Audio('audio/chick-die.mp3');

  MIN_X = 300;
  MAX_X = 2000;
  MIN_SPEED = 0.3;
  MAX_SPEED = 0.8;
  x = this.MIN_X + Math.random() * this.MAX_X;
  y = 375;
  speed = this.MIN_SPEED + Math.random() * this.MAX_SPEED;
  groundY = 375;
  height = 40;
  width = 40;
  isDefeated = false;

  constructor(world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.world = world;
    this.energy = 2;
    soundManager.addSound(this.chickDieSound);
    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => { this.handleMovement() }, 1000 / 60);
    setInterval(() => { this.handleAnimation() }, 100);
    setInterval(() => { this.handleJumping() }, 500);
  }

  handleMovement() {
    if (!this.isDefeated) this.moveLeft();
  }

  handleAnimation() {
    if (!this.isDefeated) this.playAnimation(this.IMAGES_WALKING);
  }

  handleJumping() {
    if (!this.isDefeated && Math.random() < 0.1) this.jump();
  }

  jump() {
    this.speedY = 8;
  }
}