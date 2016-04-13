var Elements = function ( node, shape, x, y ) {
    this.node = node;
    this.shape = shape;
    this.OrX = x;
    this.OrY = y;
    this.valid = true;
};

var HelloWorldLayer = cc.Layer.extend({
	pelota:null,
	suelo:null,
	fondo:null,
	winSize:null,
    space:null,
    slingshot:null, slingshot2:null, p1:null, p2:null, 
    wallsWidth:null,
    agarrado: null, pajarito:[], xi:null, xf:null, yi:null, yf:null, limiteResorteX:null, limiteResorteY:null, sprite:[], puntoLanzamiento:null,
    curPlayer:null,
    animate:null, //accion de la animacion de desaparicion de personajes
    muertos:null,
    characters:[], 
    estirando:false,
    vigas:[],
    vuelos:[],
    
    random: function(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	},
    crearMuros: function(filename){
        var WALLS_WIDTH = 5;
        var WALLS_ELASTICITY = 0.5;
        var WALLS_FRICTION = 1;
        var alturaPiso = 35;
        
        this.wallsWidth = WALLS_WIDTH + alturaPiso;
        
        leftWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, 0), new cp.v(0, this.winSize.height), WALLS_WIDTH);
        leftWall.setElasticity(WALLS_ELASTICITY);
        leftWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(leftWall);

        rightWall = new cp.SegmentShape(this.space.staticBody, new cp.v(this.winSize.width, this.winSize.height), new cp.v(this.winSize.width, 0), WALLS_WIDTH);
        rightWall.setElasticity(WALLS_ELASTICITY);
        rightWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(rightWall);

        bottomWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, alturaPiso), new cp.v(this.winSize.width, alturaPiso), WALLS_WIDTH);
        bottomWall.setElasticity(WALLS_ELASTICITY);
        bottomWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(bottomWall);

        upperWall = new cp.SegmentShape(this.space.staticBody, new cp.v(0, this.winSize.height), new cp.v(this.winSize.width, this.winSize.height), WALLS_WIDTH);
        upperWall.setElasticity(WALLS_ELASTICITY);
        upperWall.setFriction(WALLS_FRICTION);
        this.space.addStaticShape(upperWall);
          
    },
    crearCirculo: function(filename, x, y, masa, personaje){
        // El atributo personaje debe ser 0 o 1.
        // 1 - Joa
        // 2- Morillo
        // 3 - Raydelto
        // 0 - Es un enemigo (Cerditos)
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
        
        if(personaje){
            phBody = new cp.Body(mass, cp.momentForBox(mass, nodeSize.width, nodeSize.height));
        }else{
             phBody = this.space.addBody(new cp.Body(mass, cp.momentForBox(mass, nodeSize.width, nodeSize.height)));
             // anadirlo en un arreglo de enemigos para utilizarlo en la comprobacion de colisiones.
        }
        
        phBody.setPos(cc.p(x, y));
		 
        phShape = this.space.addShape(new cp.CircleShape(phBody, nodeSize.width * 0.5, cc.p(0, 0)));
        phShape.setFriction(0.5);
        phShape.setElasticity(0);

        phNode.setBody(phBody);
        phNode.setRotation(0);
        phNode.setScale(1);
        
        if(personaje){
            this.sprite.push(phNode);
            this.pajarito.push(phBody);
            // Anadirlo a un arreglo de los personajes para utilizarlo en la comprobacion de colisiones.
        }
        //phBody.setVel(cp.v(600,600));
        
        this.addChild(phNode, 2);
        if(!personaje){
            this.characters.push( new Elements(phNode, phShape, x, y) );
        }
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
        //shape.setFriction(0.5);
        shape.setFriction(1);
        shape.setElasticity(0);

        phNode.setBody(phBody);
        phNode.setRotation(rotacion);
        phNode.setScale(1);
        
        this.vigas.push(new Elements(phNode, phShape, x, y));
        
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
        
        if(juego.curPlayer < 3){
            var box = juego.sprite[juego.curPlayer].getBoundingBox();
       
            if(cc.rectContainsPoint(box, location.getLocation())){
                juego.agarrado = true;
                cc.log("AGARRADO!!!!");
                //cc.audioEngine.playEffect(res.MorilloI);
                // juego.xi = juego.pajarito.getLocationX();
            }
        
            return true;
        }
        return false;
        
    },
    MoverPajaro : function(location, event){
        var juego = event.getCurrentTarget();
        
        cc.log("Hola mover?")
       if(juego.agarrado){
            cc.log("MOVIENDO???");
           var ubicacion = location.getLocation();
           
           if(ubicacion.x > juego.xi - juego.limiteResorteX && ubicacion.x < juego.xi){
            juego.sprite[juego.curPlayer].setPositionX(ubicacion.x);
           }
           if(ubicacion.y > juego.yi - juego.limiteResorteY && ubicacion.y < juego.yi){
            juego.sprite[juego.curPlayer].setPositionY(ubicacion.y);
           }
           
           juego.estirarCuerda(juego.sprite[juego.curPlayer].getPositionX() - juego.sprite[juego.curPlayer].getContentSize().width/2,
                               juego.sprite[juego.curPlayer].getPositionY());
           
          
       }
        return true;
        
    },
    LanzarPajaro : function(location, event){
        var juego = event.getCurrentTarget();
        
        juego.xf = juego.sprite[juego.curPlayer].getPositionX();
        juego.yf = juego.sprite[juego.curPlayer].getPositionY();
        
        cc.log("Hola lanzar?")
        if(juego.agarrado){
            cc.log("LANZADO!!!!!");
            var vx = 200 + (4*(juego.xi - juego.xf));
            var vy = 200 + (4*(juego.yi - juego.yf));
            juego.pajarito[juego.curPlayer].setVel(cp.v(vx, vy));
            
            juego.space.addBody(juego.pajarito[juego.curPlayer]);
            cc.audioEngine.playEffect(juego.vuelos[juego.curPlayer]);
            juego.resetearCuerda();
            juego.agarrado = false;
            juego.estirando = false;
           // juego.pajarito.pop();
            /* LOS PROFESORES YA NO VAN A MORIR */
//            if(juego.curPlayer){
//                 juego.matarPersonajes(juego.sprite[juego.curPlayer-1]);
//            }
            juego.curPlayer++;
            if(juego.curPlayer < 3){
                juego.animarPajaros(juego.sprite[juego.curPlayer], 180, juego.puntoLanzamiento);
            }else{
                // delay de cierto tiempo
                // juego.matarPersonajes(juego.sprite[juego.curPlayer]);
            }
            
        }
        
        return true;
        
    },
    estirarCuerda: function(x, y){
        this.goma1.clear();
        this.goma2.clear();
        var ancho = 9;
        
        cc.log(this.xi - x);
        
        if(this.xi - x > 150){
            ancho = 6;
        }else if(this.xi - x > 125){
            ancho = 7;
        }else if(this.xi - x > 100){
            if(!this.estirando){
                cc.audioEngine.playEffect(res.estiramiento);
                this.estirando = true;
            }
            ancho = 8;
        }else if(this.xi - x < 100){
            this.estirando = false;
        }
        
        this.goma1.drawSegment(this.p1, cc.p(x,y), ancho, cc.color(35,22,8));
        this.goma2.drawSegment(cc.p(140,170+this.wallsWidth), cc.p(x,y), ancho, cc.color(48,22,8));
    },
    resetearCuerda: function(){
        this.goma1.clear();
        this.goma2.clear();
        this.goma1.drawSegment(this.p1, this.p2, 7, cc.color(48,22,8));
        this.goma2.drawSegment(this.p2, this.p2, 9, cc.color(48,22,8));
    },
    animarPajaros: function(sprite, x1, y1){
        var moveTo1 = new cc.moveTo(2, cc.p(x1,  y1));
        var delay = cc.DelayTime.create(0.5);
        var moveEaseOut = cc.EaseBackOut.create(moveTo1);
        var sequencia = new cc.Sequence(delay, moveEaseOut);
        sprite.runAction(sequencia);
    },
    
    eliminarMuertos: function(element){
        
        this.muertos +=1;
        this.removeChild(element.node, true);
        this.space.removeShape(element.shape);
        
        
    },
    
    matarPersonaje : function(){
        for(var i=0; i<this.characters.length; i++){
            if( this.characters[i].valid && ( Math.abs(this.characters[i].node.getPositionX()-this.characters[i].OrX) >=40 || Math.abs(this.characters[i].node.getPositionY()-this.characters[i].OrY) >= 40 ) ){
                             
                // Creando la animacion y guardandola en una variable
                var explosion = new cc.Sprite(res.explosion_png);
                var animFrames = [];
                var y = 125;
                for(var j = 0; j < 6; j++){
                    animFrames.push(new cc.SpriteFrame(res.explosion_png, cc.rect(0, y*j, 125, 100)));
                }
                var animacion = new cc.Animation(animFrames, 0.1);
                this.animate = new cc.animate(animacion);
                
                this.characters[i].node.runAction(this.animate);
                this.characters[i].valid = false;
                cc.audioEngine.playEffect(res.destroyed);
                setTimeout(this.eliminarMuertos.bind(this, this.characters[i]), 1250);
                
            }
            
        }
        
        //this.puntuacion();
    },
    puntuacion: function(){
        cc.log("Adentro"+this.muertos);
        var calificacion = 'F';
        if(this.muertos >= 4 || this.curPlayer >= 3){
        this.unschedule(this.matarPersonaje);
        if(this.muertos >= 4 && this.curPlayer === 1)
            {
                calificacion = 'A';
            }
           else if (this.muertos >= 4 && this.curPlayer === 2)
                {
                calificacion = 'B';
            }
            else if (this.muertos >= 4 && this.curPlayer === 3)
                {
                calificacion = 'C';
            }
        this.unschedule(this.puntuacion);
        this.addChild(new AfterGameLayer(calificacion),5);
        }
        
    },
   EfectoForce: function(){
        for(var i=0; i<this.vigas.length; i++){
            if( this.vigas[i].valid && ( Math.abs(this.vigas[i].node.getPositionX()-this.vigas[i].OrX) >=20 || Math.abs(this.vigas[i].node.getPositionY()-this.vigas[i].OrY) >= 20 ) ){
                cc.audioEngine.playEffect(res.golpeARoca);    
                this.vigas[i].valid = false;
                
            }
        }
    },
    ctor:function () {
        this._super();
        this.winSize = cc.winSize;
        
        this.agarrado = false;
        this.xi = 180;
        this.xf =0;
        this.yi = 180+this.wallsWidth;
        this.yf = 0;
        this.limiteResorteX = 150;
        this.limiteResorteY = 100;
        this.curPlayer= 0;
        this.muertos = 0;
        this.vuelos = [res.JoaFrase, res.MorilloFrase, res.RaydeltoFrase];
        this.vigas = [];
        this.pajarito = [];
        this.sprite = [];
        this.characters = [];
        cc.log("Player: "+this.curPlayer);
        cc.log("Muertos:"+ this.muertos);
        
        //---CREANDO UN ESPACION DE FISICAS --------------------------------------------------------------------------------------------------
        this.space = new cp.Space();
        this.space.iterations = 100;
        this.space.gravity = cp.v(0, -400);  
        this.space.sleepTimeThreshold = Infinity;
        this.space.colisionSlop = Infinity;
		
        // MODO DEBUG DEL ENGINE DE FISICAS
		//var phDebugNode = cc.PhysicsDebugNode.create(this.space);
		//this.addChild(phDebugNode, 10);
        
        var update = function() { 
            this.space.step(1/60);
        }
		
		this.schedule(update);
        this.schedule(this.matarPersonaje, 0.1);
        this.schedule(this.puntuacion,5);
        
        //--- COLOCANDO IMAGEN DE FONDO -----------------------------------------------------------------------------------------------------
        this.fondo = new cc.Sprite(res.fondo_png);
        this.fondo.setPosition(this.winSize.width/2, this.winSize.height/2);
        this.fondo.setScale(1.2, 1);
        this.addChild(this.fondo);
 
        //---CREANDO MUROS -------------------------------------------------------------------------------------------------------------------
        this.crearMuros();
    
        //---CREANDO PAJARITO DE PRUEBA ------------------------------------------------------------------------------------------------
        this.puntoLanzamiento = 180 + this.wallsWidth;
        this.crearCirculo(res.Joa_png, 180, this.puntoLanzamiento, 100, 1);
        this.crearCirculo(res.Morillo_png, 120, 50+this.wallsWidth, 100, 1);
        this.crearCirculo(res.Raydelto_png, 50, 50+this.wallsWidth, 100, 1);
        
        //--- COLOCANDO TIRAPIEDRAS ------------
        
        this.slingshot = new cc.Sprite(res.slingShot_png);
        this.slingshot.setPosition(180,105+this.wallsWidth);
        this.addChild(this.slingshot, 1);
        
        this.slingshot2 = new cc.Sprite(res.slingShot2_png);
        this.slingshot2.setPosition(155,145+this.wallsWidth);
        this.addChild(this.slingshot2, 4);
        
        this.p1 = cc.p(180,170+this.wallsWidth);
        this.p2 = cc.p(155,170+this.wallsWidth);
        
        this.goma1 =  new cc.DrawNode(); // Trasera
        this.goma1.drawSegment(this.p1, this.p2, 7, cc.color(48,22,8));
        this.addChild(this.goma1, 1);
        
        this.goma2 =  new cc.DrawNode(); // Delantera
        this.goma2.drawSegment(this.p2, this.p2,9, cc.color(48,22,8));
        this.addChild(this.goma2, 3);
        
        
        //--- CREANDO UN NIVEL DE PRUEBA ---------------------------------------------------------------
        
            var mPiedra = 1000;
            var mMadera = 7;
            var mVigas = 5;
            var mEnemigos = 3;
        
            var baseY=20;
            var vigaAdding = 0;
            for(var j=0; j<12; j++){
                var baseX = 900;
                for(var i=0; i<9; i++){
                    if(i%3==0){
                        this.crearCuadrado(res.bloqueGC_png, baseX + i*50, baseY + j*40+vigaAdding+this.wallsWidth, 20, 0);    
                    }
                }
                if(j!=0 && j%4==0){
                    vigaAdding += 40;
                    this.crearCuadrado(res.vigaGC_png, 1050, baseY + j*40+vigaAdding+this.wallsWidth, 20, 0);
                }
            }
        
            this.crearCuadrado(res.vigaGC_png, 1050, baseY + j*40+vigaAdding+this.wallsWidth, 20, 0);
            this.crearCirculo(res.Nathalia_png, 970, 280, 20, 0); // Nathalia
            this.crearCirculo(res.Mabel_png, 1150, 280, 20, 0);// Mabel
            this.crearCirculo(res.Carlos_png, 1150, 480, 20, 0);// Carlos
            this.crearCirculo(res.Frederick_png, 970, 480, 20, 0);// Frederick
        
        
            //---INICIANDO LA MUSICA-------------------------------------------------------------------------------------------------
            cc.audioEngine.setMusicVolume(0.7);
            cc.audioEngine.playMusic(res.ambiente);
            //cc.audioEngine.playEffect(res.next);
            this.schedule(this.EfectoForce, 0.5);
            
            //Creando el listener para el touch
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                 swallowTouches: true,
                 onTouchBegan: this.AgarrarPajaro,
                 onTouchMoved: this.MoverPajaro,
                 onTouchEnded: this.LanzarPajaro
            }, this);
         /*var AGLayer = new AfterGameLayer(1);
        this.addchild(AGLayer);*/
      
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