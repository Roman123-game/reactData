import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { Reel } from "./Reel";
import { Paytable } from "./Paytable";
export class SlotMachine extends Container {
  constructor(app, symbols, onWin = () => {}) {
    super();
    this.app = app;
    this.symbols = symbols;
    this.onWin = onWin;
    this.credits = 100;
    this.isSpinning = false;
    this.reels = [];
    this.freeSpins = 0;
    this.inFreeSpin = false;
    this.autoSpin = false;
    this.autoSpinCount = 0;
    this.winGreetingElapsed = 0;
    this.winGreetingDuration = 1800;
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
    this.winGreeting = new Text({
      text: "SALUT !!!",
      style: new TextStyle({
        fill: 0xffd778,
        fontFamily: "Arial",
        fontSize: 44,
        fontWeight: "900",
        letterSpacing: 3,
        stroke: { color: 0x70451d, width: 5 },
        dropShadow: { color: 0xf19b35, blur: 12, distance: 0, alpha: 0.7 },
      }),
    });
    this.winGreeting.anchor.set(0.5);
    this.winGreeting.x = 300;
    this.winGreeting.y = -4;
    this.winGreeting.alpha = 0;
    this.winGreeting.visible = false;
    this.addChild(this.winGreeting);
    this.paytable = new Paytable(symbols);
    this.paytable.y = -50;
    this.addChild(this.paytable);
    // Update reels
    app.ticker.add((ticker) => {
      this.reels.forEach((reel) => {
        reel.update(ticker.deltaTime);
      });
      this.updateWinGreeting(ticker.deltaMS);
    });
  }
  showWinGreeting() {
    this.winGreetingElapsed = 0;
    this.winGreeting.visible = true;
    this.winGreeting.alpha = 1;
    this.winGreeting.scale.set(0.6);
  }
  updateWinGreeting(deltaMS) {
    if (!this.winGreeting.visible) return;

    this.winGreetingElapsed += deltaMS;
    if (this.winGreetingElapsed >= this.winGreetingDuration) {
      this.winGreeting.visible = false;
      this.winGreeting.alpha = 0;
      return;
    }

    const elapsed = this.winGreetingElapsed;
    const progress = Math.min(elapsed / 250, 1);
    const pop = 0.6 + progress * 0.55;
    const fade = Math.min(
      1,
      (this.winGreetingDuration - elapsed) / 350,
    );
    this.winGreeting.scale.set(pop);
    this.winGreeting.y = -4 - Math.min(elapsed / 1000, 1) * 18;
    this.winGreeting.rotation = Math.sin(elapsed / 130) * 0.06;
    this.winGreeting.alpha = fade;
  }
  createButton({ x, width, label, colors, onClick, isActive = () => false }) {
    const button = new Graphics();
    const text = new Text({
      text: label,
      style: new TextStyle({
        fill: 0xffffff,
        fontFamily: "Arial",
        fontSize: 20,
        fontWeight: "bold",
        letterSpacing: 1.5,
        dropShadow: { color: 0x07121b, blur: 2, distance: 1, alpha: 0.8 },
      }),
    });

    text.anchor.set(0.5);
    text.x = x + width / 2;
    text.y = 28;
    button.y = 490;
    button.eventMode = "static";
    button.cursor = "pointer";

    const draw = (state) => {
      const faceColor =
        state === "hover" ? colors.hover : state === "active" ? colors.active : colors.face;
      const offset = state === "pressed" ? 5 : state === "active" ? 4 : 0;
      button.clear();
      button.roundRect(x, 8, width, 56, 15)
        .fill({ color: 0x050a12, alpha: 0.72 });
      button.roundRect(x, 4 + offset, width, 56, 15)
        .fill(0x111d2a)
        .stroke({ width: 2, color: colors.border, alpha: 0.9 });
      button.roundRect(x + 3, 2 + offset, width - 6, 48, 12)
        .fill(faceColor)
        .stroke({ width: 1, color: 0xffffff, alpha: 0.3 });
      button.roundRect(x + 8, 6 + offset, width - 16, 8, 4)
        .fill({ color: 0xffffff, alpha: state === "hover" ? 0.3 : 0.18 });
      text.y = 26 + offset;
    };

    draw("idle");
    button.addChild(text);
    button.on("pointerover", () => draw(isActive() ? "active" : "hover"));
    button.on("pointerout", () => draw(isActive() ? "active" : "idle"));
    button.on("pointerdown", () => {
      draw("pressed");
      onClick();
    });
    button.on("pointerup", () => draw(isActive() ? "active" : "hover"));
    button.on("pointerupoutside", () => draw(isActive() ? "active" : "idle"));

    this.addChild(button);
    return { button, text, draw, colors };
  }
  createAutoSpinButton() {
    this.autoSpinButton = this.createButton({
      x: 484,
      width: 140,
      label: "AUTO",
      colors: {
        face: 0x9d3542,
        hover: 0xc34655,
        border: 0xf36a72,
        active: 0x116c5c,
      },
      isActive: () => this.autoSpin,
      onClick: () => {
        this.autoSpin = !this.autoSpin;
        if (this.autoSpin) {
          this.autoSpinCount = 50;
          this.spin();
        } else {
          this.autoSpinCount = 0;
        }
        this.updateAutoSpinButton();
      },
    });
  }
  updateAutoSpinButton() {
    const { text, colors, draw } = this.autoSpinButton;
    text.text = this.autoSpin ? "STOP" : "AUTO";
    Object.assign(
      colors,
      this.autoSpin
        ? {
            face: 0x16866e,
            hover: 0x1da88a,
            border: 0x4fe0bb,
            active: 0x116c5c,
          }
        : {
            face: 0x9d3542,
            hover: 0xc34655,
            border: 0xf36a72,
            active: 0x116c5c,
          },
    );
    draw(this.autoSpin ? "active" : "idle");
  }
  createSpinButton() {
    this.createButton({
      x: -24,
      width: 200,
      label: "SPIN",
      colors: { face: 0x16866e, hover: 0x1da88a, border: 0x4fe0bb },
      onClick: () => this.spin(),
    });
  }
  createPaytableButton() {
    this.createButton({
      x: 220,
      width: 200,
      label: "PAYTABLE",
      colors: { face: 0x285c9c, hover: 0x3479bd, border: 0x74b9ed },
      onClick: () => this.paytable.toggle(),
    });
  }
  spin() {
    if (this.isSpinning) return;

    // Stop auto spin when limit reached
    if (this.autoSpin && this.autoSpinCount <= 0) {
      this.autoSpin = false;
      this.updateAutoSpinButton();
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
        this.updateAutoSpinButton();

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
          reel.stop().then(() => {
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
                    this.updateAutoSpinButton();
                  }

                  this.freeSpinText.text = "";
                }
              }, 250);
            }
          });
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
      awarded = 1;
    }
    if (scatters === 4) {
      awarded = 5;
    }
    if (scatters >= 5) {
      awarded = 10;
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
      this.showWinGreeting();
      this.onWin(win);
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

    for (let i = 0; i < line.length; i++) {
      this.winLines
        .roundRect(i * reelWidth + 2, line[i] * cellHeight + 2, 116, 116, 8)
        .fill({ color: 0x00ff66, alpha: 0.22 })
        .stroke({ width: 3, color: 0x00ff66, alpha: 0.95 });
    }

    this.winLines.moveTo(45, line[0] * cellHeight + 60);
    for (let i = 1; i < line.length; i++) {
      this.winLines.lineTo(i * reelWidth + 60, line[i] * cellHeight + 60);
    }
    this.winLines.stroke({
      width: 8,
      color: 0xff0000,
      alpha: 0.9,
    });
  }
}
