import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";

export class Paytable extends Container {
  constructor(symbols) {
    super();

    this.visible = false;
    this.eventMode = "static";

    // Dark overlay
    const overlay = new Graphics()
      .rect(0, 0, 600, 800)
      .fill({ color: 0x000000, alpha: 0.7 });

    overlay.on("pointerdown", () => {});

    this.addChild(overlay);

    // Main panel
    const panel = new Graphics()
      .roundRect(40, 40, 520, 700, 20)
      .fill(0x222222)
      .stroke({
        width: 4,
        color: 0xffd700,
      });

    this.addChild(panel);

    // Title
    const title = new Text({
      text: "PAYTABLE",
      style: new TextStyle({
        fontSize: 36,
        fill: 0xffd700,
        fontWeight: "bold",
      }),
    });

    title.anchor.set(0.5, 0);

    title.x = 300;
    title.y = 60;

    this.addChild(title);

    let y = 130;

    symbols.forEach((symbol) => {
      const sprite = new Sprite(symbol.texture);

      sprite.width = 55;
      sprite.height = 55;
      sprite.x = 70;
      sprite.y = y;

      this.addChild(sprite);

      const info = new Text({
        text: `${symbol.name}
3x = ${symbol.payout}
4x = ${symbol.payout * 3}
5x = ${symbol.payout * 8}`,
        style: new TextStyle({
          fill: "white",
          fontSize: 22,
        }),
      });

      info.x = 145;
      info.y = y - 5;

      this.addChild(info);

      y += 95;
    });

    // Rules
    const rules = new Text({
      text: `⭐ Wild
Substitutes for every normal symbol.

🎁 Scatter
3 = 10 Free Spins
4 = 15 Free Spins
5 = 20 Free Spins

Wins pay LEFT → RIGHT.`,
      style: new TextStyle({
        fill: 0xffff99,
        fontSize: 20,
      }),
    });

    rules.x = 70;
    rules.y = 560;

    this.addChild(rules);

    // Close button
    const close = new Graphics().roundRect(0, 0, 170, 55, 12).fill(0xaa2222);

    close.x = 215;
    close.y = 665;

    close.eventMode = "static";
    close.cursor = "pointer";

    const closeText = new Text({
      text: "CLOSE",
      style: {
        fill: "white",
        fontSize: 24,
      },
    });

    closeText.anchor.set(0.5);

    closeText.x = 85;
    closeText.y = 27;

    close.addChild(closeText);

    close.on("pointerdown", () => {
      this.visible = false;
    });

    this.addChild(close);
  }

  toggle() {
    this.visible = !this.visible;
  }
}
