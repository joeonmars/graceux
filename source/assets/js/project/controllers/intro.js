goog.provide('gux.controllers.Intro');

goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.math.Size');
goog.require('gux.fx.Shape');


gux.controllers.Intro = function() {

	this.el = goog.dom.getElement('main-intro');

	this._canvasContainer = goog.dom.query('.canvas-container', this.el)[0];
	this._maxResolution = new goog.math.Size(1280, 1080);

	this._two = new Two().appendTo(this._canvasContainer);

	this._shadowU = this.createPolygon(gux.fx.Shape.Vector.U, gux.fx.Shape.Color.BLACK, .05);
	this._shapeU = this.createPolygon(gux.fx.Shape.Vector.U, gux.fx.Shape.Color.BLUE);

	this._shadowXBottom = this.createPolygon(gux.fx.Shape.Vector.X_BOTTOM, gux.fx.Shape.Color.BLACK, .05);
	this._shapeXBottom = this.createPolygon(gux.fx.Shape.Vector.X_BOTTOM, gux.fx.Shape.Color.GREEN);

	this._shadowXTop = this.createPolygon(gux.fx.Shape.Vector.X_TOP, gux.fx.Shape.Color.BLACK, .05);
	this._shapeXTop = this.createPolygon(gux.fx.Shape.Vector.X_TOP, gux.fx.Shape.Color.YELLOW);

	this._shadowG = this.createPolygon(gux.fx.Shape.Vector.G, gux.fx.Shape.Color.BLACK, .05);
	this._shapeG = this.createPolygon(gux.fx.Shape.Vector.G, gux.fx.Shape.Color.RED);

	//
	this._eventHandler = new goog.events.EventHandler(this);
	this._eventHandler.listen(window, goog.events.EventType.RESIZE, this.resize, false, this);

	TweenMax.ticker.addEventListener('tick', this.update, this);

	this.resize();
};
goog.inherits(gux.controllers.Intro, goog.events.EventTarget);
goog.addSingletonGetter(gux.controllers.Intro);


gux.controllers.Intro.prototype.activate = function() {

};


gux.controllers.Intro.prototype.deactivate = function() {

};


gux.controllers.Intro.prototype.createPolygon = function(vector, hex, opt_opacity) {

	var flattenedVectors = [];

	var anchors = goog.array.forEach(vector, function(v) {
		flattenedVectors.push(v[0], v[1]);
	});

	var polygon = this._two.makePolygon.apply(this._two, flattenedVectors);
	polygon.fill = hex;
	polygon.opacity = goog.isNumber(opt_opacity) ? opt_opacity : 1;
	polygon.noStroke();

	return polygon;
};


gux.controllers.Intro.prototype.update = function() {

	this._two.update();
};


gux.controllers.Intro.prototype.resize = function() {

	var canvasSize = goog.style.getSize(this._canvasContainer);

	var resWidth, resHeight;

	if (this._maxResolution.aspectRatio() > canvasSize.aspectRatio()) {
		resWidth = Math.min(this._maxResolution.width, canvasSize.width);
		resHeight = resWidth / canvasSize.aspectRatio();
	} else {
		resHeight = Math.min(this._maxResolution.height, canvasSize.height);
		resWidth = resHeight * canvasSize.aspectRatio();
	}

	var scale = Math.min(Math.max(250, resHeight * .35), resWidth * .28);

	this._two.width = canvasSize.width;
	this._two.height = canvasSize.height;
	this._two.update();

	this._shapeG.scale = scale;
	this._shapeU.scale = scale;
	this._shapeXTop.scale = scale;
	this._shapeXBottom.scale = scale;

	this._shadowG.scale = scale;
	this._shadowU.scale = scale;
	this._shadowXTop.scale = scale;
	this._shadowXBottom.scale = scale;

	//
	var margin = Math.max(6, scale * .06);
	var startX = (resWidth - (scale * 2 + margin * 2)) / 2;
	var y = resHeight * .55;

	//
	var gX = startX;
	var gY = y;
	var gShadowOffset = scale * .1;
	this._shapeG.translation.set(gX, gY);
	this._shadowG.translation.set(gX + gShadowOffset, gY + gShadowOffset);

	var uX = startX + scale + margin;
	var uY = y;
	var uShadowOffset = scale * .08;
	this._shapeU.translation.set(uX, uY);
	this._shadowU.translation.set(uX + uShadowOffset, uY + uShadowOffset);

	var xTopX = startX + scale * 2 + margin * 2;
	var xTopY = y - scale / 4;
	var xTopShadowOffset = scale * .05;
	this._shapeXTop.translation.set(xTopX, xTopY);
	this._shadowXTop.translation.set(xTopX + xTopShadowOffset, xTopY + xTopShadowOffset);

	var xBottomX = startX + scale * 2 + margin * 2;
	var xBottomY = y + scale / 4;
	var xBottomShadowOffset = scale * .05;
	this._shapeXBottom.translation.set(xBottomX, xBottomY);
	this._shadowXBottom.translation.set(xBottomX + xBottomShadowOffset, xBottomY + xBottomShadowOffset);
};