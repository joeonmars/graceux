goog.provide( 'gux.controllers.FullscreenLoader' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
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


gux.controllers.FullscreenLoader.prototype.open = function( lightBoxId ) {

	// query for the lightbox reference dom
	var lightBoxRef = goog.dom.query( '*[data-lightbox-id="' + lightBoxId + '"]' )[ 0 ];

	// animate in
	goog.dom.classlist.enable( this._container, 'show', true );

	// create shape particles
	var shape = gux.fx.Shape.getInstance();
	var shapes = shape.generatePositions( 100, 50, 20, 10, true );

	// reference lightbox texts from site map
	var projectData = gux.siteMap[ 'portfolio' ][ lightBoxId ];

	this._el = soy.renderAsFragment( gux.templates.Main.FullscreenLoader, {
		shapes: shapes,
		project: projectData
	} );
	goog.dom.appendChild( this._container, this._el );

	var dimmedBackground = goog.dom.getElementByClass( 'dimmed-background', this._el );

	TweenMax.set( this._el, {
		'height': '100%'
	} );

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


gux.controllers.FullscreenLoader.prototype.close = function() {

	// animate out
	var tweener = TweenMax.to( this._el, .8, {
		'delay': 1,
		'height': 0,
		'ease': Quad.easeInOut,
		'onComplete': function() {
			goog.dom.classlist.enable( this._container, 'show', false );
			goog.dom.removeNode( this._el );
			this._el = null;
		},
		'onCompleteScope': this
	} );

	return tweener;
};