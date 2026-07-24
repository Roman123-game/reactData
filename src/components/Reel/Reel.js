import { Container, Sprite, Texture, Graphics } from "pixi.js";

export class Reel extends Container {
  constructor(symbols) {
    super();
    this.availableSymbols = symbols;
    this.rows = 3;
    this.symbolHeight = 120;
    this.sprites = [];
    this.currentSymbols = [];
    this.spinning = false;
    this.speed = 0;

    for (let i = 0; i < this.rows; i++) {
      const symbol = this.randomSymbol();
      const sprite = new Sprite(Texture.from(symbol.texture));
      sprite.width = 120;
      sprite.height = 120;
      sprite.y = i * this.symbolHeight;
      this.addChild(sprite);
      this.sprites.push(sprite);
      this.currentSymbols.push(symbol);
    }

    // Window mask
    const mask = new Graphics();
    mask.rect(0, 0, 120, 360);
    mask.fill(0xffffff);
    this.addChild(mask);
    this.mask = mask;
  }

  randomSymbol() {
    return this.availableSymbols[
      Math.floor(Math.random() * this.availableSymbols.length)
    ];
  }

  start() {this.spinning = true; this.speed = 40;}
  stop() {this.spinning = false;this.speed = 0;

    // Force perfect alignment
    this.sprites.forEach((sprite, index) => {
      sprite.y = index * this.symbolHeight;
    });

    this.currentSymbols = this.sprites.map((sprite) => {
      const symbol = this.randomSymbol();
      sprite.texture = Texture.from(symbol.texture);
      return symbol;
    });
  }

  update(delta) {
    if (!this.spinning) return;
    this.sprites.forEach((sprite) => {
      sprite.y += this.speed * delta;
      if (sprite.y >= this.symbolHeight * this.rows) {
        sprite.y -= this.symbolHeight * this.rows;
        const symbol = this.randomSymbol();
        sprite.texture = Texture.from(symbol.texture);
      }
    });
  }
}
