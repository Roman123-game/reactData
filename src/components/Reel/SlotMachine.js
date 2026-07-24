import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { Paytable } from "./Paytable";
import { Reel } from "./Reel";


export class SlotMachine extends Container {

    constructor(app, symbols) {

        super();

        this.app = app;

        this.symbols = symbols;

        this.credits = 100;

        this.freeSpins = 0;

        this.isSpinning = false;


        this.reels = [];


        this.paylines = [

            [0,0,0,0,0],
            [1,1,1,1,1],
            [2,2,2,2,2],

            [0,1,2,1,0],
            [2,1,0,1,2],

            [1,0,0,0,1],
            [1,2,2,2,1],

        ];



        for(let i=0;i<5;i++){

            const reel = new Reel(symbols);

            reel.x = i * 120;

            this.addChild(reel);

            this.reels.push(reel);

        }



        this.x = app.screen.width / 2 - 300;
        this.y = 80;



        this.creditText = new Text({

            text:`Credits: ${this.credits}`,

            style:new TextStyle({

                fill:"white",
                fontSize:28

            })

        });


        this.creditText.y = 520;

        this.addChild(this.creditText);



        this.freeSpinText = new Text({

            text:"",

            style:{
                fill:"#ffd700",
                fontSize:24
            }

        });


        this.freeSpinText.y = 550;

        this.addChild(this.freeSpinText);



        this.createSpinButton();

        this.createPaytableButton();



        this.paytable = new Paytable(symbols);

        this.addChild(this.paytable);



        app.ticker.add((ticker)=>{

            this.reels.forEach(reel=>{

                reel.update(ticker.deltaTime);

            });

        });

    }




    createSpinButton(){

        const button = new Graphics();

        button.roundRect(0,0,200,60,15);

        button.fill(0x22aa55);


        button.y = 600;


        button.eventMode="static";

        button.cursor="pointer";



        const text = new Text({

            text:"SPIN",

            style:{
                fill:"white",
                fontSize:30
            }

        });


        text.anchor.set(.5);

        text.x=100;

        text.y=30;


        button.addChild(text);



        button.on("pointerdown",()=>{

            this.spin();

        });



        this.addChild(button);

    }




    createPaytableButton(){


        const button = new Graphics();


        button.roundRect(0,0,200,60,15);

        button.fill(0x3366cc);


        button.x=220;

        button.y=600;


        button.eventMode="static";

        button.cursor="pointer";



        const text = new Text({

            text:"PAYTABLE",

            style:{
                fill:"white",
                fontSize:24
            }

        });


        text.anchor.set(.5);

        text.x=100;

        text.y=30;



        button.addChild(text);



        button.on("pointerdown",()=>{

            this.paytable.toggle();

        });



        this.addChild(button);


    }




    spin(){


        if(this.isSpinning)
            return;


        if(this.credits<=0 && this.freeSpins<=0)
            return;



        this.isSpinning=true;



        if(this.freeSpins>0){

            this.freeSpins--;

        }
        else{

            this.credits--;

        }



        this.updateText();



        this.reels.forEach((reel,index)=>{


            reel.start();



            setTimeout(()=>{


                reel.stop();


                if(index===4){


                    this.generateResults();

                    this.checkWin();


                    this.isSpinning=false;


                }


            },1200 + index*400);



        });
    }

    generateResults(){
        this.reels.forEach(reel=>{
            reel.currentSymbols=[];
            reel.sprites.forEach(sprite=>{
                const symbol = this.symbols[
                    Math.floor(
                        Math.random()*this.symbols.length
                    )
                ];
                reel.currentSymbols.push(symbol);
            });
        });
    }

    checkWin(){
        let total=0;
        for(const payline of this.paylines){
            const line = payline.map(
                (row,index)=>
                    this.reels[index]
                    .currentSymbols[row]
            );
            total += this.checkPayline(line);
        }
        if(total>0){
            this.credits+=total;
            this.creditText.text =
            `🎉 WIN +${total} Credits:${this.credits}`;
        }
        else{
            this.updateText();
        }
        this.checkScatter();
    }

    checkPayline(line){
        let base=null;
        let count=0;

        for(const symbol of line){
            if(symbol.type==="scatter")
                break;
            if(!base && symbol.type!=="wild"){
                base=symbol;
            }
            if(
                symbol.type==="wild" ||
                symbol.name===base?.name
            ){
                count++;
            }
            else{
                break;
            }
        }

        if(count<3)
            return 0;

        if(!base)
            return 500;

        if(count===3)
            return base.payout;

        if(count===4)
            return base.payout*3;

        if(count===5)
            return base.payout*8;
        return 0;
    }

    checkScatter(){
        let count=0;
        this.reels.forEach(reel=>{
            reel.currentSymbols.forEach(symbol=>{
                if(symbol.type==="scatter")
                    count++;
            });
        });

        if(count>=3){
            const spins =
                count===3?10:
                count===4?15:
                20;
            this.freeSpins+=spins;
            this.updateText();
        }
    }

    updateText(){
        this.creditText.text =
        `Credits: ${this.credits}`;
        this.freeSpinText.text =
        this.freeSpins>0?
        `Free Spins: ${this.freeSpins}`:
        "";
    }

}