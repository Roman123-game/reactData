import { BlurFilter, Container, Sprite, Texture, Graphics } from "pixi.js";

export class Reel extends Container {
  constructor(symbols) {
    super();
    this.availableSymbols = symbols;
    this.rows = 4;
    this.visibleRows = 3;
    this.symbolHeight = 120;
    this.sprites = [];
    this.spriteSymbols = [];
    this.slotBorders = [];
    this.currentSymbols = [];
    this.spinning = false;
    this.speed = 0;
    this.stopping = null;
    this.stopPromise = null;
    this.blur = new BlurFilter();
    this.blur.blurX = 0;
    this.blur.blurY = 0;

    for (let i = 0; i < this.rows; i++) {
      const symbol = this.randomSymbol();
      const sprite = new Sprite(Texture.from(symbol.texture));
      sprite.width = 120;
      sprite.height = 120;
      sprite.y = (i - 1) * this.symbolHeight;
      this.addChild(sprite);
      this.sprites.push(sprite);
      this.spriteSymbols.push(symbol);

      const slotBorder = new Graphics();
      slotBorder.roundRect(2, 2, 116, 116, 8)
        .stroke({ width: 2, color: 0x34d6c5, alpha: 0.7 });
      slotBorder.y = sprite.y;
      this.addChild(slotBorder);
      this.slotBorders.push(slotBorder);
    }
    this.currentSymbols = this.spriteSymbols.slice(1);

    // Window mask
    const mask = new Graphics();
    mask.rect(0, 0, 120, this.visibleRows * this.symbolHeight);
    mask.fill(0xffffff);
    this.addChild(mask);
    this.mask = mask;
  }

  randomSymbol() {
    return this.availableSymbols[
      Math.floor(Math.random() * this.availableSymbols.length)
    ];
  }

  start() {
    this.spinning = true;
    this.speed = 40;
    this.filters = [this.blur];
  }

  stop() {
    if (!this.spinning) return Promise.resolve();
    if (this.stopping) return this.stopPromise;

    const phase = ((this.sprites[0].y % this.symbolHeight) + this.symbolHeight)
      % this.symbolHeight;
    const stopDistance =
      this.symbolHeight * 6 + ((this.symbolHeight - phase) % this.symbolHeight);
    const duration = (2 * stopDistance) / this.speed;

    this.stopPromise = new Promise((resolve) => {
      this.stopping = {
        elapsed: 0,
        duration,
        distance: stopDistance,
        resolve,
      };
    });
    return this.stopPromise;
  }

  update(delta) {
    if (!this.spinning) return;

    let movement = this.speed * delta;
    if (this.stopping) {
      const stop = this.stopping;
      const previousProgress = stop.elapsed / stop.duration;
      stop.elapsed = Math.min(stop.elapsed + delta, stop.duration);
      const progress = stop.elapsed / stop.duration;
      const previousDistance = stop.distance * (2 * previousProgress - previousProgress ** 2);
      const currentDistance = stop.distance * (2 * progress - progress ** 2);
      movement = currentDistance - previousDistance;
    }
    this.blur.blurY = Math.min(
      (movement / Math.max(delta, 0.001)) * 0.2,
      20,
    );

    const cycleLength = this.symbolHeight * this.rows;
    const wrapPosition = this.symbolHeight * this.visibleRows;
    this.sprites.forEach((sprite, index) => {
      sprite.y += movement;
      if (sprite.y >= wrapPosition) {
        sprite.y -= cycleLength;
        if (!this.stopping) {
          const symbol = this.randomSymbol();
          sprite.texture = Texture.from(symbol.texture);
          this.spriteSymbols[index] = symbol;
        }
      }
      this.slotBorders[index].y = sprite.y;
    });

    if (this.stopping && this.stopping.elapsed >= this.stopping.duration) {
      const stop = this.stopping;
      this.currentSymbols = Array(this.visibleRows);
      this.sprites.forEach((sprite, index) => {
        const alignedY = Math.round(sprite.y / this.symbolHeight) * this.symbolHeight;
        if (Math.abs(sprite.y - alignedY) < 0.001) {
          sprite.y = alignedY;
          this.slotBorders[index].y = alignedY;
        }

        const row = Math.round(sprite.y / this.symbolHeight);
        if (row >= 0 && row < this.visibleRows) {
          this.currentSymbols[row] = this.spriteSymbols[index];
        }
      });

      this.spinning = false;
      this.speed = 0;
      this.blur.blurY = 0;
      this.filters = null;
      this.stopping = null;
      this.stopPromise = null;
      stop.resolve();
    }
  }
}
