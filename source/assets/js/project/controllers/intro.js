goog.provide( 'gux.controllers.Intro' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.math.Size' );
goog.require( 'gux.fx.Shape' );


gux.controllers.Intro = function() {

	this.el = goog.dom.getElement( 'main-intro' );

	this._canvas = goog.dom.query( 'canvas', this.el )[ 0 ];
	this._maxResolution = new goog.math.Size( 1280, 1080 );

	this._shape = gux.fx.Shape.getInstance();

	this._renderer = new PIXI.autoDetectRenderer( null, null, {
		view: this._canvas,
		backgroundColor: 0xffffff,
		antialias: true
	} );

	this._stage = new PIXI.Container();
	this._shapeContainer = new PIXI.Container();
	this._shadowContainer = new PIXI.Container();

	this._stage.addChild( this._shadowContainer );
	this._stage.addChild( this._shapeContainer );

	//
	this._shapeG = this._shape.generateGraphics( gux.fx.Shape.Vector.G, gux.fx.Shape.Color.RED, .5, .5 );
	this._shapeContainer.addChild( this._shapeG );

	this._shadowG = this._shape.generateGraphics( gux.fx.Shape.Vector.G, gux.fx.Shape.Color.LIGHT_GRAY, .44, .44 );
	this._shadowContainer.addChild( this._shadowG );

	//
	this._shapeU = this._shape.generateGraphics( gux.fx.Shape.Vector.U, gux.fx.Shape.Color.BLUE, .5, .5 );
	this._shapeContainer.addChild( this._shapeU );

	this._shadowU = this._shape.generateGraphics( gux.fx.Shape.Vector.U, gux.fx.Shape.Color.LIGHT_GRAY, .38, .38 );
	this._shadowContainer.addChild( this._shadowU );

	//
	this._shapeXBottom = this._shape.generateGraphics( gux.fx.Shape.Vector.X_BOTTOM, gux.fx.Shape.Color.GREEN, .5, .5 );
	this._shapeContainer.addChild( this._shapeXBottom );

	this._shadowXBottom = this._shape.generateGraphics( gux.fx.Shape.Vector.X_BOTTOM, gux.fx.Shape.Color.LIGHT_GRAY, .45, .45 );
	this._shadowContainer.addChild( this._shadowXBottom );

	//
	this._shapeXTop = this._shape.generateGraphics( gux.fx.Shape.Vector.X_TOP, gux.fx.Shape.Color.YELLOW, .5, .5 );
	this._shapeContainer.addChild( this._shapeXTop );

	this._shadowXTop = this._shape.generateGraphics( gux.fx.Shape.Vector.X_TOP, gux.fx.Shape.Color.LIGHT_GRAY, .45, .45 );
	this._shadowContainer.addChild( this._shadowXTop );

	//
	this._eventHandler = new goog.events.EventHandler( this );
	this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );

	TweenMax.ticker.addEventListener( 'tick', this.update, this );

	this.resize();
};
goog.inherits( gux.controllers.Intro, goog.events.EventTarget );
goog.addSingletonGetter( gux.controllers.Intro );


gux.controllers.Intro.prototype.activate = function() {

};


gux.controllers.Intro.prototype.deactivate = function() {

};


gux.controllers.Intro.prototype.update = function() {

	this._renderer.render( this._stage );
};


gux.controllers.Intro.prototype.resize = function() {

	var canvasSize = goog.style.getSize( this._canvas );

	var resWidth, resHeight;

	if ( this._maxResolution.aspectRatio() > canvasSize.aspectRatio() ) {
		resWidth = Math.min( this._maxResolution.width, canvasSize.width );
		resHeight = resWidth / canvasSize.aspectRatio();
	} else {
		resHeight = Math.min( this._maxResolution.height, canvasSize.height );
		resWidth = resHeight * canvasSize.aspectRatio();
	}

	var scale = Math.min( Math.max( 250, resHeight * .35 ), resWidth * .28 );

	this._shapeG.scale.set( scale );
	this._shadowG.scale.set( scale );

	this._shapeU.scale.set( scale );
	this._shadowU.scale.set( scale );

	this._shapeXTop.scale.set( scale );
	this._shadowXTop.scale.set( scale );

	this._shapeXBottom.scale.set( scale );
	this._shadowXBottom.scale.set( scale );

	var margin = Math.max( 6, scale * .06 );
	var startX = ( resWidth - ( scale * 2 + margin * 2 ) ) / 2;
	var y = resHeight * .55;

	this._shapeG.position.set( startX, y );
	this._shadowG.position.set( startX, y );

	this._shapeU.position.set( startX + scale + margin, y );
	this._shadowU.position.set( startX + scale + margin, y );

	this._shapeXTop.position.set( startX + scale * 2 + margin * 2, y );
	this._shadowXTop.position.set( startX + scale * 2 + margin * 2, y );

	this._shapeXBottom.position.set( startX + scale * 2 + margin * 2, y );
	this._shadowXBottom.position.set( startX + scale * 2 + margin * 2, y );

	this._renderer.resize( resWidth, resHeight );
};