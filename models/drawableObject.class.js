class DrawableObject {
  img;
  x = 120;
  y = 270;
  width = 100;
  height = 150;
  imageCache = {};
  currentImage = 0;

  /** Loads a single image as this object's current sprite.
   * @param {string} path - Path to the image. */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /** Preloads a set of images into the shared image cache, keyed by path.
   * @param {string[]} arr - Image paths to preload. */
  loadImages(arr) {
   arr.forEach((path) => {
     let img = new Image();
     img.src = path;
     this.imageCache[path] = img;
   });
  }

  /** Draws the object's current sprite at its position/size.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context. */
  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (error) {
      console.warn(error);
    }
  }

  /** Debug helper: outlines the object's raw sprite bounds.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context. */
  drawFrame(ctx) {
    if (this instanceof Coin || this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  /** Debug helper: outlines the object's offset-adjusted hitbox.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context. */
  drawOffsetFrame(ctx){
    if (this instanceof Character || this instanceof Endboss || this instanceof Bottle || this instanceof Coin || this instanceof Chicken || this instanceof Chick) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "red";
      ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.right -this.offset.left, this.height - this.offset.top - this.offset.bottom)
      ctx.stroke();
    }
  }
}