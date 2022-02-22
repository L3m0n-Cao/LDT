// KeyBoard Event Listener
addEventListener("keydown", (e) => {
  game.key = e.keyCode;
});
addEventListener("keyup", (e) => {
  game.key = undefined;
  game.keyPressed = undefined;
});
addEventListener("keypress", (e) => {
  game.keyPressed = e.keyCode;
});
addEventListener("resize", () => {
  canvas.width = innerWidth
  canvas.height = innerHeight
})
