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

  /** Preloads animation frames, registers sounds, and starts the movement/animation loops. */
  constructor() {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.registerSounds();
    this.applyGravity();
    this.animate();
  }

  /**
   * Registers every character sound with the SoundManager so the mute
   * button silences walking/jumping/hurt/snoring/dying, and so
   * stopAllSounds() (called on game over) can stop them too.
   */
  registerSounds() {
    soundManager.addSound(this.jumpSound);
    soundManager.addSound(this.hurtSound);
    soundManager.addSound(this.walkingSound);
    soundManager.addSound(this.snoreSound);
    soundManager.addSound(this.deadSound);
  }

  /** Starts the per-frame movement loop and the slower animation loop. */
  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.handleAnimations(), 80);
  }

  /**
   * Pulls the character back out to exactly touch the end boss (zero-gap
   * contact, no overlap) if the movement that was just applied this frame
   * pushed it into the boss's hitbox. Correcting after the fact - once per
   * movement tick - lands on an exact 0px gap without needing to predict
   * the next step, and doesn't fight the character's own movement the way
   * a separate/asynchronous correction loop would.
   */
  resolveBossOverlap() {
    const boss = this.world.level.enemies.find((e) => e instanceof Endboss && !e.isDefeated);
    if (!boss) return;
    const [charLeft, charRight] = this.getBounds();
    const [bossLeft, bossRight] = boss.getBounds();
    if (charRight <= bossLeft || charLeft >= bossRight) return;
    if (charLeft < bossLeft) {
      this.x -= charRight - bossLeft;
    } else {
      this.x += bossRight - charLeft;
    }
    this.x = Math.round(Math.max(0, Math.min(this.x, this.world.level.level_end_x)));
  }

  /** Reads keyboard input for one frame and moves/jumps accordingly. */
  handleMovement() {
    if (this.isDead()) return;
    let moved = this.handleHorizontalMovement();
    this.resolveBossOverlap();

    if (this.isJumping()) {
      this.jump();
      moved = true;
    }

    if (moved) this.resetIdleTimer();
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Applies left/right keyboard input for one frame.
   * @returns {boolean} Whether the character actually moved this frame.
   */
  handleHorizontalMovement() {
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
    return moved;
  }

  /** @returns {boolean} Whether the jump key is pressed while grounded. */
  isJumping() {
    return this.world.keyboard.SPACE && !this.isAboveGround();
  }

  /** Starts a jump, unless already mid-jump, and plays the jump sound. */
  jump() {
    if (this.speedY > 0) return;
    this.speedY = 8;
    this.world.playSound(this.jumpSound, 0.2);
  }

  /**
   * Stops the walking sound immediately once movement keys are released,
   * instead of letting the clip play out to its natural end regardless of
   * whether the character is still walking.
   */
  stopWalkingSound() {
    this.walkingSound.pause();
    this.walkingSound.currentTime = 0;
  }

  /**
   * Stops the snoring sound whenever the character isn't in the truly
   * idle/long-idle state (e.g. dead, hurt, jumping, or walking), instead
   * of only stopping it inside resetIdleTimer() - which never runs once
   * the character dies mid-snore.
   */
  stopSnoreSound() {
    this.snoreSound.pause();
    this.snoreSound.currentTime = 0;
  }

  /** Picks and plays the correct animation/sound for the current state. */
  /** Picks and plays the correct animation/sound for the current state. */
  handleAnimations() {
    if (!this.isWalking()) this.stopWalkingSound();
    if (!this.isTrulyIdle()) this.stopSnoreSound();

    if (this.isDead()) {
      this.playDeathAnimation();
    } else if (this.isHurt()) {
      this.playHurtAnimation();
    } else {
      this.hurtSoundPlayed = false;
      this.deadSoundPlayed = false;
      this.playAliveAnimation();
    }
  }

  /** @returns {boolean} Whether the character is standing still and unharmed (eligible to snore). */
  isTrulyIdle() {
    return !this.isDead() && !this.isHurt() && !this.isAboveGround() && !this.isWalking();
  }

  /** Plays the death animation once, and its sound the first time only. */
  playDeathAnimation() {
    this.playFinalAnimation(this.IMAGES_DEAD);
    if (!this.deadSoundPlayed) {
      this.world.playSound(this.deadSound, 0.2);
      this.deadSoundPlayed = true;
    }
  }

  /** Plays the hurt animation, and its sound the first time only. */
  playHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
    if (!this.hurtSoundPlayed) {
      this.world.playSound(this.hurtSound, 0.2);
      this.hurtSoundPlayed = true;
    }
  }

  /** Picks jumping, walking, or idle animation based on current movement. */
  playAliveAnimation() {
    if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.isWalking()) {
      this.playAnimation(this.IMAGES_WALKING);
      if (this.walkingSound.paused) {
        this.world.playSound(this.walkingSound, 0.6);
      }
    } else {
      this.handleIdleAnimations();
    }
  }

  /** Plays the idle or long-idle (snoring) animation as appropriate. */
  handleIdleAnimations() {
    const images = this.isLongIdle ? this.IMAGES_LONG_IDLE : this.IMAGES_IDLE;
    this.playAnimation(images);

    if (this.isLongIdle && this.snoreSound.paused) {
      this.world.playSound(this.snoreSound, 0.2);
    }
  }

  /** Resets the idle/long-idle timers whenever the character moves. */
  resetIdleTimer() {
    this.isIdle = false;
    this.isLongIdle = false;
    this.stopSnoreSound();
    clearTimeout(this.idleTimeout);
    clearTimeout(this.longIdleTimeout);
    this.idleTimeout = setTimeout(() => this.startLongIdleTimer(), 4000);
  }

  /** Starts the second-stage timer that triggers the snoring animation. */
  startLongIdleTimer() {
    this.isIdle = true;
    this.longIdleTimeout = setTimeout(() => {
      if (!this.isWalking() && !this.isAboveGround()) this.isLongIdle = true;
    }, 6000);
  }

  /** @returns {boolean} Whether a left/right movement key is currently held. */
  isWalking() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }
  
}
