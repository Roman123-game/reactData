import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { Reel } from "./Reel";
import { Paytable } from "./Paytable";
export class SlotMachine extends Container {
  constructor(app, symbols) {
    super();
    this.app = app;
    this.symbols = symbols;
    this.credits = 100;
    this.isSpinning = false;
    this.reels = [];
    this.paylines = [
      // Straight lines
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2],
      // Diagonal
      [0, 1, 2, 1, 0],
      [2, 1, 0, 1, 2],
      // Zig zag
      [0, 0, 1, 0, 0],
      [2, 2, 1, 2, 2],
      [1, 0, 1, 0, 1],
      [1, 2, 1, 2, 1],
    ];
    // Create reels
    for (let i = 0; i < 5; i++) {
      const reel = new Reel(symbols);
      reel.x = i * 120;
      this.addChild(reel);
      this.reels.push(reel);
    }
    // Winning lines layer
    this.winLines = new Graphics();
    this.addChild(this.winLines);
    this.x = (app.screen.width - 600) / 2;
    this.y = 80;
    // Frame
    const frame = new Graphics();
    frame.rect(-10, -10, 620, 380);
    frame.stroke({
      width: 5,
      color: 0xffd700,
    });
    this.addChildAt(frame, 0);
    // Credits
    this.creditText = new Text({
      text: `Credits: ${this.credits}`,
      style: new TextStyle({
        fill: "white",
        fontSize: 28,
      }),
    });
    this.creditText.y = 420;
    this.addChild(this.creditText);
    this.createSpinButton();
    this.createPaytableButton();
    this.paytable = new Paytable(symbols);
    this.addChild(this.paytable);
    // Update reels
    app.ticker.add((ticker) => {
      this.reels.forEach((reel) => {
        reel.update(ticker.deltaTime);
      });
    });
  }
  createSpinButton() {
    const button = new Graphics();
    button.roundRect(0, 0, 200, 60, 15);
    button.fill(0x22aa55);
    button.y = 480;
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
  createPaytableButton() {
    const button = new Graphics();
    button.roundRect(220, 0, 200, 60, 15);
    button.fill(0x3366cc);
    button.y = 480;
    button.eventMode = "static";
    button.cursor = "pointer";
    const text = new Text({
      text: "PAYTABLE",
      style: {
        fill: "white",
        fontSize: 22,
      },
    });
    text.anchor.set(0.5);
    text.x = 320;
    text.y = 30;
    button.addChild(text);
    button.on("pointerdown", () => {
      this.paytable.toggle();
    });
    this.addChild(button);
  }
  spin() {
    if (this.isSpinning) return;
    if (this.credits <= 0) return;
    this.winLines.clear();
    this.isSpinning = true;
    this.credits--;
    this.creditText.text = `Credits: ${this.credits}`;
    this.reels.forEach((reel, index) => {
      reel.start();
      setTimeout(
        () => {
          reel.stop();
          if (index === 4) {
            setTimeout(() => {
              this.checkWin();
              this.isSpinning = false;
            }, 200);
          }
        },
        1200 + index * 300,
      );
    });
  }
  checkWin() {
    let win = 0;
    this.winLines.clear();
    for (const line of this.paylines) {
      const symbols = line.map(
        (row, index) => this.reels[index].currentSymbols[row],
      );
      const payout = this.checkLine(symbols);
      if (payout > 0) {
        win += payout;
        this.drawWinLine(line);
      }
    }
    if (win > 0) {
      this.credits += win;
      this.creditText.text = `WIN +${win} Credits:${this.credits}`;
    }
  }
  checkLine(line) {
    const first = line[0];
    let count = 1;
    for (let i = 1; i < line.length; i++) {
      if (line[i].name === first.name || line[i].type === "wild") {
        count++;
      } else {
        break;
      }
    }
    if (count < 3) return 0;
    return first.payout * count;
  }
  drawWinLine(line) {
    const reelWidth = 120;
    const cellHeight = 120;
    this.winLines.moveTo(45, line[0] * cellHeight + 60);
    for (let i = 1; i < line.length; i++) {
      this.winLines.lineTo(i * reelWidth + 60, line[i] * cellHeight + 60);
    }
    this.winLines.stroke({
      width: 8,
      color: 0xff0000,
      alpha: 0.9,
    });
    // highlight circles
    for (let i = 0; i < line.length; i++) {
      this.winLines.circle(
        i * reelWidth + 60,
        line[i] * cellHeight + 60,
        35,
      );
      this.winLines.stroke({
        width: 4,
        color: 0xffff00,
        alpha: 1,
      });
    }
  }
}
