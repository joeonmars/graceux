goog.provide( 'gux.controllers.Intro' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.math.Size' );
goog.require( 'goog.net.XhrIo' );
goog.require( 'gux.controllers.Loader' );
goog.require( 'gux.fx.Shape' );


gux.controllers.Intro = function() {

	goog.base( this );

	this.el = goog.dom.getElement( 'main-intro' );

	this._canvasContainer = goog.dom.query( '.canvas-container', this.el )[ 0 ];
	this._bottomBar = goog.dom.query( '.bottom-bar', this.el )[ 0 ];
	this._quotation = goog.dom.query( '.quotation', this.el )[ 0 ];
	this._maxResolution = new goog.math.Size( 1280, 1080 );

	this._maskRatio = 1;
	this._shapeBaseScale = 0;

	// create two canvas
	this._two = new Two().appendTo( this._canvasContainer );

	this._whiteBg = this._two.makeRectangle( 0, 0, 1, 1 );
	this._whiteBg.fill = '#ffffff';
	this._whiteBg.noStroke();

	this._shadowU = this.createPolygon( gux.fx.Shape.Vector.U, gux.fx.Shape.Color.BLACK, .05 );
	this._shapeU = this.createPolygon( gux.fx.Shape.Vector.U, gux.fx.Shape.Color.BLUE );
	this._strokeU = this.createPolygon( gux.fx.Shape.Vector.U, gux.fx.Shape.Color.BLUE, .2, true );

	this._shadowXBottom = this.createPolygon( gux.fx.Shape.Vector.X_BOTTOM, gux.fx.Shape.Color.BLACK, .05 );
	this._shapeXBottom = this.createPolygon( gux.fx.Shape.Vector.X_BOTTOM, gux.fx.Shape.Color.GREEN );
	this._strokeXBottom = this.createPolygon( gux.fx.Shape.Vector.X_BOTTOM, gux.fx.Shape.Color.GREEN, .2, true );

	this._shadowXTop = this.createPolygon( gux.fx.Shape.Vector.X_TOP, gux.fx.Shape.Color.BLACK, .05 );
	this._shapeXTop = this.createPolygon( gux.fx.Shape.Vector.X_TOP, gux.fx.Shape.Color.YELLOW );
	this._strokeXTop = this.createPolygon( gux.fx.Shape.Vector.X_TOP, gux.fx.Shape.Color.YELLOW, .2, true );

	this._shadowG = this.createPolygon( gux.fx.Shape.Vector.G, gux.fx.Shape.Color.BLACK, .05 );
	this._shapeG = this.createPolygon( gux.fx.Shape.Vector.G, gux.fx.Shape.Color.RED );
	this._strokeG = this.createPolygon( gux.fx.Shape.Vector.G, gux.fx.Shape.Color.RED, .2, true );

	var openingQ1 = this.createPolygon( gux.fx.Shape.Vector.OPENING_QUOTE, gux.fx.Shape.Color.BLACK, .2, true );
	var openingQ2 = this.createPolygon( gux.fx.Shape.Vector.OPENING_QUOTE, gux.fx.Shape.Color.BLACK, .2, true );
	openingQ2.translation.x = 9;
	this._openingQGroup = this._two.makeGroup( openingQ1, openingQ2 );

	var closingQ1 = this.createPolygon( gux.fx.Shape.Vector.CLOSING_QUOTE, gux.fx.Shape.Color.BLACK, .2, true );
	var closingQ2 = this.createPolygon( gux.fx.Shape.Vector.CLOSING_QUOTE, gux.fx.Shape.Color.BLACK, .2, true );
	closingQ2.translation.x = 9;
	this._closingQGroup = this._two.makeGroup( closingQ1, closingQ2 );

	this._backGroup = this._two.makeGroup(
		this._strokeG, this._strokeU, this._strokeXTop, this._strokeXBottom,
		this._openingQGroup, this._closingQGroup
	);

	this._letterGroup = this._two.makeGroup(
		this._shadowU, this._shapeU, this._shadowG, this._shapeG,
		this._shadowXTop, this._shapeXTop, this._shadowXBottom, this._shapeXBottom
	);

	this._foreGroup = this._two.makeGroup(
		this._whiteBg, this._letterGroup
	);

	this._mask = this._two.makeRectangle( 0, 0, 1, 1 );

	this._foreGroup.mask = this._mask;

	// props
	this._shapeConfig = {
		g: {
			baseX: 0,
			baseY: 0,
			slideY: 0,
			scale: 0,
			shadowOffset: 0
		},
		u: {
			baseX: 0,
			baseY: 0,
			slideY: 0,
			scale: 0,
			shadowOffset: 0
		},
		xTop: {
			baseX: 0,
			baseY: 0,
			slideY: 0,
			scale: 0,
			shadowOffset: 0
		},
		xBottom: {
			baseX: 0,
			baseY: 0,
			slideY: 0,
			scale: 0,
			shadowOffset: 0
		},
		openingQ: {
			baseX: 0,
			slideY: 0
		},
		closingQ: {
			baseX: 0,
			slideY: 0
		}
	};

	//
	this._eventHandler = new goog.events.EventHandler( this );

	this._loader = new gux.controllers.Loader( 'global', {
		'g-spinner': gux.Config[ 'imagesPath' ] + 'g-spinner.gif',
		'u-spinner': gux.Config[ 'imagesPath' ] + 'u-spinner.gif',
		'x-spinner': gux.Config[ 'imagesPath' ] + 'x-spinner.gif',
		'gux-spinner': gux.Config[ 'imagesPath' ] + 'gux-spinner.gif',
		'about-masthead': gux.Config[ 'imagesPath' ] + 'about-masthead.jpg',
		'labs-masthead': gux.Config[ 'imagesPath' ] + 'labs-masthead.jpg'
	}, 1 );
};
goog.inherits( gux.controllers.Intro, goog.events.EventTarget );
goog.addSingletonGetter( gux.controllers.Intro );


gux.controllers.Intro.prototype.activate = function() {

	this.resize();

	this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );
	this._eventHandler.listen( this._loader, gux.events.EventType.ANIMATE_COMPLETE, this.onLoadAnimateComplete, false, this );

	TweenMax.ticker.addEventListener( 'tick', this.update, this );

	// animate in
	var timeline = new TimelineMax( {
		'delay': 0.5,
		'onComplete': this.onTypeTransitionComplete,
		'onCompleteScope': this
	} );

	var startY = this._two.height * 1.5;
	var endY = 0;
	var tweeners = [];
	goog.object.forEach( this._shapeConfig, function( config ) {
		var tweener = TweenMax.fromTo( config, 1.5, {
			slideY: startY,
			scale: 0
		}, {
			slideY: endY,
			scale: 1,
			'ease': Strong.easeOut
		} );

		tweeners.push( tweener );
	} );
	timeline.add( tweeners, '+=0', 'start', .05 );

	//
	goog.Timer.callOnce( function() {
		goog.dom.classlist.enable( this.el, 'animate-in-ui', true );
	}, 1400, this );

	goog.Timer.callOnce( function() {
		goog.dom.classlist.enable( this.el, 'animate-in-loader', true );
	}, 2500, this );

	//
	gux.mainScroller.lock( 0 );
};


