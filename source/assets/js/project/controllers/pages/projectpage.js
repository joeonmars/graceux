goog.provide( 'gux.controllers.pages.ProjectPage' );

goog.require( 'goog.events.MouseWheelHandler' );
goog.require( 'goog.string' );
goog.require( 'gux.controllers.ImageViewer' );
goog.require( 'gux.controllers.modules.Intro' );
goog.require( 'gux.controllers.modules.Comparison' );
goog.require( 'gux.controllers.modules.Workflow' );
goog.require( 'gux.controllers.pages.Page' );


gux.controllers.pages.ProjectPage = function( el ) {

	this._autoScrollTweener = null;
	this._mouseWheelHandler = new goog.events.MouseWheelHandler( el );

	this._scrollButton = goog.dom.query( '.intro .scroll', el )[ 0 ];

	goog.base( this, el );
};
goog.inherits( gux.controllers.pages.ProjectPage, gux.controllers.pages.Page );


gux.controllers.pages.ProjectPage.prototype.init = function() {

	goog.base( this, 'init' );

	// create intro module
	var introEl = goog.dom.query( '.intro', this.el )[ 0 ];
	if ( introEl ) {
		var intro = new gux.controllers.modules.Intro( introEl );
		this._modules.push( intro );
	}

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

	// query enlargeable medias
	var enlargeableEls = goog.dom.query( '*[data-allow-enlarge]', this.el );
	goog.array.forEach( enlargeableEls, function( el ) {
		this._eventHandler.listen( el, goog.events.EventType.CLICK, this.onClickEnlargeable, false, this );
	}, this );

	// intro mouse scroll
	if ( !goog.userAgent.MOBILE ) {

		gux.mainScroller.hideScrollbar();

		this._eventHandler.listen( this._scrollButton, goog.events.EventType.CLICK, this.handleMouseEventOnIntro, false, this );

		this._eventHandler.listen( this._mouseWheelHandler,
			goog.events.MouseWheelHandler.EventType.MOUSEWHEEL, this.handleMouseEventOnIntro, false, this );
	}
};


gux.controllers.pages.ProjectPage.prototype.disposeInternal = function() {

	this._mouseWheelHandler.dispose();

	if ( this._autoScrollTweener ) {
		this._autoScrollTweener.kill();
	}

	goog.base( this, 'disposeInternal' );
};


gux.controllers.pages.ProjectPage.prototype.onClickEnlargeable = function( e ) {

	var img = goog.dom.query( 'img', e.currentTarget )[ 0 ];

	var srcs = img.srcset.split( ',' );

	var src2x = srcs[ 1 ].replace( ' 2x', '' ).replace( /\s/g, '' );
	var src = ( window[ 'devicePixelRatio' ] === 1 ) ? srcs[ 0 ] : src2x;

	var imageViewer = gux.controllers.ImageViewer.getInstance();
	imageViewer.open( img, src, src2x );
};


gux.controllers.pages.ProjectPage.prototype.onScrollUpdate = function( progress, y ) {

	goog.base( this, 'onScrollUpdate', progress, y );

	var atTop = ( progress === 0 );
	goog.dom.classlist.enable( this._scrollButton, 'hide', !atTop );
	this._scrollButton.disabled = !atTop;
};


gux.controllers.pages.ProjectPage.prototype.handleMouseEventOnIntro = function( e ) {

	var isClick = ( e.type === goog.events.EventType.CLICK );
	var isMousewheel = ( e.type === goog.events.MouseWheelHandler.EventType.MOUSEWHEEL );

	if ( isMousewheel ) {
		e.preventDefault();
		e.stopPropagation();
	}

	if ( ( isMousewheel && !this._autoScrollTweener && e.deltaY > 5 ) || isClick ) {

		var el = goog.dom.query( '.intro .container', this.el )[ 0 ];
		var height = goog.style.getSize( el ).height;
		var prop = {
			scrollY: 0
		};

		this._autoScrollTweener = TweenMax.fromTo( prop, 1, {
			scrollY: 0
		}, {
			scrollY: height,
			'onUpdate': function() {
				gux.mainScroller.scrollTo( prop.scrollY, true );
			},
			'onComplete': function() {
				this._eventHandler.unlisten( this._mouseWheelHandler,
					goog.events.MouseWheelHandler.EventType.MOUSEWHEEL, this.handleMouseEventOnIntro, false, this );
			},
			'onCompleteScope': this,
			'ease': Cubic.easeInOut
		} );

		gux.mainScroller.showScrollbar();
	}
};