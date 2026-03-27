class DrawableObjekt {
  img;
  x = 100;
  y = 100;
  widht = 100;
  height = 250;
  imageCache = {};

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draws(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.widht, this.height);
  }

  drawsFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof ThrowableObjekts || this instanceof CollectebillObjekts) {
      ctx.beginPath();
      ctx.lineWidth = "1";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.widht, this.height);
      ctx.stroke();
    }
    };

  loadeImages(arry) {
    arry.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}