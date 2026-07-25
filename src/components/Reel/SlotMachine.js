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
    this.freeSpins = 0;
    this.inFreeSpin = false;
    this.autoSpin = false;
    this.autoSpinCount = 0;
    this.freeSpinText = new Text({
      text: "",
      style: new TextStyle({
        fill: "#FFD700",
        fontSize: 24,
        fontWeight: "bold",
      }),
    });
    this.freeSpinText.y = 390;
    this.addChild(this.freeSpinText);
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
    this.createAutoSpinButton();
    this.paytable = new Paytable(symbols);
    this.addChild(this.paytable);
    // Update reels
    app.ticker.add((ticker) => {
      this.reels.forEach((reel) => {
        reel.update(ticker.deltaTime);
      });
    });
  }
  createAutoSpinButton() {
    const button = new Graphics();

    button.roundRect(484, 2, 140, 56, 15);
    button.fill(0xaa3333);

    button.y = 480;

    button.eventMode = "static";
    button.cursor = "pointer";

    const text = new Text({
      text: "AUTO",
      style: {
        fill: "white",
        fontSize: 22,
      },
    });

    text.anchor.set(0.5);
    text.x = 560;
    text.y = 30;

    button.addChild(text);

    button.on("pointerdown", () => {
      this.autoSpin = !this.autoSpin;

      if (this.autoSpin) {
        this.autoSpinCount = 50;

        text.text = "STOP";

        this.spin();
      } else {
        this.autoSpinCount = 0;

        text.text = "AUTO";
      }
    });

    this.addChild(button);
  }
  createSpinButton() {
    const button = new Graphics();
    button.roundRect(-74, 2, 200, 56, 15);
    button.fill(0x22aa55);
    button.y = 480;
    button.eventMode = "static";
    button.cursor = "pointer";
    const text = new Text({
      text: "SPIN",
      style: {
        fill: "white",
        fontSize: 22,
      },
    });
    text.anchor.set(0.5);
    text.x = 25;
    text.y = 30;
    button.addChild(text);
    button.on("pointerdown", () => this.spin());
    this.addChild(button);
  }
  createPaytableButton() {
    const button = new Graphics();
    button.roundRect(220, 2, 200, 56, 15);
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

    // Stop auto spin when limit reached
    if (this.autoSpin && this.autoSpinCount <= 0) {
      this.autoSpin = false;
      return;
    }

    // FREE SPIN
    if (this.freeSpins > 0) {
      this.inFreeSpin = true;

      this.freeSpins--;

      this.freeSpinText.text = `FREE SPINS LEFT: ${this.freeSpins}`;
    }
    // NORMAL SPIN
    else {
      this.inFreeSpin = false;

      if (this.credits < 5) {
        this.autoSpin = false;

        return;
      }

      this.credits -= 5;

      this.freeSpinText.text = "";
    }

    // Count auto spins only for paid spins
    if (this.autoSpin && !this.inFreeSpin) {
      this.autoSpinCount--;
    }

    this.creditText.text = `Credits: ${this.credits}`;

    this.winLines.clear();

    this.isSpinning = true;

    // Start reels
    this.reels.forEach((reel, index) => {
      reel.start();

      setTimeout(
        () => {
          reel.stop();

          // Last reel finished
          if (index === this.reels.length - 1) {
            setTimeout(() => {
              // Check wins
              this.checkWin();

              // Check scatter bonus
              this.checkScatters();

              this.isSpinning = false;

              // Continue free spins or auto spin
              if (
                this.freeSpins > 0 ||
                (this.autoSpin && this.autoSpinCount > 0)
              ) {
                setTimeout(() => {
                  this.spin();
                }, 1500);
              } else {
                this.inFreeSpin = false;

                if (this.autoSpin) {
                  this.autoSpin = false;
                }

                this.freeSpinText.text = "";
              }
            }, 250);
          }
        },
        1200 + index * 300,
      );
    });
  }
  checkScatters() {
    let scatters = 0;
    this.reels.forEach((reel) => {
      reel.currentSymbols.forEach((symbol) => {
        if (symbol.type === "scatter") {
          scatters++;
        }
      });
    });
    let awarded = 0;
    if (scatters === 3) {
      awarded = 10;
    }
    if (scatters === 4) {
      awarded = 15;
    }
    if (scatters >= 5) {
      awarded = 20;
    }
    if (awarded > 0) {
      this.freeSpins += awarded;
      this.freeSpinText.text = `🎉 ${scatters} SCATTERS +${awarded} FREE SPINS`;
      return true;
    }
    return false;
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
    let base = line.find((s) => s.type !== "wild");
    if (!base) return 0;
    let count = 0;
    for (const symbol of line) {
      if (symbol.type === "wild" || symbol.name === base.name) {
        count++;
      } else {
        break;
      }
    }
    return count >= 3 ? base.payout * count : 0;
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
      this.winLines.circle(i * reelWidth + 60, line[i] * cellHeight + 60, 35);
      this.winLines.stroke({
        width: 4,
        color: 0xffff00,
        alpha: 1,
      });
    }
  }
}