gux.controllers.Intro.prototype.deactivate = function() {

	this._eventHandler.removeAll();

	TweenMax.ticker.removeEventListener( 'tick', this.update, this );

	gux.mainScroller.unlock();
};


gux.controllers.Intro.prototype.disposeInternal = function() {

	goog.base( this, 'disposeInternal' );

	this.deactivate();

	this._loader.dispose();
};


gux.controllers.Intro.prototype.createPolygon = function( vector, hex, opt_opacity, opt_stroke ) {

	var flattenedVectors = [];

	var anchors = goog.array.forEach( vector, function( v ) {
		flattenedVectors.push( v[ 0 ] * 10, v[ 1 ] * 10 );
	} );

	var polygon = this._two.makePath.apply( this._two, flattenedVectors );
	polygon.opacity = goog.isNumber( opt_opacity ) ? opt_opacity : 1;

	if ( opt_stroke ) {
		polygon.linewidth = .25;
		polygon.stroke = hex;
		polygon.noFill();
	} else {
		polygon.fill = hex;
		polygon.noStroke();
	}

	return polygon;
};


gux.controllers.Intro.prototype.updateMask = function() {

	var halfWidth = this._two.width / 2;
	var halfHeight = this._two.height / 2;

	var maskY = goog.math.lerp( -halfHeight, halfHeight, this._maskRatio );
	this._mask.translation.set( halfWidth, maskY );
};


