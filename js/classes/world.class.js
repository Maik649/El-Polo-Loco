class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];

  clouds = [
    new Cloud("../assets/img/5_background/layers/4_clouds/1.png",),
    new Cloud("../assets/img/5_background/layers/4_clouds/2.png", 50, 80)
  ]
  backrounds = [
    new BackroundObjekt("../assets/img/5_background/layers/air.png", 0),
    new BackroundObjekt("../assets/img/5_background/layers/3_third_layer/1.png",0),
    new BackroundObjekt( "../assets/img/5_background/layers/3_third_layer/2.png",0),
    new BackroundObjekt("../assets/img/5_background/layers/2_second_layer/1.png",0),
    new BackroundObjekt( "../assets/img/5_background/layers/2_second_layer/2.png",0),
    new BackroundObjekt("../assets/img/5_background/layers/1_first_layer/1.png",0),
    new BackroundObjekt("../assets/img/5_background/layers/1_first_layer/2.png",0),
  ];
  canvas;
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.addObjekts(this.backrounds);
    this.addToMap(this.character);
    this.addObjekts(this.clouds);
    this.addObjekts(this.enemies);

    let self = this;
    requestAnimationFrame(() => {
      self.draw();
    });
  }
  addObjekts(objekts) {
    objekts.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.widht, mo.height);
  }
}
