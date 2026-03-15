class MovableObject {
  x = 780;
  y = 200;
  img;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {
    console.log("Moving Right");
  }

  moveLeft() {
    console.log("Moving Left");
  }

  animation() {
    setInterval(() => {
      this.x -= Math.random(200);
    }, 30);
    clearInterval();
  }
}
