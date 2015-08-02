goog.provide( 'gux.controllers.pages.ProjectPage' );

goog.require( 'goog.string' );
goog.require( 'gux.controllers.ImageViewer' );
goog.require( 'gux.controllers.modules.Intro' );
goog.require( 'gux.controllers.modules.Comparison' );
goog.require( 'gux.controllers.modules.Workflow' );
goog.require( 'gux.controllers.pages.Page' );


gux.controllers.pages.ProjectPage = function( el ) {

	goog.base( this, el );

};
goog.inherits( gux.controllers.pages.ProjectPage, gux.controllers.pages.Page );


gux.controllers.pages.ProjectPage.prototype.init = function() {

	goog.base( this, 'init' );

	// create intro module
	var el = goog.dom.query( '.intro', this.el )[ 0 ];
	if ( el ) {
		var intro = new gux.controllers.modules.Intro( el );
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
};


gux.controllers.pages.ProjectPage.prototype.onClickEnlargeable = function( e ) {

	var img = goog.dom.query( 'img', e.currentTarget )[ 0 ];

	var srcs = img.srcset.split( ',' );
	var src2x = goog.array.find( srcs, function( src ) {
		return goog.string.contains( src, ' 2x' );
	} );
	src2x = src2x.replace( ' 2x', '' ).replace( /\s/g, '' );

	var imageViewer = gux.controllers.ImageViewer.getInstance();
	imageViewer.open( img, src2x );
};