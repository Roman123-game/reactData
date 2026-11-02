import {
  Circle,
  Container,
  Graphics,
  Rectangle,
  Text,
  TextStyle,
} from "pixi.js";
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
    this.isFullSpinInProgress = false;
    this.canSpinReel = false;
    this.reels = [];
    this.reelSpinsInProgress = new Set();
    this.reelSpinStartSymbols = null;
    this.freeSpins = 0;
    this.inFreeSpin = false;
    this.reelSpinCost = 10;
    this.autoSpin = false;
    this.autoSpinCount = 0;
    this.winGreetingElapsed = 0;
    this.winGreetingDuration = 1800;
    this.freeSpinText = new Text({
      text: "",
      style: new TextStyle({
        fill: "#FFD700",
        fontSize: 14,
        fontWeight: "bold",
      }),
    });
    this.freeSpinText.anchor.set(0.5);
    this.freeSpinText.x = 300;
    this.freeSpinText.y = 350;
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
    const creditPanel = new Graphics();
    creditPanel.roundRect(0, 396, 600, 42, 12)
      .fill({ color: 0x09111d, alpha: 0.96 })
      .stroke({ width: 2, color: 0x34d6c5, alpha: 0.85 });
    creditPanel.roundRect(5, 401, 590, 32, 8)
      .stroke({ width: 1, color: 0xe7b75a, alpha: 0.55 });
    this.addChild(creditPanel);

    this.creditText = new Text({
      text: "",
      style: new TextStyle({
        fill: 0xffd778,
        fontFamily: "Arial",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 1,
        stroke: { color: 0x392914, width: 2 },
        dropShadow: { color: 0xf19b35, blur: 6, distance: 0, alpha: 0.4 },
      }),
    });
    this.creditText.anchor.set(0, 0.5);
    this.creditText.x = 20;
    this.creditText.y = 417;
    this.addChild(this.creditText);

    this.freeSpinsCountText = new Text({
      text: "",
      style: new TextStyle({
        fill: 0x7dded3,
        fontFamily: "Arial",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 1,
        stroke: { color: 0x123a3a, width: 2 },
      }),
    });
    this.freeSpinsCountText.anchor.set(1, 0.5);
    this.freeSpinsCountText.x = 580;
    this.freeSpinsCountText.y = 417;
    this.addChild(this.freeSpinsCountText);

    this.winAmountText = new Text({
      text: "",
      style: new TextStyle({
        fill: 0xffd778,
        fontFamily: "Arial",
        fontSize: 15,
        fontWeight: "bold",
        letterSpacing: 1,
      }),
    });
    this.winAmountText.anchor.set(0.5);
    this.winAmountText.x = 300;
    this.winAmountText.y = 413;
    this.addChild(this.winAmountText);
    this.updateCreditDisplay();
    this.createSpinButton();
    this.createPaytableButton();
    this.createAutoSpinButton();
    this.createReelSpinButtons();
    this.addChild(this.freeSpinText);
    this.winGreeting = new Text({
      text: "JACKPOT !!!",
      style: new TextStyle({
        fill: 0xffd778,
        fontFamily: "Arial",
        fontSize: 74,
        fontWeight: "900",
        letterSpacing: 4,
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
  updateCreditDisplay(winAmount = 0) {
    this.creditText.text = `CREDITS: ${this.credits}`;
    this.freeSpinsCountText.text = `FREE SPINS: ${this.freeSpins}`;
    this.winAmountText.text = winAmount > 0 ? `WIN +${winAmount}` : "";
  }
  createButton({ x, width, label, colors, onClick, isActive = () => false }) {
    const button = new Graphics();
    const text = new Text({
      text: label,
      style: new TextStyle({
        fill: 0xffffff,
        fontFamily: "Arial",
        fontSize: label === "PAYTABLE" ? 11 : 15,
        fontWeight: "bold",
        letterSpacing: 1.5,
        dropShadow: { color: 0x07121b, blur: 2, distance: 1, alpha: 0.8 },
      }),
    });

    text.anchor.set(0.5);
    const centerX = x + width / 2;
    const centerY = width / 2;
    const radius = width / 2;
    text.x = centerX;
    text.y = centerY;
    button.y = 474;
    button.eventMode = "static";
    button.cursor = "pointer";
    button.hitArea = new Circle(centerX, centerY + 8, radius);

    const draw = (state) => {
      const faceColor =
        state === "hover" ? colors.hover : state === "active" ? colors.active : colors.face;
      const offset = state === "pressed" ? 5 : state === "active" ? 4 : 0;
      button.clear();
      button.circle(centerX, centerY + 8, radius)
        .fill({ color: 0x050a12, alpha: 0.72 });
      button.circle(centerX, centerY + 4 + offset, radius - 2)
        .fill(0x111d2a)
        .stroke({ width: 2, color: colors.border, alpha: 0.9 });
      button.circle(centerX, centerY + offset, radius - 8)
        .fill(faceColor)
        .stroke({ width: 1, color: 0xffffff, alpha: 0.3 });
      text.y = centerY + offset;
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
      x: 482,
      width: 76,
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
    this.updateReelSpinButtons();
  }
  createSpinButton() {
    this.createButton({
      x: 42,
      width: 76,
      label: "SPIN",
      colors: { face: 0x16866e, hover: 0x1da88a, border: 0x4fe0bb },
      onClick: () => this.spin(),
    });
  }
  createReelSpinButtons() {
    this.reelSpinButtons = this.reels.map((_, index) => {
      const button = new Graphics();
      const text = new Text({
        text: "SPIN",
        style: new TextStyle({
          fill: 0xffffff,
          fontFamily: "Arial",
          fontSize: 8,
          fontWeight: "bold",
          letterSpacing: 1,
        }),
      });
      text.anchor.set(0.5);
      text.x = 22;
      text.y = 11;
      button.x = index * 120 + 38;
      button.y = 365;
      button.eventMode = "static";
      button.cursor = "pointer";
      button.hitArea = new Rectangle(0, 0, 44, 22);
      button.addChild(text);

      const draw = (state) => {
        const disabled =
          this.isFullSpinInProgress ||
          this.autoSpin ||
          !this.canSpinReel ||
          this.credits < this.reelSpinCost ||
          this.reelSpinsInProgress.has(index);
        const faceColor = disabled
          ? 0x34434b
          : state === "hover"
            ? 0x1da88a
            : state === "pressed"
              ? 0x0e594e
              : 0x16866e;
        button.clear();
        button.roundRect(0, 2, 44, 20, 6)
          .fill(0x050a12)
          .roundRect(0, 0, 44, 20, 6)
          .fill(faceColor)
          .stroke({ width: 1, color: disabled ? 0x61717a : 0x4fe0bb });
        button.alpha = disabled ? 0.65 : 1;
      };

      button.on("pointerover", () => draw("hover"));
      button.on("pointerout", () => draw("idle"));
      button.on("pointerdown", () => {
        if (
          this.isFullSpinInProgress ||
          this.autoSpin ||
          !this.canSpinReel ||
          this.credits < this.reelSpinCost ||
          this.reelSpinsInProgress.has(index)
        ) return;
        draw("pressed");
        this.spinReel(index);
      });
      button.on("pointerup", () => draw("hover"));
      button.on("pointerupoutside", () => draw("idle"));

      this.addChild(button);
      return { button, draw };
    });
    this.updateReelSpinButtons();
  }
  updateReelSpinButtons() {
    this.reelSpinButtons?.forEach(({ button, draw }, index) => {
      const disabled =
        this.isFullSpinInProgress ||
        this.autoSpin ||
        !this.canSpinReel ||
        this.credits < this.reelSpinCost ||
        this.reelSpinsInProgress.has(index);
      button.cursor = disabled ? "default" : "pointer";
      draw("idle");
    });
  }
  createPaytableButton() {
    this.createButton({
      x: 262,
      width: 76,
      label: "Reward",
      colors: { face: 0x285c9c, hover: 0x3479bd, border: 0x74b9ed },
      onClick: () => this.paytable.toggle(),
    });
  }
  async stopReels() {
    const stopPromises = [];
    await new Promise((resolve) => setTimeout(resolve, 1900));

    for (let index = 0; index < this.reels.length; index++) {
      stopPromises.push(this.reels[index].stop());
      if (index < this.reels.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    }

    await Promise.all(stopPromises);
  }
  spin() {
    if (this.isFullSpinInProgress || this.reelSpinsInProgress.size > 0) return;

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
    }
    this.freeSpinText.text = "";

    // Count auto spins only for paid spins
    if (this.autoSpin && !this.inFreeSpin) {
      this.autoSpinCount--;
    }

    this.updateCreditDisplay();

    this.winLines.clear();

    this.isSpinning = true;
    this.isFullSpinInProgress = true;
    this.canSpinReel = false;
    this.updateReelSpinButtons();

    this.reels.forEach((reel) => reel.start());
    this.stopReels().then(() => {
      setTimeout(() => {
        this.checkWin();
        this.checkScatters();
        this.isSpinning = false;
        this.isFullSpinInProgress = false;
        this.canSpinReel = true;
        this.updateReelSpinButtons();

        if (this.freeSpins > 0 || (this.autoSpin && this.autoSpinCount > 0)) {
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
    });
  }
  async spinReel(index) {
    if (
      this.isFullSpinInProgress ||
      this.autoSpin ||
      !this.canSpinReel ||
      this.credits < this.reelSpinCost ||
      this.reelSpinsInProgress.has(index)
    ) return;

    const reel = this.reels[index];
    if (!reel) return;
    if (this.reelSpinsInProgress.size === 0) {
      this.reelSpinStartSymbols = this.reels.map((currentReel) =>
        currentReel.currentSymbols.slice(),
      );
      this.winLines.clear();
    }
    this.canSpinReel = false;
    this.reelSpinsInProgress.add(index);
    this.credits -= this.reelSpinCost;
    this.updateCreditDisplay();
    this.updateReelSpinButtons();
    reel.start();

    try {
      await new Promise((resolve) => setTimeout(resolve, 1900));
      await reel.stop();
    } finally {
      this.reelSpinsInProgress.delete(index);
      if (this.reelSpinsInProgress.size === 0) {
        const previousSymbols = this.reelSpinStartSymbols;
        this.reelSpinStartSymbols = null;
        const win = this.checkReelSpinWin(previousSymbols);
        this.checkReelSpinScatters(previousSymbols);
        if (win > 0) {
          this.credits += win;
          this.updateCreditDisplay(win);
          this.showWinGreeting();
          this.onWin(win);
        } else {
          this.updateCreditDisplay();
        }
      }
      this.updateReelSpinButtons();
    }
  }
  checkReelSpinWin(previousSymbols) {
    let win = 0;
    for (const line of this.paylines) {
      const currentLine = line.map(
        (row, index) => this.reels[index].currentSymbols[row],
      );
      const previousLine = line.map(
        (row, index) => previousSymbols[index][row],
      );
      const payoutIncrease =
        this.checkLine(currentLine) - this.checkLine(previousLine);
      if (payoutIncrease > 0) {
        win += payoutIncrease;
        this.drawWinLine(line);
      }
    }
    return win;
  }
  checkReelSpinScatters(previousSymbols) {
    const previousCount = previousSymbols.flat().filter(
      (symbol) => symbol.type === "scatter",
    ).length;
    const currentCount = this.reels.reduce(
      (count, reel) =>
        count +
        reel.currentSymbols.filter((symbol) => symbol.type === "scatter").length,
      0,
    );
    const awarded = Math.max(
      0,
      this.getFreeSpinAward(currentCount) -
        this.getFreeSpinAward(previousCount),
    );
    if (awarded > 0) {
      this.freeSpins += awarded;
      this.updateCreditDisplay();
      this.freeSpinText.text = `🎉 ${currentCount} SCATTERS +${awarded} FREE SPINS`;
    }
  }
  getFreeSpinAward(scatters) {
    if (scatters === 3) return 1;
    if (scatters === 4) return 5;
    if (scatters >= 5) return 10;
    return 0;
  }
  checkScatters() {
    const scatters = this.reels.reduce(
      (count, reel) =>
        count +
        reel.currentSymbols.filter((symbol) => symbol.type === "scatter").length,
      0,
    );
    const awarded = this.getFreeSpinAward(scatters);
    if (awarded > 0) {
      this.freeSpins += awarded;
      this.updateCreditDisplay();
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
      this.updateCreditDisplay(win);
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
