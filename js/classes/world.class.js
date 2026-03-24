class World {
  character = new Character();
  level = level_1;
  canvas;
  ctx;
  kayboard;
  camara_x = 0;
  statusBarCoins = new StatusBar("coins", 20, 20);
  statusBarHealt = new StatusBar("health", 20, 60);

  constructor(canvas, kayboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.kayboard = kayboard;
    this.draw();
    this.setWorld();
    this.checkCollisons();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camara_x, 0);
    this.addObjekts(this.level.backrounds);
    this.addObjekts(this.level.clouds);
    this.addObjekts(this.level.enemies);
    this.addToMap(this.character);
    this.ctx.translate(-this.camara_x, 0);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarHealt);

    let self = this;
    requestAnimationFrame(() => {
      self.draw();
    });
  }

  setWorld() {
    this.character.world = this;
  }

  checkCollisons() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          this.character.hit();
          this.statusBarHealt.setPercentage(this.character.energy);
        }
      });
    }, 500);
  }

  addObjekts(objekts) {
    objekts.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draws(this.ctx);
    mo.drawsFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.widht, 0, mo.x, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
