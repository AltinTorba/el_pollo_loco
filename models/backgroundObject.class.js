class bgObject extends MovableObject {
  width = 720;
  height = 480;
  y = 0;


  /** @param {string} imagePath */
  /** @param {number} x */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
  }

  /**
   * Draws this tile 1px wider on each side than its logical width. The
   * source images are much larger than the canvas (1920x1080 scaled down
   * to 720x480), and that downscaling leaves a faint seam between two
   * adjacent tiles even though they're positioned edge-to-edge with no
   * gap. Overdrawing slightly makes each tile overlap its neighbor by a
   * pixel, hiding the seam without affecting image quality.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x - 1, this.y, this.width + 2, this.height);
    } catch (error) {
      console.warn(error);
    }
  }
}
