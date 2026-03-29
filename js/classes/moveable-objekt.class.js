class MovableObject extends DrawableObjekt {
  x = 780;
  y = 200;
  currentImage = 0;
  speed = 0.015;
  speedY = 0;
  acceleratio = 1;
  otherDirection = false;
  energy = 100;
  lastHit = 0;
  playAnimation(Images) {
    let i = this.currentImage % Images.length;
    let path = Images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  isWork() {
    if (this.world.kayboard.LEFT && this.x > 100) {
      this.moveLeft();
      this.otherDirection = true;
      this.workingAudio.play();
    }

    if (this.world.kayboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.workingAudio.play();
    }
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

  hit() {
    // sound einfügen
    this.energy -= 5;
   
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isDead() {
    return this.energy == 0;
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  applayGravity() {
    setInterval(() => {
      if (this.isAboveGound() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleratio;
      }
    }, 1000 / 25);
  }

  isAboveGound() {
    if (this instanceof ThrowableObjekts) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  playAnimationIdel(Images) {
    let i = this.currentImage % this.IDELIMAGE.length;
    let path = Images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  isColliding(mo) {
    return (
      this.x + this.widht > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x &&
      this.y < mo.y + mo.height
    );
  }
}
