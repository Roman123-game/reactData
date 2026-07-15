import { Container, Sprite, Assets } from "pixi.js";

export class Reel extends Container {
  
  constructor(symbols) {
    super();
    this.symbols = symbols;
    this.rows = 5;
    this.currentSymbols = [];
    this.sprites = [];
    const SYMBOL_HEIGHT = 90;

    for (let i = 0; i < this.rows; i++) {
      const sprite = new Sprite();
      sprite.width = SYMBOL_HEIGHT;
      sprite.height = SYMBOL_HEIGHT;
      sprite.y = i * SYMBOL_HEIGHT;

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
    const SYMBOL_HEIGHT = 90;
    if (!this.spinning) return;

    this.sprites.forEach((sprite) => {
        sprite.y += this.speed * delta;
        

        if (sprite.y >= SYMBOL_HEIGHT * this.rows) {
            sprite.y -= SYMBOL_HEIGHT * this.rows;
        }
    });
}
}