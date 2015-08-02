goog.provide( 'gux.controllers.ImageViewer' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.events.MouseWheelHandler' );
goog.require( 'goog.fx.Dragger' );
goog.require( 'goog.userAgent' );
goog.require( 'goog.style' );
goog.require( 'gux.events' );
goog.require( 'gux.templates.Main' );


gux.controllers.ImageViewer = function() {

	goog.base( this );

	this._container = goog.dom.getElement( 'image-viewer-container' );
	this._refImg = null;
	this._image = null;
	this._imageContainer = null;
	this._slider = null;

	this._containerSize = null;
	this._margin = 20;
	this._minSize = new goog.math.Size( 1, 1 );
	this._maxSize = new goog.math.Size( 1, 1 );
	this._zoom = 0;
	this._maxMouseWheelDelta = 80;

	this._eventHandler = new goog.events.EventHandler( this );
	this._mouseWheelHandler = new goog.events.MouseWheelHandler( this._container );
	this._mouseWheelHandler.setMaxDeltaY( this._maxMouseWheelDelta );

	this._zoomTweener = null;

	this._zoomThrottle = new goog.Throttle( this.triggerZoom, 50, this );

	this._draggable = null;

	this._sliderDragger = null;

	this._hammer = null;
	this._lastPinchScale = 1;
};
goog.inherits( gux.controllers.ImageViewer, goog.events.EventTarget );
goog.addSingletonGetter( gux.controllers.ImageViewer );


gux.controllers.ImageViewer.prototype.open = function( refImg, largeSrc ) {

	this._refImg = refImg;

	var el = soy.renderAsFragment( gux.templates.Main.ImageViewer, {
		defaultSrc: refImg.src,
		largeSrc: largeSrc
	} );
	goog.dom.appendChild( this._container, el );

	this._image = goog.dom.getElementByClass( 'image', this._container );
	this._imageContainer = goog.dom.getElementByClass( 'image-container', this._container );

	var overlay = goog.dom.getElementByClass( 'overlay', this._container );
	var shadow = goog.dom.getElementByClass( 'shadow', this._container );

	var startPosition = goog.style.getPageOffset( refImg );
	var startSize = goog.style.getSize( refImg );

	this._maxSize.width = parseInt( refImg.getAttribute( 'data-max-width' ) );
	this._maxSize.height = parseInt( refImg.getAttribute( 'data-max-height' ) );

	this.dispatchEvent( gux.events.EventType.OPEN );

	// animate in
	goog.dom.classlist.enable( refImg, 'hidden-keep-layout', true );
	goog.dom.classlist.enable( shadow, 'show', true );
	goog.dom.classlist.enable( this._container, 'show', true );

	this.reset();
	this.updateSize();

	TweenMax.fromTo( this._imageContainer, .8, {
		'width': startSize.width,
		'height': startSize.height
	}, {
		'width': this._minSize.width,
		'height': this._minSize.height,
		'immediateRender': true,
		'ease': Cubic.easeInOut,
		'onComplete': this.onOpenComplete,
		'onCompleteScope': this
	} );

	TweenMax.fromTo( this._image, .8, {
		'left': startPosition.x + startSize.width / 2,
		'top': startPosition.y + startSize.height / 2
	}, {
		'left': '50%',
		'top': '50%',
		'immediateRender': true,
		'ease': Cubic.easeInOut
	} );

	TweenMax.fromTo( overlay, .8, {
		'height': 0
	}, {
		'height': '100%',
		'immediateRender': true,
		'ease': Cubic.easeInOut
	} );
};


gux.controllers.ImageViewer.prototype.close = function() {

	this._eventHandler.removeAll();

	this._zoomTweener.kill();
	this._zoomTweener = null;

	this._zoomThrottle.stop();

	this._draggable.kill();
	this._draggable = null;

	this._sliderDragger.dispose();
	this._sliderDragger = null;

	this._hammer.destroy();
	this._hammer = null;

	this.dispatchEvent( gux.events.EventType.CLOSE );

	// animate out
	var endPosition = goog.style.getPageOffset( this._refImg );
	var endSize = goog.style.getSize( this._refImg );

	var overlay = goog.dom.getElementByClass( 'overlay', this._container );
	var shadow = goog.dom.getElementByClass( 'shadow', this._container );
	var slider = goog.dom.getElementByClass( 'slider', this._container );

	goog.dom.classlist.enable( slider, 'show', false );
	goog.dom.classlist.enable( shadow, 'show', false );

	TweenMax.to( this._imageContainer, .65, {
		'width': endSize.width,
		'height': endSize.height,
		'ease': Cubic.easeInOut
	} );

	TweenMax.to( this._image, .65, {
		'x': 0,
		'y': 0,
		'left': endPosition.x + endSize.width / 2,
		'top': endPosition.y + endSize.height / 2,
		'ease': Cubic.easeInOut
	} );

	TweenMax.to( overlay, .65, {
		'opacity': 0,
		'clearProps': 'opacity',
		'onComplete': function() {
			goog.dom.classlist.enable( this._refImg, 'hidden-keep-layout', false );
			goog.dom.classlist.enable( this._container, 'show', false );

			this._refImg = null;
			this._image = null;
			this._imageContainer = null;
			this._slider = null;

			goog.dom.removeChildren( this._container );
		},
		'onCompleteScope': this
	} );
};


gux.controllers.ImageViewer.prototype.reset = function() {

	this._zoom = 0;
	this._lastPinchScale = 1;
};


gux.controllers.ImageViewer.prototype.updateSize = function() {

	this._containerSize = goog.style.getSize( this._container );

	var containerSize = this._containerSize.clone();
	containerSize.width -= this._margin * 2;
	containerSize.height -= this._margin * 2;

	this._minSize.width = this._maxSize.width;
	this._minSize.height = this._maxSize.height;
	this._minSize.scaleToFit( containerSize );

	if ( this._minSize.width > this._maxSize.width ) {

		this._minSize.scale( this._maxSize.width / this._minSize.width );

	} else if ( this._minSize.height > this._maxSize.height ) {

		this._minSize.scale( this._maxSize.height / this._minSize.height );
	}

	this._minSize.round();
};


gux.controllers.ImageViewer.prototype.resize = function() {

	this.updateSize();

	this._zoomThrottle.fire();
};


gux.controllers.ImageViewer.prototype.triggerZoom = function() {

	this._zoomTweener.play();
	this._zoomTweener.updateTo( {
		zoom: this._zoom
	}, true );
};


gux.controllers.ImageViewer.prototype.updateZoom = function() {

	var zoom = this._zoomTweener.target.zoom;
	var width = goog.math.lerp( this._minSize.width, this._maxSize.width, zoom );
	var height = width / this._maxSize.aspectRatio();
	goog.style.setSize( this._imageContainer, width, height );

	var halfDistY = height / 2 + this._margin;
	var halfDistX = width / 2 + this._margin;

	var canPanVert = ( height > this._containerSize.height );
	var canPanHoriz = ( width > this._containerSize.width );

	var bTop = !canPanVert ? this._containerSize.height / 2 : halfDistY;
	var bLeft = !canPanHoriz ? this._containerSize.width / 2 : halfDistX;
	var bWidth = !canPanHoriz ? 0 : this._containerSize.width - bLeft * 2;
	var bHeight = !canPanVert ? 0 : this._containerSize.height - bTop * 2;

	this._draggable.applyBounds( {
		'top': bTop,
		'left': bLeft,
		'width': bWidth,
		'height': bHeight
	} );

	this.setSliderProgress( 1 - zoom );

	var canEnlarge = ( this._maxSize.width > this._containerSize.width || this._maxSize.height > this._containerSize.height );
	goog.dom.classlist.enable( this._slider, 'disabled', !canEnlarge );
};


gux.controllers.ImageViewer.prototype.setSliderProgress = function( progress ) {

	goog.style.setStyle( this._sliderDragger.target, 'top', progress * 100 + '%' );
};


gux.controllers.ImageViewer.prototype.onDragSlider = function( x, y ) {

	var fractionY = y / this._sliderDragger.limits.height;
	this.setSliderProgress( fractionY );

	this._zoom = 1 - fractionY;
	this._zoomThrottle.fire();
};


gux.controllers.ImageViewer.prototype.onLargeImageLoad = function( e ) {

	goog.dom.classlist.add( this._image, 'loaded' );
};


gux.controllers.ImageViewer.prototype.onOpenComplete = function() {

	var overlay = goog.dom.getElementByClass( 'overlay', this._container );
	this._eventHandler.listen( overlay, goog.events.EventType.CLICK, this.close, false, this );

	this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );
	this._eventHandler.listen( this._mouseWheelHandler, goog.events.MouseWheelHandler.EventType.MOUSEWHEEL, this.onMouseWheel, false, this );

	var largeImg = goog.dom.getElementByClass( 'large', this._container );

	if ( largeImg.width && largeImg.height ) {

		this.onLargeImageLoad();

	} else {

		this._eventHandler.listenOnce( largeImg, goog.events.EventType.LOAD, this.onLargeImageLoad, false, this );
	}

	// draggable
	this._draggable = new Draggable( this._image, {
		'type': 'x,y',
		'throwProps': true,
		'zIndexBoost': false
	} );

	// zoom tweener
	var zoomProp = {
		zoom: 0
	};

	this._zoomTweener = new TweenMax( zoomProp, .35, {
		zoom: 0,
		'paused': true,
		'ease': Cubic.easeOut,
		'onUpdate': this.updateZoom,
		'onUpdateScope': this
	} );

	// slider
	this._slider = goog.dom.getElementByClass( 'slider', this._container );
	var handle = goog.dom.getElementByClass( 'handle', this._slider );
	this._sliderDragger = new goog.fx.Dragger( handle, null, new goog.math.Rect( 0, 0, 0, 180 ) );
	this._sliderDragger.defaultAction = goog.bind( this.onDragSlider, this );
	this.setSliderProgress( 1 - this._zoom );

	goog.dom.classlist.enable( this._slider, 'show', true );

	// hammer
	this._hammer = new Hammer.Manager( this._imageContainer, {
		'recognizers': [
			[ Hammer.Pinch ]
		]
	} );

	this._hammer.on( 'pinch', goog.bind( this.onPinch, this ) );
	this._hammer.on( 'pinchstart', goog.bind( this.onPinchStart, this ) );

	//
	this._zoomThrottle.fire();
};


gux.controllers.ImageViewer.prototype.onMouseWheel = function( e ) {

	var zoomIncrement = ( e.deltaY / e.deltaY ) * ( e.deltaY / this._maxMouseWheelDelta ) * -1;

	this._zoom = goog.math.clamp( this._zoom + zoomIncrement, 0, 1 );

	this._zoomThrottle.fire();
};


gux.controllers.ImageViewer.prototype.onPinch = function( e ) {

	var scaleDiff = e[ 'scale' ] - this._lastPinchScale;
	this._lastPinchScale = e[ 'scale' ];

	this._zoom = goog.math.clamp( this._zoom + scaleDiff, 0, 1 );

	this._zoomThrottle.fire();
};


gux.controllers.ImageViewer.prototype.onPinchStart = function( e ) {

	this._lastPinchScale = 1;
};