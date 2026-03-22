class MovableObject {
  x = 780;
  y = 200;
  img;
  imageCache = {};
  currentImage = 0;
  speed = 0.015;
  speedY = 0;
  acceleratio = 1;
  otherDirection = false;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  moveRight() {
    this.x += this.speed;
  }

  jump() {
    this.y = this.speedY = 10;
  }

  applayGravity() {
    setInterval(() => {
      if (this.isAboveGound()) {
        this.y -= this.speedY;
        this.speedY -= this.acceleratio;
      }
    }, 1000 / 25);
  }

  isAboveGound() {
    return this.y < 180;
  }

  loadeImages(arry) {
    arry.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  playAnimation(Images) {
    let i = this.currentImage % this.WORKIMAGE.length;
    let path = Images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  playAnimationIdel(Images) {
    let i = this.currentImage % this.IDELIMAGE.length;
    let path = Images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  // animation() {
  //   setInterval(() => {
  //     //  this.x -= Math.random(200);
  //   }, 100);
  // }
}
