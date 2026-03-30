/**
 * Collectible object used for both bottles and coins.
 */
class CollectebillObjekts extends MovableObject {
  /**
   * @param {number} x Horizontal world position.
   * @param {number} y Vertical world position.
   * @param {"bottle"|"coin"} [type="bottle"] Collectible type.
   */
  constructor(x, y, type = "bottle") {
    super();
    this.type = type;
    this.x = x;
    this.y = y;

    if (this.type === "coin") {
      this.loadImage("./assets/img/8_coin/coin_1.png");
      this.widht = 65;
      this.height = 65;
      this.offset = { top: 40, bottom: 40, left: 40, right: 40 };
    } else {
      this.loadImage("./assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png");
      this.widht = 60;
      this.height = 80;
      this.offset = { top: 10, bottom: 5, left: 10, right: 10 };
    }
  }
}