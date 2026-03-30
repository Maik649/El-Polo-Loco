/**
 * Level container with enemies, clouds and background layers.
 */
class Level {
  enemies;
  clouds;
  backrounds;
  level_end_x = 1439;
  /**
   * @param {Array} enemies Enemy entities.
   * @param {Array} clouds Cloud entities.
   * @param {Array} backrounds Background layer objects.
   */
  constructor(enemies, clouds, backrounds) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backrounds = backrounds;
  }
}