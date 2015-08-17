goog.provide( 'gux.controllers.FullscreenLoader' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.userAgent' );
goog.require( 'gux.fx.Shape' );
goog.require( 'gux.templates.Main' );


gux.controllers.FullscreenLoader = function() {

	goog.base( this );

	this._container = goog.dom.getElement( 'fullscreen-loader-container' );
	this._el = null;

	this._eventHandler = new goog.events.EventHandler( this );
};
goog.inherits( gux.controllers.FullscreenLoader, goog.events.EventTarget );
goog.addSingletonGetter( gux.controllers.FullscreenLoader );


gux.controllers.FullscreenLoader.prototype.open = function( opt_lightboxId ) {

	this.resetContainer();

	var hasLightboxId = goog.isString( opt_lightboxId );

	if ( hasLightboxId && !goog.userAgent.MOBILE ) {

		return this.openProjectLoader( opt_lightboxId );

	} else {

		return this.openSimpleLoader();
	}
};


gux.controllers.FullscreenLoader.prototype.close = function( opt_lightboxId ) {

	var hasLightboxId = goog.isString( opt_lightboxId );

	if ( hasLightboxId ) {

		return this.closeProjectLoader();

	} else {

		return this.closeSimpleLoader();
	}
};


gux.controllers.FullscreenLoader.prototype.openProjectLoader = function( lightboxId ) {

	// query for the lightbox reference dom
	var lightBoxRef = goog.dom.query( '*[data-lightbox-id="' + lightboxId + '"]' )[ 0 ];

	// animate in
	goog.dom.classlist.enable( this._container, 'show', true );

	// create shape particles
	var shape = gux.fx.Shape.getInstance();
	var shapes = shape.generatePositions( 100, 50, 20, 10, true );

	// reference lightbox texts from site map
	var projectData = gux.siteMap[ 'portfolio' ][ lightboxId ];

	this._el = soy.renderAsFragment( gux.templates.Main.ProjectLoader, {
		shapes: shapes,
		project: projectData
	} );
	goog.dom.appendChild( this._container, this._el );

	var dimmedBackground = goog.dom.getElementByClass( 'dimmed-background', this._el );

	var tweener = TweenMax.fromTo( dimmedBackground, .4, {
		'opacity': 0
	}, {
		'opacity': 1
	} );

	var lightbox = goog.dom.getElementByClass( 'lightbox', this._el );
	var lightboxSize = goog.style.getSize( lightbox );
	var lightboxRefSize = goog.style.getSize( lightBoxRef );
	var lightboxRefPosition = goog.style.getPageOffset( lightBoxRef );

	var startTop = lightboxRefPosition.y;
	var startRight = lightboxRefPosition.x + lightboxRefSize.width;
	var startBottom = lightboxRefPosition.y + lightboxRefSize.height;
	var startLeft = lightboxRefPosition.x;

	var endTop = 0;
	var endRight = lightboxSize.width;
	var endBottom = lightboxSize.height;
	var endLeft = 0;

	var tweener = TweenMax.fromTo( lightbox, .8, {
		'clip': 'rect(' + startTop + 'px ' + startRight + 'px ' + startBottom + 'px ' + startLeft + 'px)'
	}, {
		'clip': 'rect(' + endTop + 'px ' + endRight + 'px ' + endBottom + 'px ' + endLeft + 'px)',
		'clearProps': 'clip',
		'ease': Cubic.easeInOut
	} );

	return tweener;
};


gux.controllers.FullscreenLoader.prototype.openSimpleLoader = function() {

	// animate in
	goog.dom.classlist.enable( this._container, 'show', true );

	this._el = soy.renderAsFragment( gux.templates.Main.SimpleLoader );
	goog.dom.appendChild( this._container, this._el );

	var tweener = TweenMax.fromTo( this._el, .8, {
		'opacity': 0
	}, {
		'opacity': 1,
		'ease': Cubic.easeInOut
	} );

	return tweener;
};


gux.controllers.FullscreenLoader.prototype.closeProjectLoader = function() {

	// animate out
	var tweener = TweenMax.to( this._el, .8, {
		'delay': 1,
		'height': 0,
		'clearProps': 'height',
		'ease': Quad.easeInOut,
		'onComplete': this.resetContainer,
		'onCompleteScope': this
	} );

	return tweener;
};


gux.controllers.FullscreenLoader.prototype.closeSimpleLoader = function() {

	// animate out
	var tweener = TweenMax.to( this._el, .8, {
		'opacity': 0,
		'ease': Quad.easeInOut,
		'onComplete': this.resetContainer,
		'onCompleteScope': this
	} );

	return tweener;
};


gux.controllers.FullscreenLoader.prototype.resetContainer = function() {

	goog.dom.classlist.enable( this._container, 'show', false );

	if ( this._el ) {
		goog.dom.removeNode( this._el );
		this._el = null;
	}
};