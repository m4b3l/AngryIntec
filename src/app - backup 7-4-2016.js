

var HelloWorldLayer = cc.Layer.extend({
	pelota:null,
	suelo:null,
	fondo:null,
	winSize:null,
    space:null,
    slingshot:null, slingshot2:null, p1:null, p2:null, 
    wallsWidth:null,
    agarrado: null, pajarito:null, xi:null, xf:null, yi:null, yf:null, limiteResorteX:null, limiteResorteY:null, sprite:null,
    random: function(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	},
    crearMuros: function(filename){
        var WALLS_WIDTH = 5;
        var WALLS_ELASTICITY = 0.5;
        var WALLS_FRICTION = 1;
        var alturaPiso = 0;
        
        this.wallsWidth = WALLS_WIDTH + alturaPiso;
        
        leftWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, 0), new cp.v(0, this.winSize.height), WALLS_WIDTH);
        leftWall.setElasticity(WALLS_ELASTICITY);
        leftWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(leftWall);

        rightWall = new cp.SegmentShape(this.space.staticBody, new cp.v(this.winSize.width, this.winSize.height), new cp.v(this.winSize.width, 0), WALLS_WIDTH);
        rightWall.setElasticity(WALLS_ELASTICITY);
        rightWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(rightWall);

        bottomWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, 0), new cp.v(this.winSize.width, 0), WALLS_WIDTH);
        bottomWall.setElasticity(WALLS_ELASTICITY);
        bottomWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(bottomWall);

        upperWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, this.winSize.height), new cp.v(this.winSize.width, this.winSize.height), WALLS_WIDTH);
        upperWall.setElasticity(WALLS_ELASTICITY);
        upperWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(upperWall);
          
    },
    crearCirculo: function(filename, x, y, masa){
        var circle = cc.Sprite.create(filename);
        var mass = masa;

        var nodeSize = circle.getContentSize(),
            phNode = cc.PhysicsSprite.create(filename),
            phBody = null,
            phShape = null,
            scaleX = 1,
            scaleY = 1;
        nodeSize.width *= scaleX;
        nodeSize.height *= scaleY;

        //phBody = this.space.addBody(new cp.Body(mass, cp.momentForBox(mass, nodeSize.width, nodeSize.height)));
        phBody = new cp.Body(mass, cp.momentForBox(mass, nodeSize.width, nodeSize.height));
        phBody.setPos(cc.p(x, y));
		 
        phShape = this.space.addShape(new cp.CircleShape(phBody, nodeSize.width * 0.5, cc.p(0, 0)));
        phShape.setFriction(0.5);
        phShape.setElasticity(1);

        phNode.setBody(phBody);
        phNode.setRotation(0);
        phNode.setScale(1);
        
        this.sprite = phNode;
        this.pajarito = phBody;
        //phBody.setVel(cp.v(600,600));
        
        this.addChild(phNode, 2);  
    },
    crearCuadrado: function(filename, x, y, masa, rotacion){
        var box = cc.Sprite.create(filename);
        var mass = masa;

        var nodeSize = box.getContentSize(),
            phNode = cc.PhysicsSprite.create(filename),
            phBody = null,
            phShape = null,
            scaleX = 1,
            scaleY = 1;
        nodeSize.width *= scaleX;
        nodeSize.height *= scaleY;

        phBody = this.space.addBody(new cp.Body(mass, cp.momentForBox(mass, nodeSize.width, nodeSize.height)));
        phBody.setPos(cc.p(x, y));

        shape = this.space.addShape(new cp.BoxShape(phBody, nodeSize.width, nodeSize.height));
        shape.setFriction(0.5);
        shape.setElasticity(0.5);

        phNode.setBody(phBody);
        phNode.setRotation(rotacion);
        phNode.setScale(1);
 
        this.addChild(phNode);
    },
    crearObjetoEstatico: function(filename,x , y) {
        staticBody = new cp.Body(Infinity, Infinity);

        staticSprite = cc.Sprite.create(filename);
        this.addChild(staticSprite);
        staticSprite.setPosition(cc.p(x, y));

        staticBody.setPos(staticSprite.getPosition());
        shape = new cp.BoxShape(staticBody, staticSprite.getContentSize().width, staticSprite.getContentSize().height, 10);
        shape.setElasticity(1);
        shape.setFriction(1);
        this.space.addShape(shape);
    },
    AgarrarPajaro : function(location, event){
        var juego = event.getCurrentTarget();    
        var box = juego.sprite.getBoundingBox();
        
        if(cc.rectContainsPoint(box, location.getLocation())){
            juego.agarrado = true;
            cc.log("AGARRADO!!!!");
           // juego.xi = juego.pajarito.getLocationX();
        }
        
        return true;
        
    },
    MoverPajaro : function(location, event){
        var juego = event.getCurrentTarget();
        
        cc.log("Hola mover?")
       if(juego.agarrado){
            cc.log("MOVIENDO???");
           var ubicacion = location.getLocation();
           
           if(ubicacion.x > juego.xi - juego.limiteResorteX && ubicacion.x < juego.xi){
            juego.sprite.setPositionX(ubicacion.x);
           }
           if(ubicacion.y > juego.yi - juego.limiteResorteY && ubicacion.y < juego.yi){
            juego.sprite.setPositionY(ubicacion.y);
           }
           
           juego.estirarCuerda(juego.sprite.getPositionX() - juego.sprite.getContentSize().width/2,
                               juego.sprite.getPositionY());
           
          
       }
        return true;
        
    },
    LanzarPajaro : function(location, event){
        var juego = event.getCurrentTarget();
        
        juego.xf = juego.sprite.getPositionX();
        juego.yf = juego.sprite.getPositionY();
        
        cc.log("Hola lanzar?")
        if(juego.agarrado){
            cc.log("LANZADO!!!!!");
            juego.space.addBody(juego.pajarito);
            var vx = 250 + (4*(juego.xi - juego.xf));
            var vy = 250 + (4*(juego.yi - juego.yf));
            juego.pajarito.setVel(cp.v(vx, vy));
            juego.resetearCuerda();
            juego.agarrado = false;
        }
        
        return true;
        
    },
    estirarCuerda: function(x, y){
        this.goma1.clear();
        this.goma2.clear();
        this.goma1.drawSegment(this.p1, cc.p(x,y), 7, cc.color(48,22,8));
        this.goma2.drawSegment(cc.p(140,170), cc.p(x,y), 9, cc.color(48,22,8));
    },
    resetearCuerda: function(){
        this.goma1.clear();
        this.goma2.clear();
        this.goma1.drawSegment(this.p1, this.p2, 7, cc.color(48,22,8));
        this.goma2.drawSegment(this.p2, this.p2, 9, cc.color(48,22,8));
    },
    ctor:function () {
        this._super();
        this.winSize = cc.winSize;
        
        this.agarrado = false;
        this.sprite = false;
        this.xi = 200;
        this.xf =0;
        this.yi = 200;
        this.yf = 0;
        this.limiteResorteX = 150;
        this.limiteResorteY = 100;
        this.pajarito = false;
        
        //---CREANDO UN ESPACION DE FISICAS --------------------------------------------------------------------------------------------------
        this.space = new cp.Space();
        this.space.iterations = 30;
        this.space.gravity = cp.v(0, -800);  
        this.space.sleepTimeThreshold = Infinity;
        this.space.colisionSlop = Infinity;
		
		var phDebugNode = cc.PhysicsDebugNode.create(this.space);
		this.addChild(phDebugNode, 10);
        
        var update = function() { 
            this.space.step(1/60);
        }
		
		this.schedule(update);
        
        //--- COLOCANDO IMAGEN DE FONDO -----------------------------------------------------------------------------------------------------
        this.fondo = new cc.Sprite(res.fondo_png);
        this.fondo.setPosition(this.winSize.width/2, this.winSize.height/2);
        this.fondo.setScale(2);
        this.addChild(this.fondo);
 
        //---CREANDO MUROS -------------------------------------------------------------------------------------------------------------------
        this.crearMuros();
        
        //---CREANDO PAJARITO DE PRUEBA ------------------------------------------------------------------------------------------------
        var bolas = [res.bola2_png, res.bola3_png, res.bola4_png, res.bola5_png, res.bola6_png, res.bola7_png];
        this.crearCirculo(bolas[this.random(0,5)], 200, 200, 20);
        
        
        //--- COLOCANDO TIRAPIEDRAS ------------
        
        this.slingshot = new cc.Sprite(res.slingShot_png);
        this.slingshot.setPosition(180,105);
        this.addChild(this.slingshot, 1);
        
        this.slingshot2 = new cc.Sprite(res.slingShot2_png);
        this.slingshot2.setPosition(155,145);
        this.addChild(this.slingshot2, 3);
        
        this.p1 = cc.p(180,170);
        this.p2 = cc.p(155,170);
        
        this.goma1 =  new cc.DrawNode(); // Trasera
        this.goma1.drawSegment(this.p1, this.p2, 7, cc.color(48,22,8));
        this.addChild(this.goma1, 1);
        
        this.goma2 =  new cc.DrawNode(); // Delantera
        this.goma2.drawSegment(this.p2, this.p2,9, cc.color(48,22,8));
        this.addChild(this.goma2, 3);
        
        
        //--- CREANDO UN NIVEL DE PRUEBA -------------------------------------------------------------------
            //Primer piso
            this.crearCuadrado(res.bloquePiedra_png, 1060,20+this.wallsWidth,10, 0);
            this.crearCuadrado(res.bloquePiedra_png, 1100,20+this.wallsWidth,10, 0);
            this.crearCuadrado(res.bloquePiedra_png, 900,20+this.wallsWidth,10, 0);
            this.crearCuadrado(res.bloquePiedra_png, 940,20+this.wallsWidth,10, 0);
            //Segundo Piso
            this.crearCuadrado(res.bloquePiedra_png, 1060,60+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloquePiedra_png, 1100,60+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloquePiedra_png, 900,60+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloquePiedra_png, 940,60+this.wallsWidth,5, 0);
            this.crearCuadrado(res.vigaMaderaGrande_png, 1000, 90+this.wallsWidth,5,  0);
            //Tercer Piso
            this.crearCuadrado(res.bloqueMadera_png, 1100,120+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 1060,120+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 900,120+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 940,120+this.wallsWidth,5, 0);
            //Cuarto Piso
            this.crearCuadrado(res.bloqueMadera_png, 1100,160+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 1060,160+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 900,160+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 940,160+this.wallsWidth,5, 0);
            //Quinto Piso
            this.crearCuadrado(res.bloqueMadera_png, 1100,200+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 1060,200+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 900,200+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 940,200+this.wallsWidth,5, 0);
            //Sexto Piso
            this.crearCuadrado(res.bloqueMadera_png, 1100,240+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 1060,240+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 900,240+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 940,240+this.wallsWidth,5, 0);
            this.crearCuadrado(res.vigaMaderaGrande_png, 1000, 270+this.wallsWidth,5,  0);
            //Septimo Piso
            this.crearCuadrado(res.bloqueMadera_png, 1060,300+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 940, 300+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 1100,300+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 900, 300+this.wallsWidth,5, 0);
            //Octavo Piso
            this.crearCuadrado(res.bloqueMadera_png, 1060,340+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 940, 340+this.wallsWidth,5, 0);
            //Noveno Piso
            this.crearCuadrado(res.bloqueMadera_png, 1060,380+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 940, 380+this.wallsWidth,5, 0);
            this.crearCuadrado(res.vigaMaderaPequena_png, 1000, 410+this.wallsWidth,5,  0);
            //Decimo Piso
            this.crearCuadrado(res.bloqueMadera_png, 1040, 440+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 1000, 440+this.wallsWidth,5, 0);
            this.crearCuadrado(res.bloqueMadera_png, 960, 440+this.wallsWidth,5, 0);
            //11th Piso
            this.crearCuadrado(res.bloqueMadera_png, 1000, 480+this.wallsWidth, 5, 0);
            //12th Piso
            this.crearCuadrado(res.bloqueMadera_png, 1000, 520+this.wallsWidth,5, 0);
        
        
            //Creando el listener para el touch
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                 swallowTouches: true,
                 onTouchBegan: this.AgarrarPajaro,
                 onTouchMoved: this.MoverPajaro,
                 onTouchEnded: this.LanzarPajaro
            }, this);
        
        
        return true;
    }
});


var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});


