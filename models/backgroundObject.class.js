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
}
