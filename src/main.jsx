import { Application, Assets } from "pixi.js";
import { Graphics } from "pixi.js";
import { SlotMachine } from "./components/Reel/SlotMachine";
import  {symbols } from "./objects/objects";
// import cherry from "./assets/cherry.png";
// import lemon from "./assets/lemon.png";
// import bell from "./assets/bell.png";
// import seven from "./assets/seven.png";
// import diamond from "./assets/diamond.png";


export class SlotFrame extends Graphics {
  constructor() {
    super();
    const width = 800;
    const height = 550;
    // Outer cabinet
    this.roundRect( 0, 0,width,height,30).fill(0x111111).stroke({width: 8,color: 0xffcc00});
    // Inner slot window
    this.roundRect(25,40,750,420,20).fill(0x000000).stroke({width: 4,color: 0xffffff});
    // Bottom control area
    this.roundRect(25,560,550,60,15).fill(0x222222).stroke({width: 3,color: 0xffcc00 });
  }
}



const app = new Application();

async function init() {
  await app.init({
    width: 800,
    height: 800,
    background: 0x19191a,
  });

  
  document.getElementById("root").appendChild(app.canvas);
  await Assets.load(symbols.map((symbol) => symbol.texture));
  const slotMachine = new SlotMachine(app, symbols);
    const frame = new SlotFrame();

frame.x = 0;
frame.y = 0;
app.stage.addChild(frame);
  app.stage.addChild(slotMachine);

}

init();
