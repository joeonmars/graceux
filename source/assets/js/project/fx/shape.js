goog.provide('gux.fx.Shape');


gux.fx.Shape = function() {

};
goog.addSingletonGetter(gux.fx.Shape);


gux.fx.Shape.Vector = {
	G: [
		[0, 0],
		[1, 0],
		[.5, .5],
		[1, .5],
		[1, 1],
		[0, 1]
	],
	U: [
		[0, 0],
		[.5, .5],
		[1, 0],
		[1, 1],
		[0, 1]
	],
	X_TOP: [
		[0, 0],
		[1, 0],
		[.5, .5]
	],
	X_BOTTOM: [
		[.5, .5],
		[1, 1],
		[0, 1]
	]
};


gux.fx.Shape.Color = {
	RED: '#FF8680',
	BLUE: '#82BCFF',
	YELLOW: '#FFDCA4',
	GREEN: '#C1D5D5',
	BLACK: '#000000'
};