goog.provide( 'gux.controllers.Header' );


gux.controllers.Header = function() {

	this.el = goog.dom.getElement( 'main-header' );

	this._navigationButtons = goog.dom.query( '.navigation a', this.el );

	//
	this._eventHandler = new goog.events.EventHandler( this );
	this._eventHandler.listen( gux.router, gux.events.EventType.LOAD_PAGE, this.onLoadPage, false, this );
};
goog.addSingletonGetter( gux.controllers.Header );


gux.controllers.Header.prototype.onLoadPage = function( e ) {

	goog.array.forEach( this._navigationButtons, function( el ) {
		var isActive = ( el.getAttribute( 'data-id' ) === e.routeKey );
		goog.dom.classlist.enable( el, 'active', isActive );
	} );
};