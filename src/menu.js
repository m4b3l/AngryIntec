var MenuLayer = cc.Layer.extend({
    start : function(pSender){
        cc.director.runScene(cc.TransitionFadeTR.create(1, new HelloWorldScene()));
       
    },
    about : function(pSender){
        var scene = cc.Scene.create();
        scene.addChild(AboutLayer.create());
        //var imagen = cc.Sprite.create(res.Integrantes_png);
        //imagen.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        //scene.addChild(imagen);
        cc.director.runScene(cc.TransitionFadeTR.create(1, scene));
       
    },
    ctor: function () {
            this._super();
            size = cc.winSize;
            this.size = size;
        
            //titulo
            var titulo = new cc.Sprite(res.Titulo_png);
            titulo.setPosition(cc.winSize.width/2, cc.winSize.height/1.3);
            this.addChild(titulo, 1);
            
            // Fondo
            var fondo = new cc.Sprite(res.fondo_png);
            fondo.setPosition(cc.winSize.width/2,  cc.winSize.height/2);
            this.addChild(fondo);
        
            // Creacion del menu
            var menuItem1 = new cc.MenuItemFont("Jugar",this.start, this);
            var menuItem2 = new cc.MenuItemFont("Integrantes del proyecto", this.about, this);
            
            //Musica de Fondo
             cc.audioEngine.setMusicVolume(0.8);
            // cc.audioEngine.playMusic(res.SillyA_mp3, true);
        
            var Menu = new cc.Menu(menuItem1, menuItem2);
            Menu.alignItemsVerticallyWithPadding(40);
            this.addChild(Menu);
            
   
        
//        this.sprStart = new cc.Sprite(res.Start_png);
//        this.sprStart.setPosition(size.width / 2, size.height / 1.75);
//        this.addChild(this.sprStart, 0);
//        this.sprStart.setScale(0.5);
//        
//        this.Team = new cc.Sprite(res.Equipo_png);
//        this.Team.setPosition(size.width / 2.85, size.height / 2.37);
//        this.addChild(this.Team, 0);
//        this.Team.setScale(1.5);
//        
    }
});

MenuLayer.create = function () {
    var sg = new MenuLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);
    }
});