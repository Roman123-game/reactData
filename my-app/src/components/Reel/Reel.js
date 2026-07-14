import {
    Container,
    Sprite,
    Assets
} from "pixi.js";



export class Reel extends Container {



    constructor(symbols){

        super();



        this.symbols = symbols;



        this.currentIndex = 0;



        this.spinning = false;

        this.speed = 0;





        this.sprite = new Sprite();



        this.sprite.width = 100;

        this.sprite.height = 100;




        this.addChild(this.sprite);




        this.setRandomSymbol();


    }







    setRandomSymbol(){



        const index = Math.floor(

            Math.random() *
            this.symbols.length

        );



        this.currentIndex = index;



        const texture =
            Assets.get(
                this.symbols[index]
            );



        this.sprite.texture = texture;



    }







    start(){


        this.spinning = true;


        this.speed = 45;


    }







    stop(){


        this.spinning = false;


        this.speed = 0;



        this.sprite.y = 0;



        this.setRandomSymbol();


    }







    update(delta){



        if(!this.spinning)
            return;




        this.sprite.y +=
            this.speed * delta;





        if(this.sprite.y > 120){



            this.sprite.y = -120;



            this.setRandomSymbol();



        }



    }


}