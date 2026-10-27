import { Application, Assets, Container, Graphics, Text, TextStyle } from "pixi.js";
import { SlotMachine } from "./components/Reel/SlotMachine";
import { symbols } from "./objects/objects";

export class SlotFrame extends Container {
  constructor() {
    super();

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

    const backgroundSymbols = ["₿", "Ξ", "₮", "Ł", "$", "€", "£", "¥"];
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
    });

    const cabinet = new Graphics();
    cabinet.roundRect(173, 112, 714, 488, 28)
      .fill(0x101c2b)
      .stroke({ width: 5, color: 0x34d6c5 });
    cabinet.roundRect(183, 122, 694, 468, 22)
      .stroke({ width: 2, color: 0xe7b75a, alpha: 0.9 });
    cabinet.roundRect(198, 132, 664, 390, 14)
      .fill(0x080d18)
      .stroke({ width: 2, color: 0x205361 });
    cabinet.roundRect(188, 607, 684, 105, 22)
      .fill(0x101a29)
      .stroke({ width: 3, color: 0x34d6c5 });
    cabinet.roundRect(198, 617, 664, 85, 16)
      .stroke({ width: 1, color: 0xe7b75a, alpha: 0.8 });

    for (const x of [198, 862]) {
      for (const y of [137, 575, 632, 687]) {
        cabinet.circle(x, y, 4).fill(0xf4c66a);
        cabinet.circle(x, y, 1.5).fill(0xfff0bc);
      }
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
  });

  document.getElementById("root").appendChild(app.canvas);
  await Assets.load(symbols.map((symbol) => symbol.texture));
  const slotMachine = new SlotMachine(app, symbols);
  const frame = new SlotFrame();
  frame.x = 0;
  frame.y = 0;
  slotMachine.y = 140;
  app.stage.addChild(frame);
  app.stage.addChild(slotMachine);
}

init();
