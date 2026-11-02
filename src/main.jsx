import { Application, Assets, Container, Graphics, Text, TextStyle } from "pixi.js";
import { SlotMachine } from "./components/Reel/SlotMachine";
import { symbols } from "./objects/objects";

export class SlotFrame extends Container {
  constructor(app) {
    super();
    this.currencySymbols = [];
    this.currencyHighlightDuration = 2000;
    this.currencyHighlightElapsed = 0;
    this.isCurrencyHighlighted = false;
    this.highlightAllCurrencies = false;
    this.highlightedCurrencyIndex = -1;
    this.coinLayer = new Container();
    this.coins = [];
    app.ticker.add((ticker) => this.updateCoins(ticker.deltaMS));

    const backdrop = new Graphics();
    backdrop.rect(0, 0, 1060, 800).fill(0x070b16);
    backdrop.circle(150, 250, 190).fill({ color: 0x087d82, alpha: 0.12 });
    backdrop.circle(910, 500, 220).fill({ color: 0x6341aa, alpha: 0.12 });
    backdrop.roundRect(18, 18, 1024, 764, 34)
      .fill(0x0b1222)
      .stroke({ width: 3, color: 0x1d5260 });
    backdrop.roundRect(27, 27, 1006, 746, 28)
      .stroke({ width: 1, color: 0x946d35, alpha: 0.75 });

    this.addChild(backdrop);

    const backgroundSymbols = ["₿", "₪", "₮", "Ł", "$", "€", "£", "¥"];
    const symbolColors = [0xf2a900, 0x9aabff, 0x26a17b, 0x34d6c5];
    const symbolPositions = [
      [76, 182], [142, 274], [82, 378], [142, 482], [78, 570], [136, 728],
      [922, 182], [984, 274], [926, 378], [986, 482], [922, 570], [984, 728],
      [280, 746], [430, 746], [630, 746], [780, 746],
    ];
    symbolPositions.forEach(([x, y], index) => {
      const symbol = new Text({
        text: backgroundSymbols[index % backgroundSymbols.length],
        style: new TextStyle({
          fill: symbolColors[index % symbolColors.length],
          fontFamily: "Arial",
          fontSize: index % 3 === 0 ? 34 : 26,
          fontWeight: "bold",
        }),
      });
      symbol.anchor.set(0.5);
      symbol.alpha = 0.25;
      symbol.x = x;
      symbol.y = y;
      this.addChild(symbol);
      this.currencySymbols.push(symbol);
    });
    app.ticker.add((ticker) => this.updateCurrencyHighlight(ticker.deltaMS));

    const cabinet = new Graphics();
    cabinet.roundRect(173, 112, 714, 488, 28)
      .fill(0x101c2b)
      .stroke({ width: 5, color: 0x34d6c5 });
    cabinet.roundRect(183, 122, 694, 468, 22)
      .stroke({ width: 2, color: 0xe7b75a, alpha: 0.9 });
    cabinet.roundRect(225, 135, 610, 370, 14)
      .fill(0x080d18)
      .stroke({ width: 2, color: 0x205361 });
    cabinet.roundRect(188, 607, 684, 105, 22)
      .fill(0x101a29)
      .stroke({ width: 3, color: 0x34d6c5 });
    cabinet.roundRect(198, 617, 664, 85, 16)
      .stroke({ width: 1, color: 0xe7b75a, alpha: 0.8 });

    const frameDots = [
      [205, 144], [855, 144], [205, 568], [855, 568],
      [210, 629], [850, 629], [210, 690], [850, 690],
    ];
    for (const [x, y] of frameDots) {
      cabinet.circle(x, y, 4).fill(0xf4c66a);
      cabinet.circle(x, y, 1.5).fill(0xfff0bc);
    }
    this.addChild(cabinet);

    const title = new Text({
      text: "CRYPTO JACKPOT",
      style: new TextStyle({
        fill: 0xffd778,
        fontFamily: "Arial",
        fontSize: 36,
        fontWeight: "900",
        letterSpacing: 4,
        stroke: { color: 0x70451d, width: 5 },
        dropShadow: { color: 0xf19b35, blur: 12, distance: 0, alpha: 0.45 },
      }),
    });
    title.anchor.set(0.5);
    title.x = 530;
    title.y = 63;
    this.addChild(title);

    const subtitle = new Text({
      text: "DECENTRALIZED  •  PROVABLY LUCKY",
      style: new TextStyle({
        fill: 0x7dded3,
        fontFamily: "Arial",
        fontSize: 11,
        fontWeight: "bold",
        letterSpacing: 2,
      }),
    });
    subtitle.anchor.set(0.5);
    subtitle.x = 530;
    subtitle.y = 94;
    this.addChild(subtitle);

    this.addCoinBadge(230, "₿", 0xf2a900);
    this.addCoinBadge(830, "Ξ", 0x9aabff);

    const footer = new Text({
      text: "SPIN  •  STACK  •  WIN",
      style: new TextStyle({
        fill: 0x668b9a,
        fontFamily: "Arial",
        fontSize: 10,
        fontWeight: "bold",
        letterSpacing: 3,
      }),
    });
    footer.anchor.set(0.5);
    footer.x = 530;
    footer.y = 748;
    this.addChild(footer);
  }

