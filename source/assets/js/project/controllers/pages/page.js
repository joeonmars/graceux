goog.provide( 'gux.controllers.pages.Page' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.dom.classlist' );
goog.require( 'goog.net.XhrIo' );


gux.controllers.pages.Page = function( el ) {

	goog.base( this );

	this.el = el;

	this._eventHandler = new goog.events.EventHandler( this );

	this.init();
};
goog.inherits( gux.controllers.pages.Page, goog.events.EventTarget );


gux.controllers.pages.Page.prototype.init = function() {

	this._eventHandler.listen( gux.router, gux.events.EventType.LOAD_PAGE, this.onRouterLoadPage, false, this );

	goog.array.forEach( goog.dom.query( '.video-player' ), function( el ) {
		var videoPlayer = new gux.controllers.VideoPlayer( el );
	} );
};


gux.controllers.pages.Page.prototype.disposeInternal = function() {

	goog.dom.removeNode( this.el );

	this._eventHandler.removeAll();
	this._eventHandler.dispose();

	goog.base( this, 'disposeInternal' );
};


gux.controllers.pages.Page.prototype.animateIn = function() {

	var mainContent = goog.dom.getElement( 'main-content' );
	goog.dom.appendChild( mainContent, this.el );

	var tweener = TweenMax.fromTo( this.el, .5, {
		'opacity': 0
	}, {
		'opacity': 1
	} );

	return tweener;
};


gux.controllers.pages.Page.prototype.animateOut = function() {

	var tweener = TweenMax.to( this.el, .45, {
		'opacity': 0,
		'x': '-5%',
		'ease': Cubic.easeOut
	} );

	return tweener;
};


gux.controllers.pages.Page.prototype.onRouterLoadPage = function( e ) {

	var tweener = this.animateOut();

	tweener.eventCallback( "onComplete", function() {
		this.dispose();
		e.deferred.callback();
	}, null, this );
};