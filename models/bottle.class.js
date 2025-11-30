class Bottle extends MovableObject {
    height = 80;
    width = 80;
    y = 350;

    IMAGES_BOOTLE = [
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
    ];

    constructor() {
        super().loadImage(this.IMAGES_BOOTLE[0]);
        this.loadImages(this.IMAGES_BOOTLE);
        this.x = 300 + Math.random() * 2000;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOOTLE);
        }, 500);
    }
}