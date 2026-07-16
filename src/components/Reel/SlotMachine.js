import { Container, Graphics, Text, TextStyle } from "pixi.js";

import { Reel } from "./Reel";

export class SlotMachine extends Container {
  constructor(app, symbols) {
    super();
    this.app = app;
    this.credits = 100;
    this.reels = [];
    this.paylines = [
      // Straight
      [0, 0, 0, 0, 0], // Top
      [1, 1, 1, 1, 1], // Middle
      [2, 2, 2, 2, 2], // Bottom

      // Diagonals
      [0, 1, 2, 1, 0],
      [2, 1, 0, 1, 2],

      // V shape
      [1, 0, 0, 0, 1],
      [1, 2, 2, 2, 1],

      // Zig-zag
      [0, 1, 0, 1, 0],
      [2, 1, 2, 1, 2],
    ];
    // 5 reels
    for (let i = 0; i < 5; i++) {
      const reel = new Reel(symbols);
      reel.x = i * 120;
      this.addChild(reel);
      this.reels.push(reel);
    }

    this.x = app.screen.width / 2 - 300;
    this.y = 80;
    this.creditText = new Text({
      text: `Credits: ${this.credits}`,
      style: new TextStyle({
        fill: "white",
        fontSize: 28,
      }),
    });

    this.creditText.y = 520;
    this.addChild(this.creditText);
    this.createButton();
    app.ticker.add((ticker) => {
      this.reels.forEach((reel) => reel.update(ticker.deltaTime));
    });
  }

  createButton() {
    const button = new Graphics();
    button.roundRect(0, 0, 200, 60, 15);
    button.fill(0x22aa55);
    button.y = 560;
    button.eventMode = "static";
    button.cursor = "pointer";
    const text = new Text({
      text: "SPIN",
      style: {
        fill: "white",
        fontSize: 30,
      },
    });
    text.anchor.set(0.5);
    text.x = 100;
    text.y = 30;
    button.addChild(text);
    button.on("pointerdown", () => this.spin());
    this.addChild(button);
  }

  spin() {
    this.credits--;
    this.creditText.text = `Credits: ${this.credits}`;
    this.reels.forEach((reel, index) => {
      reel.start();
      setTimeout(() => {
        reel.stop();
        if (index === 4) {
          this.checkWin();
        }
      }, 1200 + index * 400);
    });
  }

  checkWin() {
    let totalWin = 0;

    for (const payline of this.paylines) {
      const line = payline.map((row, reelIndex) => {
        return this.reels[reelIndex].currentSymbols[row];
      });

      const payout = this.checkPayline(line);

      totalWin += payout;
    }

    if (totalWin > 0) {
      this.credits += totalWin;

      this.creditText.text = `🎉 WIN +${totalWin}   Credits: ${this.credits}`;
    } else {
      this.creditText.text = `Credits: ${this.credits}`;
    }

    this.updateFreeSpinText();
  }

  checkPayline(line) {
    // Scatters never count on paylines
    const symbols = line.filter((symbol) => symbol.type !== "scatter");

    if (symbols.length === 0) return 0;

    const base = symbols.find((symbol) => symbol.type !== "wild");

    // All wild
    if (!base) return 500;

    let count = 0;

    for (const symbol of symbols) {
      if (symbol.type === "wild" || symbol.name === base.name) {
        count++;
      } else {
        break;
      }
    }

    // Need at least 3 consecutive from left
    if (count < 3) return 0;

    switch (count) {
      case 3:
        return base.payout;

      case 4:
        return base.payout * 3;

      case 5:
        return base.payout * 8;

      default:
        return 0;
    }
  }
}
