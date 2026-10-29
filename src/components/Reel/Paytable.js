import { Circle, Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
export class Paytable extends Container {
  constructor(symbols) {
    super();
    this.visible = false;
    this.eventMode = "static";
    
    const panel = new Graphics()
      .roundRect(40,-40, 520, 720, 20)
      .fill(0x222222)
      .stroke({
        width: 4,
        color: 0xffd700
      });
    this.addChild(panel);
    // =========================
    // Title
    // =========================
    const title = new Text({
      text: "Reward",
      style: new TextStyle({
        fill: 0xffd700,
        fontSize: 22,
        fontWeight: "bold"
      })
    });
    title.anchor.set(0.5);
    title.x = 300;
    title.y = 0;
    this.addChild(title);
    // =========================
    // Symbols - TWO COLUMNS
    // =========================
    const positions = [
      {
        x: 100,
        y: -40
      },
      {
        x: 430,
        y: -40
      }
    ];
    symbols.forEach((symbol,index)=>{
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = positions[column].x ;
      const y = positions[column].y + row * 60;
      // =====================
      // IMAGE
      // =====================
      const image = new Sprite(symbol.texture);
      image.width = 65;
      image.height = 65;
      image.x = x;
      image.y = y;
      this.addChild(image);
      // =====================
      // NAME
      // =====================
      const name = new Text({
        text: symbol.name.toUpperCase(),
        style: new TextStyle({
          fill: 0xffffff,
          fontSize: 12,
          fontWeight: "bold"
        })
      });
      name.anchor.set(0.5,0);
      name.x = x + 32;
      name.y = y + 70;
      this.addChild(name);
      // =====================
      // PAYOUTS
      // =====================
      const payout = new Text({
        text:
`3X   ${symbol.payout}
4X   ${symbol.payout * 3}
5X   ${symbol.payout * 8}`,
        style: new TextStyle({
          fill: 0xffffff,
          fontSize: 14,
          lineHeight: 15
        })
      });
      payout.x = x;
      payout.y = y + 80;
      this.addChild(payout);
    });
    const rules = new Text({
      text:
`⭐ WILD
Substitutes normal symbols
🎁 SCATTER
3 = 1 FREE SPINS
4 = 5 FREE SPINS
5 = 10 FREE SPINS
WINS PAY LEFT → RIGHT`,
      style: new TextStyle({
        fill: 0xffff99,
        fontSize: 15,
        lineHeight: 22
      })
    });
    rules.x = 200;
    rules.y = 460;
    this.addChild(rules);
    // =========================
    // Close Button
    // =========================
    const close = new Graphics();
    close.x = 262;
    close.y = 610;
    close.eventMode = "static";
    close.cursor = "pointer";
    close.hitArea = new Circle(38, 46, 38);
    const closeText = new Text({
      text: "CLOSE",
      style: new TextStyle({
        fill: 0xffffff,
        fontFamily: "Arial",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 1,
        dropShadow: { color: 0x07121b, blur: 2, distance: 1, alpha: 0.8 },
      }),
    });
    closeText.anchor.set(0.5);
    closeText.x = 38;
    closeText.y = 38;
    const drawCloseButton = (state) => {
      const offset = state === "pressed" ? 5 : 0;
      close.clear();
      close.circle(38, 46, 38)
        .fill({ color: 0x050a12, alpha: 0.72 });
      close.circle(38, 42 + offset, 36)
        .fill(0x111d2a)
        .stroke({ width: 2, color: 0xf36a72, alpha: 0.9 });
      close.circle(38, 38 + offset, 30)
        .fill(state === "hover" ? 0xc34655 : 0x9d3542)
        .stroke({ width: 1, color: 0xffffff, alpha: 0.3 });
      closeText.y = 38 + offset;
    };
    drawCloseButton("idle");
    close.addChild(closeText);
    close.on("pointerover", () => drawCloseButton("hover"));
    close.on("pointerout", () => drawCloseButton("idle"));
    close.on("pointerdown", () => {
      drawCloseButton("pressed");
      this.visible = false;
    });
    close.on("pointerup", () => drawCloseButton("hover"));
    close.on("pointerupoutside", () => drawCloseButton("idle"));
    this.addChild(close);
  }
  toggle(){ this.visible = !this.visible};
}