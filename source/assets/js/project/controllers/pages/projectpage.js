goog.provide( 'gux.controllers.pages.ProjectPage' );

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
};