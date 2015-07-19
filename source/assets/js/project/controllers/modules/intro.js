goog.provide( 'gux.controllers.modules.Intro' );

goog.require( 'gux.controllers.Module' );


gux.controllers.modules.Intro = function( element ) {

	goog.base( this, element );

	this._height = 0;

	this._mediaContainerEl = goog.dom.query( '.media-container', this.el )[ 0 ];
	this._textContainerEl = goog.dom.query( '.text-container', this.el )[ 0 ];

	this._onScrollUpdate = goog.bind( this.onScrollUpdate, this );

	this.activate();
};
goog.inherits( gux.controllers.modules.Intro, gux.controllers.Module );


gux.controllers.modules.Intro.prototype.doActivate = function() {

	goog.base( this, 'doActivate' );

	gux.mainScroller.addCallback( gux.events.EventType.SCROLL_UPDATE, this._onScrollUpdate );

	this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );
};


gux.controllers.modules.Intro.prototype.doDeactivate = function() {

	goog.base( this, 'doDeactivate' );

	gux.mainScroller.removeCallback( gux.events.EventType.SCROLL_UPDATE, this._onScrollUpdate );
};


gux.controllers.modules.Intro.prototype.onScrollUpdate = function( progress, y ) {

	this._height = this._height || this.resize().height;

	var scrollRatio = goog.math.clamp( y / this._height, 0, 1 );

	goog.style.setStyle( this._mediaContainerEl, {
		'transform': 'scale(' + goog.math.lerp( 1, 1.4, scrollRatio ) + ')',
		'opacity': 1 - scrollRatio
	} );

	goog.style.setStyle( this._textContainerEl, {
		'transform': 'translateY(' + scrollRatio * 50 + '%)',
		'opacity': Math.pow( 1 - scrollRatio, 4 )
	} );
};


gux.controllers.modules.Intro.prototype.resize = function() {

	this._height = goog.style.getSize( this.el ).height;

	return {
		height: this._height
	}
};