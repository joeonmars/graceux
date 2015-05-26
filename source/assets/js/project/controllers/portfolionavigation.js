goog.provide( 'gux.controllers.PortfolioNavigation' );

goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.fx.easing' );
goog.require( 'goog.math.Size' );


gux.controllers.PortfolioNavigation = function() {

	this.el = goog.dom.getElement( 'portfolio-navigation' );

	this._inner = goog.dom.query( '.inner', this.el )[ 0 ];
	this._closeButton = goog.dom.query( '.close', this.el )[ 0 ];
	this._hamburgerButton = goog.dom.query( '#main-header .hamburger' )[ 0 ];
	this._menu = goog.dom.query( '#main-header .menu' )[ 0 ];
	this._mainContainer = goog.dom.query( '#main-container' )[ 0 ];
	this._particlesContainer = goog.dom.query( '.particles-container', this.el )[ 0 ];

	this._isOpened = false;

	//
	this._eventHandler = new goog.events.EventHandler( this );
	this._eventHandler.listen( this._hamburgerButton, gux.events.EventType.DOWN, this.toggle, false, this );
	this._eventHandler.listen( this._closeButton, goog.events.EventType.CLICK, this.close, false, this );
	this._eventHandler.listen( this._mainContainer, goog.events.EventType.CLICK, this.onClickMain, false, this );
	this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );
	this._eventHandler.listen( gux.router, gux.events.EventType.LOAD_PAGE, this.onLoadPage, false, this );
};
goog.addSingletonGetter( gux.controllers.PortfolioNavigation );


gux.controllers.PortfolioNavigation.prototype.getCurrentParticles = function() {

	var category = this.el.getAttribute( 'data-category' );
	var items = goog.dom.query( '.' + category + ' li', this.el );

	return items;
};


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

	this.resize();

	var innerHeight = goog.style.getSize( this._inner ).height;

	TweenMax.to( this.el, 1, {
		'height': innerHeight,
		'ease': Quint.easeOut
	} );

	TweenMax.to( this._mainContainer, 1, {
		'y': innerHeight * .55,
		'ease': Quint.easeOut
	} );

	// animate in particle items
	var items = this.getCurrentParticles();

	goog.array.forEach( items, function( item, i ) {
		TweenMax.fromTo( item, 1.65, {
			'y': -innerHeight,
			'opacity': 0
		}, {
			'y': 0,
			'opacity': 1,
			'delay': i * .02,
			'ease': Quint.easeOut
		} );
	} );
};


gux.controllers.PortfolioNavigation.prototype.close = function() {

	this._isOpened = false;

	goog.dom.classlist.enable( this._hamburgerButton, 'active', false );

	TweenMax.to( this.el, 1, {
		'height': 0,
		'ease': Quint.easeOut
	} );

	TweenMax.to( this._mainContainer, 1, {
		'y': 0,
		'ease': Quint.easeOut
	} );
};


gux.controllers.PortfolioNavigation.prototype.resize = function() {

	var particlesContainerSize = goog.style.getSize( this._particlesContainer );
	var particlesWidth = particlesContainerSize.width;
	var particlesHeight = particlesContainerSize.height;

	var deg = 0;
	var diff = 0;
	var loop = 9;
	var minRad = 1;
	var maxRad = Math.min( particlesWidth, particlesHeight ) / 2;

	var items = this.getCurrentParticles();
	var numItems = items.length;

	var cx = particlesWidth / 2;
	var cy = particlesHeight / 2;

	for ( var i = 0; i < numItems; i++ ) {

		var radius = goog.math.lerp( minRad, maxRad, goog.fx.easing.easeOut( i / numItems ) );

		if ( i % loop === 0 ) {
			deg = diff * ( 360 / loop / 2 );
			diff = ( diff === 0 ) ? 1 : 0;
		} else {
			deg += 360 / loop;
		}

		var rad = deg * Math.PI / 180;

		var x = cx + radius * Math.cos( rad );
		var y = cy + radius * Math.sin( rad );

		x = goog.math.lerp( 0, cx, ( x - cx ) / maxRad ) + cx;
		y = goog.math.lerp( 0, cy, ( y - cy ) / maxRad ) + cy;

		goog.style.setPosition( items[ i ], x, y );
	}
};


gux.controllers.PortfolioNavigation.prototype.onClickMain = function( e ) {

	if ( !this._isOpened ) return;

	if ( goog.dom.contains( this._mainContainer, e.target ) ) {
		this.close();
	}
};


gux.controllers.PortfolioNavigation.prototype.onLoadPage = function( e ) {

	this.close();

	if ( e.routeKey === 'projects-project' ) {

		this.el.setAttribute( 'data-category', 'projects' );
		goog.dom.classlist.enable( this._menu, 'hide', false );

	} else if ( e.routeKey === 'labs-project' ) {

		this.el.setAttribute( 'data-category', 'labs' );
		goog.dom.classlist.enable( this._menu, 'hide', false );

	} else {

		goog.dom.classlist.enable( this._menu, 'hide', true );
		return;
	}

	var anchors = goog.dom.query( 'a', this.el );
	var slug = e.routeParams[ 0 ];
	var activeAnchor;

	goog.array.forEach( anchors, function( el ) {

		var isActive = ( el.getAttribute( 'data-slug' ) === slug );
		goog.dom.classlist.enable( el, 'active', isActive );

		if ( isActive ) {
			activeAnchor = el;
		}
	} );

	var menuText = goog.dom.getTextContent( activeAnchor );
	goog.dom.setTextContent( goog.dom.query( 'p', this._menu )[ 0 ], menuText );
};