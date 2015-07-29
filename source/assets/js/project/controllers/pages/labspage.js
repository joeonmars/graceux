goog.provide( 'gux.controllers.pages.LabsPage' );

goog.require( 'gux.controllers.pages.Page' );
goog.require( 'gux.fx.Shape' );


gux.controllers.pages.LabsPage = function( el ) {

	goog.base( this, el );

};
goog.inherits( gux.controllers.pages.LabsPage, gux.controllers.pages.Page );


gux.controllers.pages.LabsPage.prototype.init = function() {

	goog.base( this, 'init' );

	var shapeContainers = goog.dom.query( '.projects .shapes', this.el );
	var shape = gux.fx.Shape.getInstance();

	goog.array.forEach( shapeContainers, function( container ) {

		var shapes = shape.generatePositions( 36, 6, 6, 3, true );
		var shapeEls = goog.array.map( shapes, function( s ) {
			var shapeEl = goog.dom.createDom( 'div', 'icon' );
			goog.style.setStyle( shapeEl, {
				'top': s.y,
				'left': s.x
			} );
			return shapeEl;
		} );
		goog.dom.append( container, shapeEls );
	} );
};