class DrawableObject {
  img;
  x = 120;
  y = 270;
  width = 100;
  height = 150;
  imageCache = {};
  currentImage = 0;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
   arr.forEach((path) => {
     let img = new Image();
     img.src = path;
     this.imageCache[path] = img;
   });
  }

  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (error) {
      console.warn(error);
      console.log(this.img);
    }
  }

  drawFrame(ctx) {
    if (this instanceof Coin || this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

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