goog.provide( 'gux.controllers.Header' );

goog.require( 'goog.dom.classlist' );


gux.controllers.Header = function() {

	this.el = goog.dom.getElement( 'main-header' );

	this._navigation = goog.dom.query( '.navigation', this.el )[ 0 ];
	this._navigationButtons = goog.dom.query( '.navigation a', this.el );
	this._mobileHamburgerButton = goog.dom.getElement( 'mobile-hamburger-button', this.el );

	this._intro = gux.controllers.Intro.getInstance();

	//
	this._eventHandler = new goog.events.EventHandler( this );
	this._eventHandler.listen( gux.router, gux.events.EventType.LOAD_PAGE, this.onLoadPage, false, this );
	this._eventHandler.listen( this._mobileHamburgerButton, goog.events.EventType.CLICK, this.toggleNavigation, false, this );

	goog.array.forEach( this._navigationButtons, function( el ) {
		this._eventHandler.listen( el, goog.events.EventType.CLICK, this.closeNavigation, false, this );
	}, this );

	// bind scroller update
	this._onScrollUpdate = goog.bind( this.onScrollUpdate, this );
	gux.mainScroller.addCallback( gux.events.EventType.SCROLL_UPDATE, this._onScrollUpdate );

	this.onScrollUpdate( gux.mainScroller.getProgress(), gux.mainScroller.getScrollTop() );
};
goog.addSingletonGetter( gux.controllers.Header );


gux.controllers.Header.prototype.closeNavigation = function() {

	goog.dom.classlist.enable( this._navigation, 'open', false );
	goog.dom.classlist.enable( this._mobileHamburgerButton, 'active', false );
};


gux.controllers.Header.prototype.toggleNavigation = function() {

	goog.dom.classlist.toggle( this._navigation, 'open' );

	var isActive = goog.dom.classlist.contains( this._navigation, 'open' );
	goog.dom.classlist.enable( this._mobileHamburgerButton, 'active', isActive );
};


gux.controllers.Header.prototype.onLoadPage = function( e ) {

	goog.array.forEach( this._navigationButtons, function( el ) {

		var isActive = ( el.getAttribute( 'data-id' ) === e.routeKey );
		goog.dom.classlist.enable( el, 'active', isActive );
	}, this );
};


gux.controllers.Header.prototype.onScrollUpdate = function( progress, y ) {

	var shouldHide = ( y === 0 && !this._intro.isDisposed() );

	if ( !shouldHide ) {
		goog.dom.classlist.enable( this.el, 'transition', true );
	}

	goog.dom.classlist.enable( this.el, 'hide', shouldHide );
};