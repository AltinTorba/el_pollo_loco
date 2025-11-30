class Coin extends MovableObject {
    height = 100;
    width = 100;
    y = 100 + Math.random() * 200;

    IMAGES_COIN = [
        "img/8_coin/coin_1.png",
        "img/8_coin/coin_2.png"
    ];

    constructor() {
        super().loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.x = 300 + Math.random() * 2000;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 500);
    }
}