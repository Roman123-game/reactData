import { Application, Assets } from "pixi.js";

import { SlotMachine } from "./components/Reel/SlotMachine";

import cherry from "./assets/cherry.png";
import lemon from "./assets/lemon.png";
import bell from "./assets/bell.png";
import seven from "./assets/seven.png";
import diamond from "./assets/diamond.png";

const app = new Application();

async function init() {
  await app.init({
    width: 600,
    height: 700,
    background: 0x222222,
  });

  document.getElementById("root").appendChild(app.canvas);

  const symbols = [cherry, lemon, bell, seven, diamond];

  // Load images into Pixi cache
  await Assets.load(symbols);

  const slotMachine = new SlotMachine(app, symbols);

  app.stage.addChild(slotMachine);
}

init();
