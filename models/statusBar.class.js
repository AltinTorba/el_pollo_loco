class StatusBar extends DrawableObject {
  IMAGES_HEALTH = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  /** @param {"health"|"coin"|"bottle"|"bossHealth"} type - Which bar this is.
   * @param {number} x - X position on the canvas.
   * @param {number} y - Y position on the canvas.
   * @param {Endboss|null} [endboss=null] - Boss instance, for the boss health bar. */
  constructor(type, x, y, endboss = null) {
    super();
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = type === "bossHealth" ? 300 : 160;
    this.height = 40;
    this.endboss = endboss;
    this.counter = 0;
    this.loadImages(this.IMAGES_HEALTH);
    this.setupBar();
  }

  /** Loads whichever extra assets this bar type needs. */
  setupBar() {
    if (this.type === "bossHealth") this.setupBossHealthBar();
    else if (this.type === "coin" || this.type === "bottle") this.setupCounterBar();
    else this.setPercentage(100);
  }

  /** Loads the boss health bar's icon and empty/filled bar images. */
  setupBossHealthBar() {
    this.icon = this.loadImage("img/7_statusbars/3_icons/icon_health_endboss.png");
    this.barEmpty = this.loadImage("img/7_statusbars/4_bar_elements/statusbar_empty.png");
    this.barGreen = this.loadImage("img/7_statusbars/4_bar_elements/statusbar_green.png");
  }

  /** Loads the coin/bottle counter's icon image. */
  setupCounterBar() {
    this.icon = this.loadImage(
      this.type === "coin" ? "img/8_coin/coin_2.png" : "img/6_salsa_bottle/salsa_bottle.png");
  }

  /** Creates and starts loading an image without the shared image cache.
   * @param {string} src - Path to the image.
   * @returns {HTMLImageElement} The (possibly still loading) image. */
  loadImage(src) {
    let img = new Image();
    img.src = src;
    return img;
  }

  /** Sets the player health bar's fill percentage and picks the matching sprite.
   * @param {number} percentage - Health percentage from 0 to 100. */
  setPercentage(percentage) {
    this.percentage = percentage;
    this.img = this.imageCache[this.IMAGES_HEALTH[this.resolveImageIndex()]];
  }

  /** @returns {number} Index into IMAGES_HEALTH matching the current percentage. */
  resolveImageIndex() {
    if (this.percentage > 80) return 5;
    if (this.percentage > 60) return 4;
    if (this.percentage > 40) return 3;
    if (this.percentage > 20) return 2;
    if (this.percentage > 0) return 1;
    return 0;
  }

  /** Draws this bar according to its type.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context. */
  draw(ctx) {
    if (this.type === "bossHealth" && this.endboss && this.endboss.hadFirstContact) {
      this.drawBossHealthBar(ctx);
    } else if (this.type === "coin" || this.type === "bottle") {
      this.drawCounter(ctx);
    } else if (this.type === "health"){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /** Draws the boss health bar (mirrored so it fills from the right) plus its icon.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context. */
  drawBossHealthBar(ctx) {
    ctx.save();
    ctx.scale(-1, 1);
    let drawX = -this.x - this.width;
    ctx.drawImage(this.barEmpty, drawX, this.y, this.width, this.height);
    this.drawBossHealthGreenBar(ctx, drawX);
    ctx.restore();
    ctx.drawImage(this.icon, this.x + this.width - 30, this.y, 40, 40);
  }

  /** Draws the filled portion of the boss health bar proportional to its energy.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
   * @param {number} drawX - Mirrored x position to draw the bar at. */
  drawBossHealthGreenBar(ctx, drawX) {
    let greenWidth = (this.width * this.endboss.energy) / 18;
    if (greenWidth > 0) ctx.drawImage(this.barGreen, drawX, this.y, greenWidth, this.height);
  }

  /** Draws an icon plus a "x N" counter (used for coins and bottles).
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context. */
  drawCounter(ctx) {
    ctx.drawImage(this.icon, this.x, this.y, 60, 60);
    ctx.fillStyle = "white";
    ctx.font = "30px zabars";
    ctx.fillText("x " + this.counter, this.x + 50, this.y + 40);
  }

  /** Increments the coin/bottle counter by one. */
  increaseCounter() {
    this.counter++;
  }
}