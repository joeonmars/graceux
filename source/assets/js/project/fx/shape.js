goog.provide( 'gux.fx.Shape' );

goog.require( 'goog.math' );


gux.fx.Shape = function() {

};
goog.addSingletonGetter( gux.fx.Shape );


gux.fx.Shape.prototype.generatePositions = function( maxX, maxY, safeRadius, irregularity, inPercentage ) {

	// declarations
	var positionsArray = [];
	var r, c;

	// count the amount of rows and columns
	var rows = Math.floor( maxY / safeRadius );
	var columns = Math.floor( maxX / safeRadius );

	// loop through rows
	for ( r = 1; r <= rows; r++ ) {
		// loop through columns
		for ( c = 1; c <= columns; c++ ) {
			// populate array with point object
			var x = maxX * c / ( columns + safeRadius / maxX * columns ) + goog.math.uniformRandom( -irregularity, irregularity );
			var y = maxY * r / ( rows + safeRadius / maxY * rows ) + goog.math.uniformRandom( -irregularity, irregularity );

			if ( inPercentage ) {
				x = x / maxX * 100 + '%';
				y = y / maxY * 100 + '%';
			}

			positionsArray.push( {
				x: x,
				y: y
			} );
		}
	}

	// return array
	return positionsArray;
};


gux.fx.Shape.Vector = {
	G: [
		[ 0, 0 ],
		[ 1, 0 ],
		[ .5, .5 ],
		[ 1, .5 ],
		[ 1, 1 ],
		[ 0, 1 ]
	],
	U: [
		[ 0, 0 ],
		[ .5, .5 ],
		[ 1, 0 ],
		[ 1, 1 ],
		[ 0, 1 ]
	],
	X_TOP: [
		[ 0, 0 ],
		[ 1, 0 ],
		[ .5, .5 ]
	],
	X_BOTTOM: [
		[ .5, .5 ],
		[ 1, 1 ],
		[ 0, 1 ]
	],
	OPENING_QUOTE: [
		[ 0, .5 ],
		[ .5, 0 ],
		[ .5, 1 ],
		[ 0, 1 ]
	],
	CLOSING_QUOTE: [
		[ 0, 0 ],
		[ .5, 0 ],
		[ .5, .5 ],
		[ 0, 1 ]
	]
};


gux.fx.Shape.Color = {
	/** @expose */
	RED: '#FF8680',
	/** @expose */
	BLUE: '#82BCFF',
	/** @expose */
	YELLOW: '#FFDCA4',
	/** @expose */
	GREEN: '#C1D5D5',
	/** @expose */
	BLACK: '#000000'
};