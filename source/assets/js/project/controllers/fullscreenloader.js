goog.provide( 'gux.controllers.FullscreenLoader' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
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

	var projectData = gux.siteMap[ 'portfolio' ][ lightBoxId ];

	this._el = soy.renderAsFragment( gux.templates.Main.FullscreenLoader, projectData );
	goog.dom.appendChild( this._container, this._el );

	var dimmedBackground = goog.dom.getElementByClass( 'dimmed-background', this._el );

	var lightbox = goog.dom.getElementByClass( 'lightbox', this._el );
	var lightboxSize = goog.style.getSize( lightBoxRef );
	var lightboxPosition = goog.style.getPageOffset( lightBoxRef );

	var maskedContent = goog.dom.getElementByClass( 'masked-content', this._el );
	var padding = goog.style.getPaddingBox( maskedContent );
	lightboxPosition.x += lightboxSize.width / 2 - padding.left;
	lightboxPosition.y += lightboxSize.height / 2 - padding.top;

	TweenMax.set( this._el, {
		'height': '100%'
	} );

	var tweener = TweenMax.fromTo( dimmedBackground, .25, {
		'opacity': 0
	}, {
		'opacity': 1
	} );

	var tweener = TweenMax.fromTo( lightbox, .8, {
		'opacity': 0,
		'width': lightboxSize.width,
		'height': lightboxSize.height,
		'left': lightboxPosition.x,
		'top': lightboxPosition.y
	}, {
		'opacity': 1,
		'width': '100%',
		'height': '100%',
		'left': '50%',
		'top': '50%',
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