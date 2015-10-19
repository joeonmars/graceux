goog.provide( 'gux.controllers.PortfolioNavigation' );

goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.fx.easing' );
goog.require( 'goog.math.Size' );


gux.controllers.PortfolioNavigation = function() {

	this.el = goog.dom.getElement( 'portfolio-navigation' );

	this._inner = goog.dom.query( '.inner', this.el )[ 0 ];
	this._closeButton = goog.dom.query( '.close', this.el )[ 0 ];
	this._menuButton = goog.dom.query( '#main-header .menu button' )[ 0 ];
	this._mainContainer = goog.dom.query( '#main-container' )[ 0 ];
	this._particlesContainer = goog.dom.query( '.particles-container', this.el )[ 0 ];

	this._isOpened = false;
	this._particlesRect = null;
	this._mouseRect = null;

	this._mouseRatio = {
		targetX: 0,
		targetY: 0,
		currentX: 0,
		currentY: 0
	};

	//
	this._eventHandler = new goog.events.EventHandler( this );
	this._eventHandler.listen( this._menuButton, gux.events.EventType.DOWN, this.toggle, false, this );
	this._eventHandler.listen( this._closeButton, goog.events.EventType.CLICK, this.close, false, this );
	this._eventHandler.listen( this._mainContainer, goog.events.EventType.CLICK, this.onClickMain, false, this );
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

	goog.dom.classlist.enable( this._menuButton, 'active', true );

	this.resize();

	var innerHeight = goog.style.getSize( this._inner ).height;

	TweenMax.to( this.el, 1, {
		'height': innerHeight,
		'ease': Quint.easeOut
	} );

	TweenMax.to( this._mainContainer, 1, {
		'y': innerHeight * .4,
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

	// add events
	this._eventHandler.listen( document.body, goog.events.EventType.MOUSEMOVE, this.onMouseMove, false, this );
	this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );

	TweenMax.ticker.addEventListener( 'tick', this.update, this );

	// shortcuts
	gux.shortcuts.register( 'close-navigation', 'esc', goog.bind( this.close, this ) );
};


gux.controllers.PortfolioNavigation.prototype.close = function() {

	this._isOpened = false;

	goog.dom.classlist.enable( this._menuButton, 'active', false );

	TweenMax.to( this.el, 1, {
		'height': 0,
		'ease': Quint.easeOut,
		'onComplete': function() {
			// remove events
			this._eventHandler.unlisten( document.body, goog.events.EventType.MOUSEMOVE, this.onMouseMove, false, this );
			this._eventHandler.unlisten( window, goog.events.EventType.RESIZE, this.resize, false, this );

			TweenMax.ticker.removeEventListener( 'tick', this.update, this );
		},
		'onCompleteScope': this
	} );

	TweenMax.to( this._mainContainer, 1, {
		'y': 0,
		'ease': Quint.easeOut
	} );

	gux.shortcuts.unregister( 'close-navigation' );
};


gux.controllers.PortfolioNavigation.prototype.update = function() {

	var ease = .1;
	this._mouseRatio.currentX += ( this._mouseRatio.targetX - this._mouseRatio.currentX ) * ease;
	this._mouseRatio.currentY += ( this._mouseRatio.targetY - this._mouseRatio.currentY ) * ease;

	var halfDistX = ( this._particlesRect.width - this._mouseRect.width ) / 2;
	var halfFractionX = halfDistX / this._particlesRect.width;
	var halfPercentageX = halfFractionX * this._mouseRatio.currentX * -100 + '%';

	var halfDistY = ( this._particlesRect.height - this._mouseRect.height ) / 2;
	var halfFractionY = halfDistY / this._particlesRect.height;
	var halfPercentageY = halfFractionY * this._mouseRatio.currentY * -100 + '%';

	goog.style.setStyle( this._particlesContainer, 'transform', 'translate(' + halfPercentageX + ',' + halfPercentageY + ')' );
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

	//
	var innerRect = goog.style.getBounds( this._inner );
	var x = innerRect.left;
	var y = innerRect.top;
	var w = innerRect.width;
	var h = innerRect.height;

	var mouseRect = innerRect;
	mouseRect.width = w * .65;
	mouseRect.height = h * .65;
	mouseRect.top = y + ( h - mouseRect.height ) / 2;
	mouseRect.left = x + ( w - mouseRect.width ) / 2;
	var mouseRectHalfWidth = mouseRect.width / 2;
	var mouseRectHalfHeight = mouseRect.height / 2;

	var particlesRect = goog.style.getBounds( this._particlesContainer );
	var particlesWidth = particlesRect.width;
	var particlesHeight = particlesRect.height;

	this._particlesRect = particlesRect;
	this._mouseRect = mouseRect;
};


gux.controllers.PortfolioNavigation.prototype.onClickMain = function( e ) {

	if ( !this._isOpened ) return;

	if ( goog.dom.contains( this._mainContainer, e.target ) ) {
		this.close();
	}
};


gux.controllers.PortfolioNavigation.prototype.onMouseMove = function( e ) {

	var mouseRect = this._mouseRect;
	var mouseRectHalfWidth = mouseRect.width / 2;
	var mouseRectHalfHeight = mouseRect.height / 2;

	var particlesWidth = this._particlesRect.width;
	var particlesHeight = this._particlesRect.height;

	var mouseRatioX = goog.math.clamp( ( e.clientX - mouseRect.left - mouseRectHalfWidth ) / mouseRectHalfWidth, -1, 1 );
	var mouseRatioY = goog.math.clamp( ( e.clientY - mouseRect.top - mouseRectHalfHeight ) / mouseRectHalfHeight, -1, 1 );

	this._mouseRatio.targetX = mouseRatioX;
	this._mouseRatio.targetY = mouseRatioY;
};


gux.controllers.PortfolioNavigation.prototype.onLoadPage = function( e ) {

	this.close();

	if ( e.routeKey === 'projects-project' ) {

		this.el.setAttribute( 'data-category', 'projects' );
		goog.dom.classlist.enable( this._menuButton, 'hide', false );

	} else if ( e.routeKey === 'labs-project' ) {

		this.el.setAttribute( 'data-category', 'labs' );
		goog.dom.classlist.enable( this._menuButton, 'hide', false );

	} else {

		goog.dom.classlist.enable( this._menuButton, 'hide', true );
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
	goog.dom.setTextContent( goog.dom.query( 'p', this._menuButton )[ 0 ], menuText );
};