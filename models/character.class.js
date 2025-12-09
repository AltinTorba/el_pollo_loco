class Character extends MovableObject {
  height = 280;
  width = 140;
  y = 150;
  speed = 5;
  groundY = 150;
  offset = { top: 120, left: 25, right: 42, bottom: 20 };

  IMAGES_IDLE = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png'
  ];

  IMAGES_LONG_IDLE = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png'
  ];

  IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png'
  ];

  IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png'
  ];

  IMAGES_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png'
  ];

  IMAGES_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
    'img/2_character_pepe/5_dead/D-57.png'
  ];

  jumpSound = new Audio('audio/jump.mp3');
  hurtSound = new Audio('audio/hurt.mp3');
  walkingSound = new Audio('audio/walking.mp3');
  snoreSound = new Audio('audio/snoring.mp3');
  deadSound = new Audio('audio/die.mp3');

  isIdle = false;
  isLongIdle = false;
  idleTimeout;
  longIdleTimeout;

  constructor() {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.handleAnimations(), 80);
  }

  handleMovement() {
    let moved = false;

    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      moved = true;
    }

    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      moved = true;
    }

    if (this.isJumping()) {
      this.jump();
      moved = true;
    }

    if (moved) this.resetIdleTimer();

    this.world.camera_x = -this.x + 100;
  }

  isJumping() {
    return this.world.keyboard.SPACE && !this.isAboveGround();
  }

  jump() {
    if (this.speedY > 0) return;
    this.speedY = 8;
    this.world.playSound(this.jumpSound, 0.2);
  }

  handleAnimations() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      if (!this.deadSoundPlayed) {
        this.world.playSound(this.deadSound, 0.2);
        this.deadSoundPlayed = true;
      }
    }
    else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);

      if (!this.hurtSoundPlayed) {
        this.world.playSound(this.hurtSound, 0.2);
        this.hurtSoundPlayed = true;
      }
    }
    else {
      this.hurtSoundPlayed = false;
      this.deadSoundPlayed = false;

      if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      }
      else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);

        if (this.walkingSound.paused) {
          this.world.playSound(this.walkingSound, 0.25);
        }
      }
      else {
        this.handleIdleAnimations();
      }
    }
  }

  handleIdleAnimations() {
    const images = this.isLongIdle ? this.IMAGES_LONG_IDLE : this.IMAGES_IDLE;
    this.playAnimation(images);

    if (this.isLongIdle && this.snoreSound.paused) {
      this.world.playSound(this.snoreSound, 0.2);
    }
  }

  resetIdleTimer() {
    this.isIdle = false;
    this.isLongIdle = false;
    this.snoreSound.pause();
    this.snoreSound.currentTime = 0;

    clearTimeout(this.idleTimeout);
    clearTimeout(this.longIdleTimeout);

    this.idleTimeout = setTimeout(() => {
      this.isIdle = true;

      this.longIdleTimeout = setTimeout(() => {
        if (!this.isWalking() && !this.isAboveGround()) {
          this.isLongIdle = true;
        }
      }, 6000);
    }, 4000);
  }

  isWalking() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }
  
}