  highlightCurrency(winAmount) {
    this.currencyHighlightElapsed = 0;
    this.isCurrencyHighlighted = true;
    this.highlightAllCurrencies = winAmount > 50;
    this.highlightedCurrencyIndex = this.highlightAllCurrencies
      ? -1
      : Math.floor(Math.random() * this.currencySymbols.length);
    if (this.highlightAllCurrencies) {
      for (let burst = 0; burst < 3; burst++) {
        setTimeout(() => this.shootCoins(64), burst * 300);
      }
    } else {
      this.shootCoins();
    }
  }

  shootCoins(coinsPerSide = 32) {
    const sides = [
      [0, 140],
      [920, 1060],
    ];

    sides.forEach(([minTargetX, maxTargetX]) => {
      for (let i = 0; i < coinsPerSide; i++) {
        const radius = 30 + Math.random() * 36;
        const coin = new Container();
        const face = new Graphics();
        face.circle(0, 0, radius)
          .fill(0xa96316)
          .stroke({ width: radius * 0.12, color: 0xffe6a3 });
        face.circle(0, 0, radius * 0.82)
          .fill(0xf5bd42)
          .stroke({ width: Math.max(1, radius * 0.045), color: 0xfff0bc });
        face.circle(0, 0, radius * 0.68)
          .stroke({ width: Math.max(1, radius * 0.035), color: 0xc17b18 });
        coin.addChild(face);

        const symbol = new Text({
          text: "₿",
          style: new TextStyle({
            fill: 0x9b5b13,
            fontFamily: "Arial",
            fontSize: radius * 1.05,
            fontWeight: "bold",
          }),
        });
        symbol.anchor.set(0.5);
        coin.addChild(symbol);

        const originX = 530 + (Math.random() - 0.5) * 24;
        const originY = 782 + Math.random() * 18;
        const targetX = minTargetX + Math.random() * (maxTargetX - minTargetX);
        const targetY = 180 + Math.random() * 140;
        const targetScale = 0.3 + Math.random() * 0.7;
        const gravity = 0.0015 + Math.random() * 0.001;
        const flightDuration = Math.sqrt(
          (2 * (originY - targetY)) / gravity,
        );

        coin.x = originX;
        coin.y = originY;
        coin.scale.set(0);
        this.coinLayer.addChild(coin);
        this.coins.push({
          sprite: coin,
          originX,
          originY,
          targetX,
          targetY,
          gravity,
          flightDuration,
          flightElapsed: 0,
          fallElapsed: 0,
          popElapsed: 0,
          targetScale,
          fallDuration:
            Math.sqrt((2 * (800 - targetY)) / gravity) + 180,
          fallDrift: (Math.random() - 0.5) * 0.12,
          flutter: 10 + Math.random() * 24,
          phase: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.04,
        });
      }
    });
  }

  updateCoins(deltaMS) {
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];
      coin.popElapsed = Math.min(coin.popElapsed + deltaMS, 20);
      const popProgress = coin.popElapsed / 20;
      const popScale = coin.targetScale * (1 - (1 - popProgress) ** 3);

