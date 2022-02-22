function init() {
  let playerX = 0;
  let playerY = innerHeight-30;
  game.player = new Player(playerX, playerY);
  //Boulders
  setInterval(() => {
    for (var i = 0; i < 3; i++) {
      game.boulders.push(new Boulder());
    }
    game.score += 1;
  }, game.boulderSpawnRate);
}