gux.controllers.Intro.prototype.update = function() {

	var config = this._shapeConfig;

	this._shapeG.translation.set( config.g.baseX, config.g.baseY + config.g.slideY );
	this._shadowG.translation.set( config.g.baseX + config.g.shadowOffset, config.g.baseY + config.g.shadowOffset + config.g.slideY );
	this._strokeG.translation.copy( this._shapeG.translation );

	this._shapeG.scale = this._shadowG.scale = this._strokeG.scale = this._shapeBaseScale * config.g.scale;

	this._shapeU.translation.set( config.u.baseX, config.u.baseY + config.u.slideY );
	this._shadowU.translation.set( config.u.baseX + config.u.shadowOffset, config.u.baseY + config.u.shadowOffset + config.u.slideY );
	this._strokeU.translation.copy( this._shapeU.translation );

	this._shapeU.scale = this._shadowU.scale = this._strokeU.scale = this._shapeBaseScale * config.u.scale;

	this._shapeXTop.translation.set( config.xTop.baseX, config.xTop.baseY + config.xTop.slideY );
	this._shadowXTop.translation.set( config.xTop.baseX + config.xTop.shadowOffset, config.xTop.baseY + config.xTop.shadowOffset + config.xTop.slideY );
	this._strokeXTop.translation.copy( this._shapeXTop.translation );

	this._shapeXTop.scale = this._shadowXTop.scale = this._strokeXTop.scale = this._shapeBaseScale * config.xTop.scale;

	this._shapeXBottom.translation.set( config.xBottom.baseX, config.xBottom.baseY + config.xBottom.slideY );
	this._shadowXBottom.translation.set( config.xBottom.baseX + config.xBottom.shadowOffset, config.xBottom.baseY + config.xBottom.shadowOffset + config.xBottom.slideY );
	this._strokeXBottom.translation.copy( this._shapeXBottom.translation );

	this._shapeXBottom.scale = this._shadowXBottom.scale = this._strokeXBottom.scale = this._shapeBaseScale * config.xBottom.scale;

	this._openingQGroup.scale = this._shapeBaseScale / 2.25;
	this._closingQGroup.scale = this._shapeBaseScale / 2.25;

	this._openingQGroup.translation.set( config.openingQ.baseX, config.openingQ.slideY );
	this._closingQGroup.translation.set( config.closingQ.baseX, config.closingQ.slideY );

	//
	this._two.update();
};


