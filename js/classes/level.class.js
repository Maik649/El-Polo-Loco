class Level {
  enemies;
  clouds;
  backrounds;
  level_end_x = 1439;
  constructor(enemies, clouds, backrounds) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backrounds = backrounds;
  }
}