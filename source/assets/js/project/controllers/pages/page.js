goog.provide( 'gux.controllers.pages.Page' );

goog.require( 'goog.async.Throttle' );
goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.dom.classlist' );
goog.require( 'goog.net.XhrIo' );
goog.require( 'gux.controllers.ContactForm' );
goog.require( 'gux.controllers.modules.VideoPlayer' );
goog.require( 'gux.fx.Sticky' );
goog.require( 'gux.fx.LazyLoader' );


gux.controllers.pages.Page = function( el ) {

	goog.base( this );

	this.el = el;

	this._mainContainer = goog.dom.getElement( 'main-container' );

	this._modules = [];
	this._stickies = [];
	this._lazyLoaders = [];

	this._animateInTweener = null;
	this._animateOutTweener = null;

	this._eventHandler = new goog.events.EventHandler( this );

	this._onScrollUpdate = goog.bind( this.onScrollUpdate, this );

	this.init();
};
goog.inherits( gux.controllers.pages.Page, goog.events.EventTarget );


gux.controllers.pages.Page.prototype.init = function() {

	this._eventHandler.listenOnce( gux.router, gux.events.EventType.LOAD_PAGE, this.onRouterLoadPage, false, this );
	this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );

	var emailButtons = goog.dom.query( '.email-button', this.el );
	goog.array.forEach( emailButtons, function( emailButton ) {
		this._eventHandler.listen( emailButton, goog.events.EventType.CLICK, this.onClickEmailButton, false, this );
	}, this );

	// create video player modules
	var videoPlayers = goog.array.map( goog.dom.query( '.video-player', this.el ), function( el ) {
		var videoPlayer = new gux.controllers.modules.VideoPlayer( el );
		return videoPlayer;
	} );

	this._modules.push.apply( this._modules, videoPlayers );

	// create stickies
	var scrollEl = this._mainContainer;

	var stickyEls = goog.dom.query( '*[data-sticky="true"]', this.el );

	this._stickies = goog.array.map( stickyEls, function( el ) {

		var sticky = new gux.fx.Sticky( el, scrollEl, false );
		sticky.activate();

		return sticky;
	} );

	// create lazy loaders
	var lazyEls = goog.dom.query( '*[data-lazy-load]', this.el );

	this._lazyLoaders = goog.array.map( lazyEls, function( el ) {

		var lazyLoader = new gux.fx.LazyLoader( el, scrollEl );
		lazyLoader.activate();

		return lazyLoader;
	} );

	//
	gux.mainScroller.addCallback( gux.events.EventType.SCROLL_UPDATE, this._onScrollUpdate );

	this.resize();
};


gux.controllers.pages.Page.prototype.disposeInternal = function() {

	goog.dom.removeNode( this.el );

	goog.array.forEach( this._modules, function( module ) {
		module.dispose();
	} );

	goog.array.forEach( this._stickies, function( sticky ) {
		sticky.dispose();
	} );

	goog.array.forEach( this._lazyLoaders, function( lazyLoader ) {
		lazyLoader.dispose();
	} );

	if ( this._animateInTweener ) {
		this._animateInTweener.kill();
		this._animateInTweener = null;
	}

	if ( this._animateOutTweener ) {
		this._animateOutTweener.kill();
		this._animateOutTweener = null;
	}

	this._modules = null;
	this._stickies = null;
	this._lazyLoaders = null;

	this._eventHandler.removeAll();
	this._eventHandler.dispose();

	gux.mainScroller.removeCallback( gux.events.EventType.SCROLL_UPDATE, this._onScrollUpdate );

	goog.base( this, 'disposeInternal' );
};


gux.controllers.pages.Page.prototype.animateIn = function( opt_lightboxId ) {

	var mainContent = goog.dom.getElement( 'main-content' );
	goog.dom.appendChild( mainContent, this.el );

	this.resize();

	this._animateInTweener = gux.fullscreenLoader.close( opt_lightboxId );

	return this._animateInTweener;
};


gux.controllers.pages.Page.prototype.animateOut = function( opt_lightboxId ) {

	this._animateOutTweener = gux.fullscreenLoader.open( opt_lightboxId );

	return this._animateOutTweener;
};


gux.controllers.pages.Page.prototype.resolveAnimateOutComplete = function( deferred ) {

	this.dispose();
	deferred.callback();
};


gux.controllers.pages.Page.prototype.resize = function() {

	goog.array.forEach( this._stickies, function( sticky ) {
		sticky.resize();
	} );

	goog.array.forEach( this._lazyLoaders, function( lazyLoader ) {
		lazyLoader.resize();
	} );

	goog.array.forEach( this._modules, function( module ) {
		module.resize();
	} );
};


gux.controllers.pages.Page.prototype.onAnimateOutComplete = function( e ) {

	this.resolveAnimateOutComplete( e.deferred );
};


gux.controllers.pages.Page.prototype.onScrollUpdate = function( progress, y ) {

	//console.log(progress, y);

	goog.array.forEach( this._stickies, function( sticky ) {
		sticky.render( y );
	} );

	goog.array.forEach( this._lazyLoaders, function( lazyLoader ) {
		lazyLoader.update( y );
	} );
};


gux.controllers.pages.Page.prototype.onClickEmailButton = function( e ) {

	e.preventDefault();

	var contactForm = gux.controllers.ContactForm.getInstance();
	contactForm.open();
};


gux.controllers.pages.Page.prototype.onRouterLoadPage = function( e ) {

	var tweener = this.animateOut( e.lightboxId );

	tweener.eventCallback( "onComplete", this.onAnimateOutComplete, [ e ], this );
};