goog.provide( 'gux.controllers.pages.ProjectPage' );

goog.require( 'gux.controllers.ImageViewer' );
goog.require( 'gux.controllers.modules.Intro' );
goog.require( 'gux.controllers.modules.Comparison' );
goog.require( 'gux.controllers.modules.Workflow' );
goog.require( 'gux.controllers.pages.Page' );
goog.require( 'gux.Utils' );


gux.controllers.pages.ProjectPage = function( el ) {

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

	// query share buttons
	var shareButtons = goog.dom.query( '.share a', this.el );
	goog.array.forEach( shareButtons, function( el ) {
		this._eventHandler.listen( el, goog.events.EventType.CLICK, this.onClickShareButton, false, this );
	}, this );
};


gux.controllers.pages.ProjectPage.prototype.disposeInternal = function() {

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


gux.controllers.pages.ProjectPage.prototype.onClickShareButton = function( e ) {

	e.preventDefault();

	gux.Utils.popup( e.currentTarget.href );
};