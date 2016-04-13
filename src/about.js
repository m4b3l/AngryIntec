var AboutLayer = cc.Layer.extend({
    onBackCallback:function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(MenuLayer.create());
        cc.director.runScene(cc.TransitionFadeTR.create(1, scene));
    },
    ctor: function () {
        this._super();
        
        // YA SOLO TIENES QUE COMPLETARLA Y LLENARLA CON LA INFORMACION DE NOSOTROS!
        // NOMBRE - ID
        // Carlos Valerio - 1058929
        // Frederick Ramirez - 
        // Mabel Geronimo - 
        // Nathalia Garcia - 
        
        var fondo = new cc.Sprite(res.fondo_png);
        fondo.setPosition(cc.winSize.width/2,  cc.winSize.height/2);
        this.addChild(fondo);
        
        var label = cc.LabelTTF.create("Volver", "Arial", 26);
        label.setColor(255,255,255);
        var back = cc.MenuItemLabel.create(label, this.onBackCallback);
        var menu = cc.Menu.create(back);
        menu.setPosition( cc.winSize.width / 2, 80);
        this.addChild(menu);   
        }
});

AboutLayer.create = function () {
    var sg = new AboutLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
              
  
