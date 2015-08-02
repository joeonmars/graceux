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
	var colors = [ 'red', 'blue', 'yellow', 'green' ];
	var types = [ 'g', 'u', 'x' ];

	goog.array.forEach( shapeContainers, function( container ) {

		var radius = Math.round( goog.math.uniformRandom( 6, 8 ) );
		var shapes = shape.generatePositions( 36, radius, radius, 3, true );
		var shapeEls = goog.array.map( shapes, function( s ) {
			var color = colors[ goog.math.randomInt( colors.length ) ];
			var type = types[ goog.math.randomInt( types.length ) ];
			var shapeEl = goog.dom.createDom( 'div', 'icon ' + color + ' ' + type );
			goog.style.setStyle( shapeEl, {
				'top': s.y,
				'left': s.x
			} );
			return shapeEl;
		} );
		goog.dom.append( container, shapeEls );
	} );
};