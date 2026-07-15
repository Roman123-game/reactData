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


const app = new Application();

async function init() {
  await app.init({
    width: 600,
    height: 700,
    background: 0x222222,
  });

  document.getElementById("root").appendChild(app.canvas);

  const symbols = [bitcoin, litherium, tetherium, shield, safe, rocket, dog, jackpot, vault,gain,etherium,wild,shiledtwo];

  // Load images into Pixi cache
  await Assets.load(symbols);

  const slotMachine = new SlotMachine(app, symbols);

  app.stage.addChild(slotMachine);
}

init();
