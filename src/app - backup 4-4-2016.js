

var HelloWorldLayer = cc.Layer.extend({
	pelota:null,
	suelo:null,
	fondo:null,
	size:null,
    
    ctor:function () {
        this._super();
        this.size = cc.winSize;
        var winSize = this.size;
        
        //---CREANDO UN ESPACION DE FISICAS --------------------------------------------------------------------------------------------------
        var space = new cp.Space();
        space.iterations = 30;
        space.gravity = cp.v(0, -800);  
        space.sleepTimeThreshold = Infinity;
        space.colisionSlop = Infinity;
		
		var phDebugNode = cc.PhysicsDebugNode.create(space);
		this.addChild(phDebugNode, 10);
        
        var update = function() { 
            space.step(1/60);
        }
		
		this.schedule(update);
 
        //---CREANDO MUROS -------------------------------------------------------------------------------------------------------------------
        var WALLS_WIDTH = 5;
        var WALLS_ELASTICITY = 0.5;
        var WALLS_FRICTION = 1;
        
        leftWall = new cp.SegmentShape(space.staticBody, new cp.v(0, 0), new cp.v(0, winSize.height), WALLS_WIDTH);
        leftWall.setElasticity(WALLS_ELASTICITY);
        leftWall.setFriction(WALLS_FRICTION);
        space.addStaticShape(leftWall);

        rightWall = new cp.SegmentShape(space.staticBody, new cp.v(winSize.width, winSize.height), new cp.v(winSize.width, 0), WALLS_WIDTH);
        rightWall.setElasticity(WALLS_ELASTICITY);
        rightWall.setFriction(WALLS_FRICTION);
        space.addStaticShape(rightWall);

        bottomWall = new cp.SegmentShape(space.staticBody, new cp.v(0, 0), new cp.v(winSize.width, 0), WALLS_WIDTH);
        bottomWall.setElasticity(WALLS_ELASTICITY);
        bottomWall.setFriction(WALLS_FRICTION);
        space.addStaticShape(bottomWall);

        upperWall = new cp.SegmentShape(space.staticBody, new cp.v(0, winSize.height), new cp.v(winSize.width, winSize.height), WALLS_WIDTH);
        upperWall.setElasticity(WALLS_ELASTICITY);
        upperWall.setFriction(WALLS_FRICTION);
        space.addStaticShape(upperWall);
        
        //---CREANDO UNA PELOTA/BOLA FISICA ------------------------------------------------------------------------------------------------
        //#1
        var circle = cc.Sprite.create(res.bola_png);
        var mass = 10;

        //#2
        var nodeSize = circle.getContentSize(),
            phNode = cc.PhysicsSprite.create(res.bola_png),
            phBody = null,
            phShape = null,
            scaleX = 1,
            scaleY = 1;
        nodeSize.width *= scaleX;
        nodeSize.height *= scaleY;

        //#3
        phBody = space.addBody(new cp.Body(mass, cp.momentForBox(mass, nodeSize.width, nodeSize.height)));
        phBody.setPos(cc.p(winSize.width * 0.5, winSize.height * 0.5));

        //#4
        phShape = space.addShape(new cp.CircleShape(phBody, nodeSize.width * 0.5, cc.p(0, 0)));
        phShape.setFriction(0.5);
        phShape.setElasticity(1);

        //#5
        phNode.setBody(phBody);
        phNode.setRotation(0);
        phNode.setScale(1);

        this.addChild(phNode);
        
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


