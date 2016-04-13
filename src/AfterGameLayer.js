var AfterGameLayer = cc.Layer.extend({
    resetFunction:function(){
        var escena = new HelloWorldScene();
         cc.director.runScene(new cc.TransitionSlideInT(1,escena));
    },
     homeFucntion:function(objeto){
        var escena = new MenuScene();
         cc.director.runScene(new cc.TransitionSlideInT(1,escena));
    },
	ctor:function (estatusJugador) {
        this._super();
        var Size = cc.winSize;
        var actionletrero;
        var actionganadores;
        var xl = 0;
        var yl = 0;
        var xg = 0;
        var yg = 0;
        
        //--- COLOCANDO IMAGEN DE FONDO DESPUES DEL JUEGO---//
        var fondo = new cc.Sprite(res.fondoAG_png);
        fondo.setPosition(Size.width/2,Size.height/2);
        this.addChild(fondo,5);

         //--- Ubicacion Original del letrero ylos ganadores---//
        var letrero = new cc.Sprite();
        letrero.setPosition(-200,Size.height/2);
        this.addChild(letrero,5);
        
        var ganadores = new cc.Sprite();
        ganadores.setPosition(Size.width/2.1,10000);
        ganadores.setScale(1.3,1.3);
        this.addChild(ganadores,5);
        
        var puntuacion = new cc.LabelTTF("Skills nivel : "+ estatusJugador.toString(), "Arial", 24);
        puntuacion.setPosition(Size.width/2,250);
        puntuacion.setVisible(false);
        this.addChild(puntuacion, 5);

         //--- Creación de los botones de reinicio y regreso a 
        //pantalla principal---//
        
        //Boton reset
        var reset = new cc.MenuItemSprite(new cc.Sprite(res.resetbutton_png),new cc.Sprite( res.resetbuttonpress_png),this.resetFunction,this);
        //reset.setScale(0,0);
        
        //Boton Home
        var home = new cc.MenuItemSprite(new cc.Sprite(res.homebutton_png),new cc.Sprite( res.homebuttonpress_png),this.homeFucntion,this);
        //home.setScale(0,0);
        
        //Menú
        var menu = new cc.Menu(reset,home);
        menu.alignItemsHorizontally();
        menu.setPosition(Size.width/2,200);
        menu.setOpacity(0);
        this.addChild(menu,5);

        
         //--- Ubicacion y  seleccion del letrero segun  los ganadores---//
        if(estatusJugador === 'F'){
            
            xl = Size.width/2.08;
            yl = Size.height/2.5;
            
            xg = Size.width/2.1;
            yg = Size.height/1.60;
            letrero.setTexture(res.GameOver_png);
            ganadores.setTexture(res.VilliansHeads_png);
        
        }
        else{
            xl = Size.width/2;
            yl = Size.height/2;
            
            xg = Size.width/2.1;
            yg = Size.height/1.15;
            
            letrero.setTexture(res.YouWin_png);
            ganadores.setTexture(res.HeroesHeads_png);
            
        }
          actionletrero = cc.moveTo(0.5,cc.p(xl,yl));
          actionganadores = cc.moveTo(1,cc.p(xg,yg));
       
        //---Aparece el letrero--//
        letrero.runAction(actionletrero);
        
        //--Aparecen los ganadores--//
        ganadores.runAction(actionganadores);
        
        //--Aparecen los botones--//
        this.scheduleOnce(function(){
            puntuacion.setVisible(true);
            menu.setOpacity(255);
        },1.5);
        
        return true;
    }
});
