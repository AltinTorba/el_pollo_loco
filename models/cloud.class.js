class Cloud extends MovableObject {
  height = 324;
  width = 720;
  y = 0;
  x = Math.random() * 2000;
  speed = 0.15 + Math.random() * 0.3;

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.animate();
  }

  animate() {
    setInterval(() => {this.moveLeft()}, 1000 / 60);
  }
}
