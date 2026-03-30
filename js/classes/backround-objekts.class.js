/**
 * Represents a static background tile in the level.
 * The object uses world coordinates and is rendered by the world draw pipeline.
 */
class BackroundObjekt extends MovableObject {
  x;
  y;
  widht = 720;
  height = 480;
  /**
   * @param {string} imagePath Path to the background texture.
   * @param {number} x Horizontal world position.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 -this.height;
  }
}
