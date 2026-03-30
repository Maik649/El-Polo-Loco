/**
 * Base drawable object.
 * Provides image loading, frame drawing and image cache handling.
 */
class DrawableObjekt {
  img;
  x = 100;
  y = 100;
  widht = 100;
  height = 100;
  imageCache = {};

  /**
   * Loads a single image into this instance.
   * @param {string} path Image path.
   * @returns {void}
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  };

  /**
   * Draws the current sprite to the given rendering context.
   * @param {CanvasRenderingContext2D} ctx Canvas context.
   * @returns {void}
   */
  draws(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.widht, this.height);
    } catch (e) {
      console.warn('Error loading image', e);
      console.log('Cloud not loading image', this.img);
    }
  };

  /**
   * Draws debug frames for selected game entities.
   * @param {CanvasRenderingContext2D} ctx Canvas context.
   * @returns {void}
   */
  drawsFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof ChickenSmall|| this instanceof Endboss || this instanceof ThrowableObjekts || this instanceof CollectebillObjekts) {
      ctx.beginPath();
      ctx.lineWidth = "1";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.widht, this.height);
      ctx.stroke();
    }
    };

  /**
   * Preloads a list of image paths into the internal cache.
   * @param {string[]} arry Array of image paths.
   * @returns {void}
   */
  loadeImages(arry) {
    arry.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  };
}