      if (coin.flightElapsed < coin.flightDuration) {
        coin.flightElapsed = Math.min(
          coin.flightElapsed + deltaMS,
          coin.flightDuration,
        );
        const flightTime = coin.flightElapsed;
        const progress = flightTime / coin.flightDuration;
        const flutter =
          Math.sin(progress * 16 + coin.phase) * coin.flutter * progress;
        const initialVelocityY = -coin.gravity * coin.flightDuration;

        coin.sprite.x =
          coin.originX +
          (coin.targetX - coin.originX) * progress +
          flutter;
        coin.sprite.y =
          coin.originY +
          initialVelocityY * flightTime +
          0.5 * coin.gravity * flightTime ** 2;
      } else {
        coin.fallElapsed = Math.min(
          coin.fallElapsed + deltaMS,
          coin.fallDuration,
        );
        const fallTime = coin.fallElapsed;
        const progress = fallTime / coin.fallDuration;

        coin.sprite.x = coin.targetX + coin.fallDrift * fallTime;
        coin.sprite.y =
          coin.targetY + 0.5 * coin.gravity * fallTime ** 2;
        coin.sprite.alpha = Math.min(
          1,
          (coin.fallDuration - fallTime) / 180,
        );

        if (progress === 1) {
          this.coinLayer.removeChild(coin.sprite);
          coin.sprite.destroy({ children: true });
          this.coins.splice(i, 1);
          continue;
        }
      }

      coin.sprite.rotation += deltaMS * coin.spin;
      coin.sprite.scale.x = popScale;
      coin.sprite.scale.y = popScale * (
        0.25 +
        Math.abs(
          Math.sin(
            (coin.flightElapsed + coin.fallElapsed) * 0.02 +
              coin.phase,
          ),
        )
      );
      if (coin.fallElapsed === 0) {
        coin.sprite.alpha = 1;
      }
    }
  }

  updateCurrencyHighlight(deltaMS) {
    if (!this.isCurrencyHighlighted) return;

    this.currencyHighlightElapsed += deltaMS;
    if (this.currencyHighlightElapsed >= this.currencyHighlightDuration) {
      this.isCurrencyHighlighted = false;
      this.currencySymbols.forEach((text) => {
        text.alpha = 0.25;
      });
      return;
    }

    const pulse = (Math.sin(this.currencyHighlightElapsed / 110) + 1) / 2;
    this.currencySymbols.forEach((text, index) => {
      const shouldHighlight =
        this.highlightAllCurrencies || index === this.highlightedCurrencyIndex;
      text.alpha = shouldHighlight ? 0.55 + pulse * 0.45 : 0.25;
    });
  }

  addCoinBadge(x, symbol, color) {
    const badge = new Graphics();
    badge.circle(0, 0, 25).fill(0x172233).stroke({ width: 2, color });
    badge.circle(0, 0, 19).stroke({ width: 1, color, alpha: 0.65 });

    const label = new Text({
      text: symbol,
      style: new TextStyle({
        fill: color,
        fontFamily: "Arial",
        fontSize: 25,
        fontWeight: "bold",
      }),
    });
    label.anchor.set(0.5);
    badge.addChild(label);
    badge.x = x;
    badge.y = 64;
    this.addChild(badge);
  }
}

const app = new Application();
async function init() {
  await app.init({
    width: 1060,
    height: 800,
    background: 0x070b16,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    preference: "webgpu",
    webgpu: { powerPreference: "high-performance" },
    webgl: { powerPreference: "high-performance" },
  });

  document.getElementById("root").appendChild(app.canvas);
  await Assets.load(symbols.map((symbol) => symbol.texture));
  const frame = new SlotFrame(app);
  const slotMachine = new SlotMachine(app, symbols, (winAmount) =>
    frame.highlightCurrency(winAmount),
  );
  frame.x = 0;
  frame.y = 0;
  slotMachine.y = 140;
  app.stage.addChild(frame);
  app.stage.addChild(slotMachine);
  app.stage.addChild(frame.coinLayer);
}

init();
