import { Container, Graphics, Text, TextStyle } from "pixi.js";

import { Reel } from "./Reel";

export class SlotMachine extends Container {
  constructor(app, symbols) {
    super();
    this.app = app;
    this.credits = 100;
    this.reels = [];
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

    this.creditText.y = 400;
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
    button.y = 460;
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
      setTimeout(
        () => {
          reel.stop();
          if (index === 4) {this.checkWin();}
        },
        1200 + index * 400,
      );
    });
  }

  checkWin() {

    const result = this.reels.map((reel) => reel.currentSymbols);

    // middle row example

    const middle = result.map((reel) => reel[1]);

    if (middle.every((value) => value === middle[0])) {
      this.credits += 100;
      this.creditText.text = `🎉 JACKPOT ${this.credits}`;
    }
  }
}
