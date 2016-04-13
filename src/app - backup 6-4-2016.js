

var HelloWorldLayer = cc.Layer.extend({
	pelota:null,
	suelo:null,
	fondo:null,
	winSize:null,
    space:null,
    slingshot:null,
    random: function(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	},
    crearMuros: function(filename){
        var WALLS_WIDTH = 5;
        var WALLS_ELASTICITY = 0.5;
        var WALLS_FRICTION = 1;
        
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
    crearCirculo: function(filename, x, y){
        var circle = cc.Sprite.create(filename);
        var mass = 10;

        var nodeSize = circle.getContentSize(),
            phNode = cc.PhysicsSprite.create(filename),
            phBody = null,
            phShape = null,
            scaleX = 1,
            scaleY = 1;
        nodeSize.width *= scaleX;
        nodeSize.height *= scaleY;

        phBody = this.space.addBody(new cp.Body(mass, cp.momentForBox(mass, nodeSize.width, nodeSize.height)));
        phBody.setPos(cc.p(x, y));
		 
        phShape = this.space.addShape(new cp.CircleShape(phBody, nodeSize.width * 0.5, cc.p(0, 0)));
        phShape.setFriction(0.5);
        phShape.setElasticity(1);

        phNode.setBody(phBody);
        phNode.setRotation(0);
        phNode.setScale(1);

        this.addChild(phNode);  
    },
    crearCuadrado: function(filename, x, y, rotacion){
        var box = cc.Sprite.create(filename);
        var mass = 10;

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
    ctor:function () {
        this._super();
        this.winSize = cc.winSize;
        
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
        
        //---CREANDO UNA PELOTA/BOLA FISICA ------------------------------------------------------------------------------------------------
        var bolas = [res.bola2_png, res.bola3_png, res.bola4_png, res.bola5_png, res.bola6_png, res.bola7_png];
        for(var i = 0; i < 3; i++){
            this.crearCirculo(bolas[this.random(0,5)], this.winSize.width/2, this.winSize.height/2);
        }
        
        
        //--- CREANDO UN CUADRADO Y UN RECTANGULO
    /*
        for(var i = 0; i < 5; i++){
            this.crearCuadrado(res.cubo_png);
            this.crearCuadrado(res.rectangulo_png);
        }
    */
    
        //--- CREANDO UN OBJETO ESTATICO
        //this.crearObjetoEstatico(res.rectangulo_png);
        
        //--- CREANDO UNA RAMPA
    /*
        var ramp = this.space.addShape(new cp.SegmentShape(this.space.staticBody, cp.v(200, 120), cp.v(800, 320), 10));
	    ramp.setElasticity(1);
	    ramp.setFriction(1);
    */
        
        //--- COLOCANDO TIRAPIEDRAS ------------
        this.slingshot = new cc.Sprite(res.slingShot_png);
        this.slingshot.setScale(1.2);
        this.slingshot.setPosition(180,130);
        this.addChild(this.slingshot, 1);
        
        //--- CREANDO UN NIVEL DE PRUEBA -------------------------------------------------------------------
            // primer piso
            this.crearCuadrado(res.rectangulo_png, 750,55,0);            // cX 150, Yh - 100, rX 200, Yhr 150,
            this.crearCuadrado(res.cubo_png, 600,55,0);
            this.crearCuadrado(res.cubo_png, 900,55,0);

            // Segundo piso
            this.crearCuadrado(res.enemigo_png, 750, 155, 0); // Enemigo
            this.crearCuadrado(res.rectangulo_png, 650,205,90);
            this.crearCuadrado(res.rectangulo_png, 850,205,90);
        
            // Tercer Piso
            this.crearCuadrado(res.rectangulo_png, 750, 355,0);
        
            //Cuarto Piso
            this.crearCuadrado(res.cubo_png, 750, 455,0);
        
            //Quinto Piso
            this.crearCuadrado(res.enemigo_png, 750, 555, 0); // Enemigo
            //this.crearCirculo(res.enemigo_png, 750, 545);
        
        
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


