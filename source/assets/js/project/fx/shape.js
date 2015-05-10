goog.provide( 'gux.fx.Shape' );


gux.fx.Shape = function() {

};
goog.addSingletonGetter( gux.fx.Shape );


gux.fx.Shape.prototype.generateGraphics = function( vector, hex, opt_anchorX, opt_anchorY ) {

	var graphics = new PIXI.Graphics();

	var anchorX = goog.isNumber( opt_anchorX ) ? opt_anchorX : 0;
	var anchorY = goog.isNumber( opt_anchorY ) ? opt_anchorY : 0;

	var color = parseInt( hex.replace( '#', '0x' ), 16 );
	graphics.beginFill( color );

	var first = vector[ 0 ];
	graphics.moveTo( first[ 0 ] - anchorX, first[ 1 ] - anchorY );

	for ( var i = 1; i < vector.length; i++ ) {
		var point = vector[ i ];
		graphics.lineTo( point[ 0 ] - anchorX, point[ 1 ] - anchorY );
	}

	graphics.endFill();

	return graphics;
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
	]
};

gux.fx.Shape.Color = {
	RED: '#FF8680',
	BLUE: '#82BCFF',
	YELLOW: '#FFDCA4',
	GREEN: '#C1D5D5',
	LIGHT_GRAY: '#E5E5E5'
};