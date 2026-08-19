class Level {
  enemies;
  clouds;
  bgObjects;
  coins;
  bottles;
  level_end_x = 2200;

  /** @param {Array} enemies - Enemies present in the level.
   * @param {Cloud[]} clouds - Background clouds.
   * @param {bgObject[]} bgObjects - Parallax background tiles.
   * @param {Coin[]} coins - Collectible coins.
   * @param {Bottle[]} bottles - Collectible bottles. */
  constructor(enemies, clouds, bgObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.bgObjects = bgObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}