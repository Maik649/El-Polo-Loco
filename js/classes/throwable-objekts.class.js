class ThrowableObjekts extends MovableObject {
  constructor(x, y, otherDirection) {
    super().loadImage("./assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",);
    this.widht = 60;
    this.height = 80;
    this.trow(x, y, otherDirection);
  }

  trow(x, y, otherDirection) {
    this.x = x;
    this.y = y;
    this.speedY = 30;
    this.otherDirection = otherDirection;
    this.applayGravity();

    setInterval(() => {
      this.y += 5;
      this.x += this.otherDirection ? -5 : 5;
    }, 25);
  }
}