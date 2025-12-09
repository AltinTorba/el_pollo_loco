class Level {
  enemies;
  clouds;
  bgObjects;
  coins;
  bottles;
  level_end_x = 2200;

  constructor(enemies, clouds, bgObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.bgObjects = bgObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}