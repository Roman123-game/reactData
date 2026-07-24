import { Application, Assets } from "pixi.js";

import { SlotMachine } from "./components/Reel/SlotMachine";

// import cherry from "./assets/cherry.png";
// import lemon from "./assets/lemon.png";
// import bell from "./assets/bell.png";
// import seven from "./assets/seven.png";
// import diamond from "./assets/diamond.png";
import bitcoin from "./assets/bitcoin.png";
import etherium from "./assets/etherium.png";
import litherium from "./assets/litherium.png";
import tetherium from "./assets/tetherium.png";
import shield from "./assets/shield.png";
import safe from "./assets/case.png";
import rocket from "./assets/rocket.png";
import dog from "./assets/dog.png";
import jackpot from "./assets/jackpot.png";
import vault from "./assets/vault.png";
import gain from "./assets/gain.png";
import wild from "./assets/wild.png";
import shiledtwo from "./assets/shiledtwo.png";

const symbols = [
  {
    name: "Bitcoin",
    texture: bitcoin,
    payout: 20,
    type: "normal",
  },
  {
    name: "Ethereum",
    texture: etherium,
    payout: 25,
    type: "normal",
  },
  {
    name: "Litecoin",
    texture: litherium,
    payout: 15,
    type: "normal",
  },
  {
    name: "Tether",
    texture: tetherium,
    payout: 10,
    type: "normal",
  },
  {
    name: "Shield",
    texture: shield,
    payout: 30,
    type: "normal",
  },
  {
    name: "Safe",
    texture: safe,
    payout: 35,
    type: "normal",
  },
  {
    name: "Rocket",
    texture: rocket,
    payout: 40,
    type: "normal",
  },
  {
    name: "Dog",
    texture: dog,
    payout: 50,
    type: "normal",
  },
  {
    name: "Jackpot",
    texture: jackpot,
    payout: 100,
    type: "normal",
  },
  {
    name: "Vault",
    texture: vault,
    payout: 80,
    type: "normal",
  },
  {
    name: "Gain",
    texture: gain,
    payout: 60,
    type: "normal",
  },
  {
    name: "Wild",
    texture: wild,
    payout: 0,
    type: "wild",
  },
  {
    name: "Shield Two",
    texture: shiledtwo,
    payout: 45,
    type: "normal",
  },
];

const app = new Application();

async function init() {
  await app.init({
    width: 800,
    height: 800,
    background: 0x19191a,
  });

  document.getElementById("root").appendChild(app.canvas);

  // const symbols = [bitcoin, litherium, tetherium, shield, safe, rocket, dog, jackpot, vault,gain,etherium,wild,shiledtwo];

  // Load images into Pixi cache
  await Assets.load(symbols.map((symbol) => symbol.texture));

  const slotMachine = new SlotMachine(app, symbols);

  app.stage.addChild(slotMachine);
}

init();
