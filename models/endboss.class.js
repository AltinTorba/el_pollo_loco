class Endboss extends MovableObject {
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  bossDieSound = new Audio("audio/endboss-die.mp3");
  bossHurtSound = new Audio("audio/endboss-hurt.mp3");
  bossAlertSound = new Audio("audio/endboss-alert.mp3");

  MIN_SPEED = 0.75;
  MAX_SPEED = 3;
  width = 300;
  height = 500;
  y = -30;
  x = 2500;
  offset = { top: 120, left: 50, right: 40, bottom: 140 };
  isAlert = false;
  isDefeated = false;
  hadFirstContact = false;
  alertFrameCounter = 0;

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.energy = 18;
    this.speed = this.MIN_SPEED;
    this.loadAllImages();
    this.addSounds();
    this.animate();
  }

  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  addSounds() {
    soundManager.addSound(this.bossDieSound);
    soundManager.addSound(this.bossHurtSound);
    soundManager.addSound(this.bossAlertSound);
  }

  handleMovement() {
    if (this.isDefeated) return;
    if (this.hadFirstContact) {
      this.world.character.x = Math.min(this.world.character.x, this.x - 50);
      this.speed = this.MAX_SPEED;
      if (this.x <= 400) this.movingLeft = false;
      if (this.x >= 2500) this.movingLeft = true;
    } else {
      this.speed = this.MIN_SPEED;
      if (this.x <= 2000) this.movingLeft = false;
      if (this.x >= 2500) this.movingLeft = true;
    }
    this.movingLeft ? this.moveLeft() : this.moveRight();
  }

  animate() {
    this.movingLeft = true;
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.handleAnimations(), 150);
  }

  handleAnimations() {
    if (this.isDefeated) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurt() || this.hurtFlag) {
      this.playAnimation(this.IMAGES_HURT);
      if (this.hurtFlag) {
        this.world.playSound(this.bossHurtSound, 0.05);
        this.hurtFlag = false;
      }
    } else if (this.isAlert) {
      this.playAnimation(this.IMAGES_ALERT);
      this.handleAlertAnimation();
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
    this.checkForAlertTrigger();
  }

  handleAlertAnimation() {
    this.alertFrameCounter++;
    if (this.alertFrameCounter >= this.IMAGES_ALERT.length) {
      this.isAlert = false;
      this.alertFrameCounter = 0;
    }
  }

  checkForAlertTrigger() {
    if (this.world.character.x > 1700 && !this.hadFirstContact) {
      this.hadFirstContact = true;
      this.isAlert = true;
      this.alertFrameCounter = 0;
      this.world.playSound(this.bossAlertSound, 0.05);
    }
  }
}