class Bottle extends MovableObject {
  width = 80;
  height = 80;
  counter = 0;
  x = 200 + Math.random() * 2000;
  y = 355;
  offset = {top: 15, left: 45, right: 35, bottom: 10};

  constructor() {
    super().loadImage("img/6_salsa_bottle/2_salsa_bottle_on_ground.png");
  }
}
