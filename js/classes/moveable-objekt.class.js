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
  energy = 100;
  lastHit = 0;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

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
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0 
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

  playAnimationIdel(Images) {
    let i = this.currentImage % this.IDELIMAGE.length;
    let path = Images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  draws(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.widht, this.height);
  }

  drawsFrame(ctx) {
    if (
      this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = "1";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.widht, this.height);
      ctx.stroke();
    }
  }

  isColliding(mo) {
    return this.x + this.widht > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x &&
      this.y < mo.y + mo.height;
  }

  

  // animation() {
  //   setInterval(() => {
  //     //  this.x -= Math.random(200);
  //   }, 100);
  // }
}
