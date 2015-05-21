goog.provide( 'gux.controllers.PortfolioNavigation' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.math.Size' );


gux.controllers.PortfolioNavigation = function() {

	this.el = goog.dom.getElement( 'portfolio-navigation' );

	this._inner = goog.dom.query( '.inner', this.el )[ 0 ];
	this._closeButton = goog.dom.query( '.close', this.el )[ 0 ];
	this._hamburgerButton = goog.dom.query( '#main-header .hamburger' )[ 0 ];
	this._mainContainer = goog.dom.query( '#main-container' )[ 0 ];

	this._isOpened = false;

	//
	this._eventHandler = new goog.events.EventHandler( this );
	this._eventHandler.listen( this._hamburgerButton, gux.events.EventType.DOWN, this.toggle, false, this );
	this._eventHandler.listen( this._closeButton, goog.events.EventType.CLICK, this.close, false, this );
	this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );

	this.resize();
};
goog.inherits( gux.controllers.PortfolioNavigation, goog.events.EventTarget );
goog.addSingletonGetter( gux.controllers.PortfolioNavigation );


gux.controllers.PortfolioNavigation.prototype.toggle = function() {

	if ( this._isOpened ) {
		this.close();
	} else {
		this.open();
	}
};


gux.controllers.PortfolioNavigation.prototype.open = function() {

	this._isOpened = true;

	goog.dom.classlist.enable( this._hamburgerButton, 'active', true );

	var innerHeight = goog.style.getSize( this._inner ).height;

	TweenMax.to( this.el, .65, {
		'height': innerHeight,
		'ease': Quint.easeOut
	} );

	TweenMax.to( this._mainContainer, .65, {
		'y': innerHeight * .55,
		'ease': Quint.easeOut
	} );
};


gux.controllers.PortfolioNavigation.prototype.close = function() {

	this._isOpened = false;

	goog.dom.classlist.enable( this._hamburgerButton, 'active', false );

	TweenMax.to( this.el, .65, {
		'height': 0,
		'ease': Quint.easeOut
	} );

	TweenMax.to( this._mainContainer, .65, {
		'y': 0,
		'ease': Quint.easeOut
	} );
};


gux.controllers.PortfolioNavigation.prototype.resize = function() {

};