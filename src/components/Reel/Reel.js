import { Container, Sprite, Assets } from "pixi.js";

export class Reel extends Container {
  constructor(symbols) {
    super();
    this.symbols = symbols;
    this.rows = 3;
    this.currentSymbols = [];
    this.sprites = [];

    for (let i = 0; i < this.rows; i++) {
      const sprite = new Sprite();
      sprite.width = 90;
      sprite.height = 90;
      sprite.y = i * 95;
      this.addChild(sprite);
      this.sprites.push(sprite);
    }

    this.spinning = false;
    this.speed = 0;
    this.randomize();
  }

  randomize() {
    this.currentSymbols = [];
    this.sprites.forEach((sprite) => {
      const index = Math.floor(Math.random() * this.symbols.length);
      this.currentSymbols.push(index);
      sprite.texture = Assets.get(this.symbols[index]);
    });
  }

  start() {
    this.spinning = true;
    this.speed = 50;
  }

  stop() {
    this.spinning = false;
    this.speed = 0;
    this.randomize();
  }

  update(delta) {
    if (!this.spinning) return;

    this.sprites.forEach((sprite) => {
      sprite.y += this.speed * delta;

      if (sprite.y > 285) {
        sprite.y = -95;
        this.randomize();
      }
    });
  }
}
