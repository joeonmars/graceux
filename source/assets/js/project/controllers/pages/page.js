goog.provide( 'gux.controllers.pages.Page' );

goog.require( 'goog.async.Throttle' );
goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.dom.classlist' );
goog.require( 'goog.net.XhrIo' );
goog.require( 'gux.controllers.modules.Intro' );
goog.require( 'gux.controllers.modules.VideoPlayer' );
goog.require( 'gux.controllers.modules.Comparison' );
goog.require( 'gux.controllers.modules.Workflow' );
goog.require( 'gux.fx.Sticky' );


gux.controllers.pages.Page = function( el ) {

	goog.base( this );

	this.el = el;

	this._mainContainer = goog.dom.getElement( 'main-container' );

	this._modules = [];
	this._stickies = [];

	this._windowHeight = 0;

	this._eventHandler = new goog.events.EventHandler( this );

	this._onScrollUpdate = goog.bind( this.onScrollUpdate, this );

	this.init();
};
goog.inherits( gux.controllers.pages.Page, goog.events.EventTarget );


gux.controllers.pages.Page.prototype.init = function() {

	this._eventHandler.listen( gux.router, gux.events.EventType.LOAD_PAGE, this.onRouterLoadPage, false, this );
	this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );

	// create intro module
	var el = goog.dom.query( '.intro', this.el )[ 0 ];
	var intro = new gux.controllers.modules.Intro( el );
	this._modules.push( intro );

	// create video player modules
	var videoPlayers = goog.array.map( goog.dom.query( '.video-player', this.el ), function( el ) {
		var videoPlayer = new gux.controllers.modules.VideoPlayer( el );
		return videoPlayer;
	} );

	this._modules.push.apply( this._modules, videoPlayers );

	// create comparison modules
	var comparisons = goog.array.map( goog.dom.query( '.comparison figure', this.el ), function( el ) {
		var comparison = new gux.controllers.modules.Comparison( el );
		return comparison;
	} );

	this._modules.push.apply( this._modules, comparisons );

	// create workflow modules
	var workflows = goog.array.map( goog.dom.query( '.workflow', this.el ), function( el ) {
		var workflow = new gux.controllers.modules.Workflow( el );
		return workflow;
	} );

	this._modules.push.apply( this._modules, workflows );

	// create stickies
	var scrollEl = this._mainContainer;

	var stickyEls = goog.dom.query( '*[data-sticky="true"]', this.el );

	this._stickies = goog.array.map( stickyEls, function( el ) {

		var sticky = new gux.fx.Sticky( el, scrollEl, false );
		sticky.activate();

		return sticky;
	} );

	//
	gux.mainScroller.addCallback( gux.events.EventType.SCROLL_UPDATE, this._onScrollUpdate );

	//
	this.resize();
};


gux.controllers.pages.Page.prototype.disposeInternal = function() {

	goog.dom.removeNode( this.el );

	goog.array.forEach( this._modules, function( module ) {
		module.dispose();
	} );

	this._modules = null;

	this._eventHandler.removeAll();
	this._eventHandler.dispose();

	gux.mainScroller.removeCallback( gux.events.EventType.SCROLL_UPDATE, this._onScrollUpdate );

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
		'ease': Cubic.easeOut
	} );

	return tweener;
};


gux.controllers.pages.Page.prototype.resize = function() {

	this._windowHeight = goog.dom.getViewportSize().height;
};


gux.controllers.pages.Page.prototype.onScrollUpdate = function( progress, y ) {

	//console.log(progress, y);

	goog.array.forEach( this._stickies, function( sticky ) {
		sticky.render( y );
	} );
};


gux.controllers.pages.Page.prototype.onRouterLoadPage = function( e ) {

	var tweener = this.animateOut();

	tweener.eventCallback( "onComplete", function() {
		this.dispose();
		e.deferred.callback();
	}, null, this );
};