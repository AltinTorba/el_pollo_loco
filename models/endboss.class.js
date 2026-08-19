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

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
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
  /** Real visual gap (px) at which the boss stops advancing and attacks instead. */
  ATTACK_RANGE = 30;
  width = 300;
  height = 500;
  y = -30;
  x = 2500;
  offset = { top: 120, left: 50, right: 40, bottom: 140 };
  isAlert = false;
  isAttacking = false;
  isDefeated = false;
  hadFirstContact = false;
  alertFrameCounter = 0;

  /** Preloads animation frames, registers sounds, and starts the movement/animation loops. */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.energy = 18;
    this.speed = this.MIN_SPEED;
    this.loadAllImages();
    this.addSounds();
    this.animate();
  }

  /** Preloads every animation frame used by the boss. */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  /** Registers the boss's sounds with the SoundManager so mute affects them too. */
  addSounds() {
    soundManager.addSound(this.bossDieSound);
    soundManager.addSound(this.bossHurtSound);
    soundManager.addSound(this.bossAlertSound);
  }

  /**
   * Before the player has been spotted, the boss idles within a small
   * patrol range. Once alerted, it actively closes the distance to the
   * character instead of just patrolling back and forth, and stops
   * advancing (switching to its attack animation) once close enough to
   * actually threaten the player.
   */
  handleMovement() {
    if (this.isDefeated) return;
    this.hadFirstContact ? this.chaseCharacter() : this.patrol();
    if (!this.isAttacking) {
      this.movingLeft ? this.moveLeft() : this.moveRight();
    }
  }

  /**
   * Actively closes the distance to the character (no hard left/right
   * boundary, unlike patrol() below - it needs to follow the character
   * anywhere across the level, including near x=0). Keeps advancing until
   * it actually touches the character (real hitbox overlap, not a
   * buffered "close enough" range), so the attack animation and damage
   * both start exactly on contact, matching every other enemy in the game.
   */
  chaseCharacter() {
    const character = this.world.character;
    this.speed = this.MAX_SPEED;
    this.isAttacking = this.isColliding(character);
    if (!this.isAttacking) this.faceCharacter(character);
    this.stayWithinLevelBounds();
  }

  /** Points the boss toward whichever side the character is currently on. */
  faceCharacter(character) {
    const [bossLeft, bossRight] = this.getBounds();
    const [charLeft, charRight] = character.getBounds();
    this.movingLeft = (bossLeft + bossRight) / 2 > (charLeft + charRight) / 2;
  }

  /**
   * Safety rails matching the level's own playable bounds, so chasing the
   * character all the way to either edge can't push the boss (and by
   * extension the character, via resolveBossOverlap) past x=0 or off the
   * right edge into the unrendered area beyond the level.
   */
  stayWithinLevelBounds() {
    if (this.x <= 0) this.movingLeft = false;
    if (this.x >= this.world.level.level_end_x) this.movingLeft = true;
  }

  /** Idles back and forth within a small range before spotting the player. */
  patrol() {
    this.speed = this.MIN_SPEED;
    this.isAttacking = false;
    if (this.x <= 2000) this.movingLeft = false;
    if (this.x >= 2500) this.movingLeft = true;
  }

  /** Starts the movement and animation loops. */
  animate() {
    this.movingLeft = true;
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.handleAnimations(), 150);
  }

  /** Picks and plays the correct animation for the boss's current state. */
  handleAnimations() {
    this.playCurrentStateAnimation();
    this.checkForAlertTrigger();
  }

  /** Selects which of the boss's animation sets to play this frame. */
  playCurrentStateAnimation() {
    if (this.isDefeated) return this.playFinalAnimation(this.IMAGES_DEAD);
    if (this.isHurt() || this.hurtFlag) return this.playHurtAnimation();
    if (this.isAttacking) return this.playAnimation(this.IMAGES_ATTACK);
    if (this.isAlert) {
      this.playAnimation(this.IMAGES_ALERT);
      return this.handleAlertAnimation();
    }
    this.playAnimation(this.IMAGES_WALKING);
  }

  /** Plays the hurt animation, and its sound the first time only. */
  playHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
    if (this.hurtFlag) {
      this.world.playSound(this.bossHurtSound, 0.05);
      this.hurtFlag = false;
    }
  }

  /** Advances the alert animation and clears the alert flag once it finishes. */
  handleAlertAnimation() {
    this.alertFrameCounter++;
    if (this.alertFrameCounter >= this.IMAGES_ALERT.length) {
      this.isAlert = false;
      this.alertFrameCounter = 0;
    }
  }

  /** Triggers the boss's one-time "spotted the player" alert the first time it's approached. */
  checkForAlertTrigger() {
    if (this.world.character.x > 1700 && !this.hadFirstContact) {
      this.hadFirstContact = true;
      this.isAlert = true;
      this.alertFrameCounter = 0;
      this.world.playSound(this.bossAlertSound, 0.05);
    }
  }
}