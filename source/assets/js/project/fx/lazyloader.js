goog.provide( 'gux.fx.LazyLoader' );

goog.require( 'goog.Disposable' );
goog.require( 'goog.dom' );
goog.require( 'goog.style' );
goog.require( 'gux.Utils' );


gux.fx.LazyLoader = function( element, scrollerElement ) {

	goog.base( this );

	this.el = element;
	this._parentEl = goog.dom.getParentElement( this.el );
	this._scrollerEl = scrollerElement;
	this._imageEl = goog.dom.getFirstElementChild( this.el );

	this._top = 0;
	this._windowHeight = 0;

	this._isLoadStarted = false;

	this._loadedDelay = new goog.Delay( this.doLoaded, 500, this );
	this._eventHandler = new goog.events.EventHandler( this );
};
goog.inherits( gux.fx.LazyLoader, goog.Disposable );


gux.fx.LazyLoader.prototype.disposeInternal = function() {

	this.deactivate();

	this._eventHandler.dispose();
	this._loadedDelay.dispose();

	this.el = null;
	this._parentEl = null;
	this._scrollerEl = null;

	goog.base( this, 'disposeInternal' );
};


gux.fx.LazyLoader.prototype.activate = function() {

	this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );

	this.resize();
	this.update();
};


gux.fx.LazyLoader.prototype.deactivate = function() {

	this._eventHandler.removeAll();

	this._loadedDelay.stop();
};


gux.fx.LazyLoader.prototype.resize = function() {

	this._top = goog.style.getPosition( this._parentEl ).y;
	this._windowHeight = goog.dom.getViewportSize().height;

	this.update();
};


gux.fx.LazyLoader.prototype.loadImage = function() {

	var img;

	if ( this._imageEl.tagName === 'IMG' ) {

		img = this._imageEl;

	} else if ( this._imageEl.tagName === 'DIV' ) {

		img = new Image();

		var srcs = gux.Utils.findUrls( goog.style.getStyle( this._imageEl, 'background-image' ) );
		var pixelRatio = window[ 'devicePixelRatio' ];
		img.src = ( pixelRatio === 1 ) ? srcs[ 0 ] : srcs[ 1 ];
	}

	this._eventHandler.listenOnce( img, goog.events.EventType.LOAD, this.onImageLoad, false, this );

	this._isLoadStarted = true;

	goog.dom.classlist.add( this.el, 'loading' );
};


gux.fx.LazyLoader.prototype.update = function( opt_scrollTop ) {

	if ( this._isLoadStarted ) {
		return;
	}

	var scrollTop = goog.isNumber( opt_scrollTop ) ? opt_scrollTop : this._scrollerEl.scrollTop;
	var isInViewport = ( this._top > scrollTop && this._top < scrollTop + this._windowHeight );

	if ( isInViewport ) {
		this.loadImage();
	}
};


gux.fx.LazyLoader.prototype.doLoaded = function() {

	goog.dom.classlist.swap( this.el, 'loading', 'loaded' );
};


gux.fx.LazyLoader.prototype.onImageLoad = function( e ) {

	this._loadedDelay.start();
};