gux.controllers.Intro.prototype.resize = function() {

	var canvasSize = goog.style.getSize( this._canvasContainer );

	var resWidth, resHeight;

	if ( this._maxResolution.aspectRatio() > canvasSize.aspectRatio() ) {
		resWidth = Math.min( this._maxResolution.width, canvasSize.width );
		resHeight = resWidth / canvasSize.aspectRatio();
	} else {
		resHeight = Math.min( this._maxResolution.height, canvasSize.height );
		resWidth = resHeight * canvasSize.aspectRatio();
	}

	var scale = Math.min( Math.max( 260, resHeight * .4 ), resWidth * .3 );
	this._shapeBaseScale = scale / 10;

	this._two.width = canvasSize.width;
	this._two.height = canvasSize.height;
	this._two.update();

	// resize bg
	this._whiteBg.scale = Math.max( this._two.width, this._two.height );
	this._whiteBg.translation.set( this._two.width / 2, this._two.height / 2 );

	//
	var margin = Math.max( 6, scale * .06 );
	var startX = ( this._two.width - ( scale / 2 + margin + scale + margin + scale / 2 ) ) / 2;
	var startY = this._two.height * .52;

	var config = this._shapeConfig;
	config.g.baseX = startX;
	config.g.baseY = startY;
	config.g.shadowOffset = scale * .1;

	config.u.baseX = startX + scale + margin;
	config.u.baseY = startY;
	config.u.shadowOffset = scale * .08;

	config.xTop.baseX = startX + scale * 2 + margin * 2;
	config.xTop.baseY = startY - scale / 4;
	config.xTop.shadowOffset = scale * .05;

	config.xBottom.baseX = startX + scale * 2 + margin * 2;
	config.xBottom.baseY = startY + scale / 4;
	config.xBottom.shadowOffset = scale * .05;

	config.openingQ.baseX = this._two.width * .07;
	config.closingQ.baseX = this._two.width * .8;

	// test mask
	var halfWidth = canvasSize.width / 2;
	var halfHeight = canvasSize.height / 2;

	goog.array.forEach( this._mask.vertices, function( v, i ) {
		switch ( i ) {
			case 0:
				v.x = -halfWidth;
				v.y = -halfHeight;
				break;

			case 1:
				v.x = halfWidth;
				v.y = -halfHeight;
				break;

			case 2:
				v.x = halfWidth;
				v.y = halfHeight;
				break;

			case 3:
				v.x = -halfWidth;
				v.y = halfHeight;
				break;
		}
	} );

	this.updateMask();

	//
	this.update();
};


gux.controllers.Intro.prototype.onTypeTransitionComplete = function() {

	goog.dom.classlist.addRemove( this._bottomBar, 'hide', 'show' );

	this._loader.load();
};


gux.controllers.Intro.prototype.onLoadAnimateComplete = function( e ) {

	console.log( "LOAD ANIMATE COMPLETE!", e.assets );

	// animate mask
	TweenMax.to( this, 1, {
		_maskRatio: 0,
		'ease': Quad.easeInOut,
		'onUpdate': this.updateMask,
		'onUpdateScope': this
	} );

	// animate indicator
	goog.dom.classlist.addRemove( this._bottomBar, 'show', 'hide' );

	// animate quotation
	goog.dom.classlist.enable( this._quotation, 'animate-in', true );

	var config = this._shapeConfig;

	TweenMax.fromTo( config.openingQ, 2, {
		slideY: this._two.height + this._shapeBaseScale
	}, {
		slideY: this._two.height * .3,
		'delay': 0.7,
		'ease': Expo.easeOut
	} );

	TweenMax.fromTo( config.closingQ, 2, {
		slideY: this._two.height + this._shapeBaseScale
	}, {
		slideY: this._two.height * .45,
		'delay': 0.9,
		'ease': Expo.easeOut
	} );

	// animate out
	TweenMax.to( this.el, 1, {
		'y': '-100%',
		'display': 'none',
		'delay': 4,
		'ease': Strong.easeInOut,
		'onComplete': function() {
			this.dispatchEvent( gux.events.EventType.ANIMATE_OUT_COMPLETE );
			this.dispose();
		},
		'onCompleteScope': this
	} );

	var mainContent = goog.dom.getElement( 'main-content' );
	TweenMax.fromTo( mainContent, 1, {
		'opacity': 0,
		'y': 150
	}, {
		'opacity': 1,
		'y': 0,
		'delay': 4,
		'ease': Strong.easeInOut,
		'clearProps': 'opacity, y'
	} );
};