import { Container, Sprite, Texture } from "pixi.js";
export class Reel extends Container {
  constructor(symbols) {
    super();
    this.symbols = [];
    this.speed = 0;
    this.spinning = false;

    for (let i = 0; i < 4; i++) {
      const texture = Texture.from(
        symbols[Math.floor(Math.random() * symbols.length)],
      );
      const sprite = new Sprite(texture);
      sprite.width = 120;
      sprite.height = 120;
      sprite.y = i * 120;
      this.addChild(sprite);
      this.symbols.push(sprite);
    }
    this.availableSymbols = symbols;
  }
  update(delta) {
    if (!this.spinning) return;

    this.symbols.forEach((sprite) => {
      sprite.y += this.speed * delta;
      
      if (sprite.y >= 480) {
        sprite.y -= 480;
        sprite.texture = Texture.from(
          this.availableSymbols[
            Math.floor(Math.random() * this.availableSymbols.length)
          ],
        );
      }
    });
  }
  stop() {
    this.spinning = false;
    this.symbols.sort((a, b) => a.y - b.y);
    this.symbols.forEach((sprite, i) => {
      sprite.y = i * 120;
    });
  }
}
