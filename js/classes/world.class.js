class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];

  clouds = [new Cloud("./assets/img/5_background/layers/4_clouds/1.png",), new Cloud("./assets/img/5_background/layers/4_clouds/1.png"), new Cloud("./assets/img/5_background/layers/4_clouds/2.png")];
  backrounds = [
    new BackroundObjekt("./assets/img/5_background/layers/air.png",0 ),
    new BackroundObjekt("./assets/img/5_background/layers/air.png", 719),
    new BackroundObjekt("./assets/img/5_background/layers/3_third_layer/1.png",0),
    new BackroundObjekt("./assets/img/5_background/layers/3_third_layer/1.png", 719),
    new BackroundObjekt("./assets/img/5_background/layers/3_third_layer/2.png",0),
    new BackroundObjekt("./assets/img/5_background/layers/3_third_layer/2.png",719),
    new BackroundObjekt("./assets/img/5_background/layers/2_second_layer/1.png", 0),
    new BackroundObjekt("./assets/img/5_background/layers/2_second_layer/1.png",719),
    new BackroundObjekt("./assets/img/5_background/layers/2_second_layer/2.png", 0),
    new BackroundObjekt("./assets/img/5_background/layers/2_second_layer/2.png",720),
    new BackroundObjekt("./assets/img/5_background/layers/1_first_layer/1.png", 0),
    new BackroundObjekt("./assets/img/5_background/layers/1_first_layer/1.png",719),
    new BackroundObjekt("./assets/img/5_background/layers/1_first_layer/2.png", 0),
    new BackroundObjekt("./assets/img/5_background/layers/1_first_layer/2.png", 720),
  ];
  canvas;
  ctx;
  kayboard;
  camara_x = -0;

  
  constructor(canvas, kayboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.kayboard = kayboard;
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camara_x, 0);
    this.addObjekts(this.backrounds);
    this.addToMap(this.character);
    this.addObjekts(this.clouds);
    this.addObjekts(this.enemies);
    this.ctx.translate(-this.camara_x,0);
    this.setWorld();

    let self = this;
    requestAnimationFrame(() => {
      self.draw();
    });
  }

  setWorld() {
    this.character.world = this;
  
  }

  addObjekts(objekts) {
    objekts.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.ctx.save();
      this.ctx.translate(mo.widht, 0, mo.x, 0);
      this.ctx.scale(-1, 1);
      mo.x = mo.x * -1;
    }

    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.widht, mo.height);

    if (mo.otherDirection) {
      mo.x = mo.x * -1;
       this.ctx.restore();
    }
  }
}
