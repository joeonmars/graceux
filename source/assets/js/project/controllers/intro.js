goog.provide('gux.controllers.Intro');

goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.math.Size');
goog.require('gux.fx.Shape');


gux.controllers.Intro = function() {

	this.el = goog.dom.getElement('main-intro');

	this._canvasContainer = goog.dom.query('.canvas-container', this.el)[0];
	this._maxResolution = new goog.math.Size(1280, 1080);

	this._maskRatio = 1;
	this._shapeBaseScale = 0;

	// create two canvas
	this._two = new Two().appendTo(this._canvasContainer);

	this._whiteBg = this._two.makeRectangle(0, 0, 1, 1);
	this._whiteBg.fill = '#ffffff';
	this._whiteBg.noStroke();

	this._shadowU = this.createPolygon(gux.fx.Shape.Vector.U, gux.fx.Shape.Color.BLACK, .05);
	this._shapeU = this.createPolygon(gux.fx.Shape.Vector.U, gux.fx.Shape.Color.BLUE);
	this._strokeU = this.createPolygon(gux.fx.Shape.Vector.U, gux.fx.Shape.Color.BLUE, .5, true);

	this._shadowXBottom = this.createPolygon(gux.fx.Shape.Vector.X_BOTTOM, gux.fx.Shape.Color.BLACK, .05);
	this._shapeXBottom = this.createPolygon(gux.fx.Shape.Vector.X_BOTTOM, gux.fx.Shape.Color.GREEN);
	this._strokeXBottom = this.createPolygon(gux.fx.Shape.Vector.X_BOTTOM, gux.fx.Shape.Color.GREEN, .5, true);

	this._shadowXTop = this.createPolygon(gux.fx.Shape.Vector.X_TOP, gux.fx.Shape.Color.BLACK, .05);
	this._shapeXTop = this.createPolygon(gux.fx.Shape.Vector.X_TOP, gux.fx.Shape.Color.YELLOW);
	this._strokeXTop = this.createPolygon(gux.fx.Shape.Vector.X_TOP, gux.fx.Shape.Color.YELLOW, .5, true);

	this._shadowG = this.createPolygon(gux.fx.Shape.Vector.G, gux.fx.Shape.Color.BLACK, .05);
	this._shapeG = this.createPolygon(gux.fx.Shape.Vector.G, gux.fx.Shape.Color.RED);
	this._strokeG = this.createPolygon(gux.fx.Shape.Vector.G, gux.fx.Shape.Color.RED, .5, true);

	this._backGroup = this._two.makeGroup(
		this._strokeG, this._strokeU, this._strokeXTop, this._strokeXBottom
	);

	this._foreGroup = this._two.makeGroup(
		this._whiteBg, this._shadowU, this._shapeU, this._shadowG, this._shapeG,
		this._shadowXTop, this._shapeXTop, this._shadowXBottom, this._shapeXBottom);

	this._mask = this._two.makeRectangle(0, 0, 1, 1);

	this._foreGroup.mask = this._mask;

	// props
	this._shapeConfig = {
		g: {
			baseX: 0,
			baseY: 0,
			slideY: 0,
			scale: 0,
			shadowOffset: 0
		},
		u: {
			baseX: 0,
			baseY: 0,
			slideY: 0,
			scale: 0,
			shadowOffset: 0
		},
		xTop: {
			baseX: 0,
			baseY: 0,
			slideY: 0,
			scale: 0,
			shadowOffset: 0
		},
		xBottom: {
			baseX: 0,
			baseY: 0,
			slideY: 0,
			scale: 0,
			shadowOffset: 0
		}
	};

	//
	this._eventHandler = new goog.events.EventHandler(this);

	this.activate();
};
goog.inherits(gux.controllers.Intro, goog.events.EventTarget);
goog.addSingletonGetter(gux.controllers.Intro);


gux.controllers.Intro.prototype.activate = function() {

	this.resize();

	this._eventHandler.listen(window, goog.events.EventType.RESIZE, this.resize, false, this);

	TweenMax.ticker.addEventListener('tick', this.update, this);

	// animate in
	var timeline = new TimelineMax({
		delay: 0.5
	});

	var startY = this._two.height * 1.5;
	var endY = 0;
	var tweeners = [];
	goog.object.forEach(this._shapeConfig, function(config) {
		var tweener = TweenMax.fromTo(config, 1.5, {
			slideY: startY,
			scale: 0,
		}, {
			slideY: endY,
			scale: 1,
			ease: Strong.easeOut
		});

		tweeners.push(tweener);
	});
	timeline.add(tweeners, '+=0', 'start', .05);

	//
	goog.Timer.callOnce(function() {
		goog.dom.classlist.enable(this.el, 'animate-in-ui', true);
	}, 1400, this);

	goog.Timer.callOnce(function() {
		goog.dom.classlist.enable(this.el, 'animate-in-loader', true);
	}, 2500, this);

	// animate mask
	TweenMax.to(this, 1, {
		_maskRatio: 0,
		delay: 5,
		ease: Quad.easeInOut,
		onUpdate: this.updateMask,
		onUpdateScope: this
	});

	// animate out
	TweenMax.to(this.el, 1, {
		'height': 0,
		'display': 'none',
		delay: 8,
		ease: Strong.easeOut,
		onComplete: this.dispose,
		onCompleteScope: this
	});
};


gux.controllers.Intro.prototype.deactivate = function() {

	this._eventHandler.removeAll();

	TweenMax.ticker.removeEventListener('tick', this.update, this);
};


gux.controllers.Intro.prototype.disposeInternal = function() {

	goog.base(this, 'disposeInternal');

	this.deactivate();
};


gux.controllers.Intro.prototype.createPolygon = function(vector, hex, opt_opacity, opt_stroke) {

	var flattenedVectors = [];

	var anchors = goog.array.forEach(vector, function(v) {
		flattenedVectors.push(v[0] * 10, v[1] * 10);
	});

	var polygon = this._two.makePolygon.apply(this._two, flattenedVectors);
	polygon.opacity = goog.isNumber(opt_opacity) ? opt_opacity : 1;

	if (opt_stroke) {
		polygon.linewidth = .25;
		polygon.stroke = hex;
		polygon.noFill();
	} else {
		polygon.fill = hex;
		polygon.noStroke();
	}

	return polygon;
};


gux.controllers.Intro.prototype.updateMask = function() {

	var halfWidth = this._two.width / 2;
	var halfHeight = this._two.height / 2;

	var maskY = goog.math.lerp(-halfHeight, halfHeight, this._maskRatio);
	this._mask.translation.set(halfWidth, maskY);
};


gux.controllers.Intro.prototype.update = function() {

	var config = this._shapeConfig;

	this._shapeG.translation.set(config.g.baseX, config.g.baseY + config.g.slideY);
	this._shadowG.translation.set(config.g.baseX + config.g.shadowOffset, config.g.baseY + config.g.shadowOffset + config.g.slideY);
	this._strokeG.translation.copy(this._shapeG.translation);

	this._shapeG.scale = this._shadowG.scale = this._strokeG.scale = this._shapeBaseScale * config.g.scale;

	this._shapeU.translation.set(config.u.baseX, config.u.baseY + config.u.slideY);
	this._shadowU.translation.set(config.u.baseX + config.u.shadowOffset, config.u.baseY + config.u.shadowOffset + config.u.slideY);
	this._strokeU.translation.copy(this._shapeU.translation);

	this._shapeU.scale = this._shadowU.scale = this._strokeU.scale = this._shapeBaseScale * config.u.scale;

	this._shapeXTop.translation.set(config.xTop.baseX, config.xTop.baseY + config.xTop.slideY);
	this._shadowXTop.translation.set(config.xTop.baseX + config.xTop.shadowOffset, config.xTop.baseY + config.xTop.shadowOffset + config.xTop.slideY);
	this._strokeXTop.translation.copy(this._shapeXTop.translation);

	this._shapeXTop.scale = this._shadowXTop.scale = this._strokeXTop.scale = this._shapeBaseScale * config.xTop.scale;

	this._shapeXBottom.translation.set(config.xBottom.baseX, config.xBottom.baseY + config.xBottom.slideY);
	this._shadowXBottom.translation.set(config.xBottom.baseX + config.xBottom.shadowOffset, config.xBottom.baseY + config.xBottom.shadowOffset + config.xBottom.slideY);
	this._strokeXBottom.translation.copy(this._shapeXBottom.translation);

	this._shapeXBottom.scale = this._shadowXBottom.scale = this._strokeXBottom.scale = this._shapeBaseScale * config.xBottom.scale;

	//
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

	var scale = Math.min(Math.max(260, resHeight * .4), resWidth * .3);
	this._shapeBaseScale = scale / 10;

	this._two.width = canvasSize.width;
	this._two.height = canvasSize.height;
	this._two.update();

	// resize bg
	this._whiteBg.scale = Math.max(this._two.width, this._two.height);
	this._whiteBg.translation.set(this._two.width / 2, this._two.height / 2);

	//
	var margin = Math.max(6, scale * .06);
	var startX = (resWidth - (scale * 2 + margin * 2)) / 2;
	var y = resHeight * .52;

	//
	var config = this._shapeConfig;
	config.g.baseX = startX;
	config.g.baseY = y;
	config.g.shadowOffset = scale * .1;

	config.u.baseX = startX + scale + margin;
	config.u.baseY = y;
	config.u.shadowOffset = scale * .08;

	config.xTop.baseX = startX + scale * 2 + margin * 2;
	config.xTop.baseY = y - scale / 4;
	config.xTop.shadowOffset = scale * .05;

	config.xBottom.baseX = startX + scale * 2 + margin * 2;
	config.xBottom.baseY = y + scale / 4;
	config.xBottom.shadowOffset = scale * .05;

	// test mask
	var halfWidth = canvasSize.width / 2;
	var halfHeight = canvasSize.height / 2;

	goog.array.forEach(this._mask.vertices, function(v, i) {
		switch (i) {
			case 0:
				v.x = -halfWidth;
				v.y = -halfHeight;
				break;

			case 1:
				v.x = halfWidth;
				v.y = -halfHeight;
				break;

			case 2:
				v.x = halfWidth;
				v.y = halfHeight;
				break;

			case 3:
				v.x = -halfWidth;
				v.y = halfHeight;
				break;
		}
	});

	this.updateMask();

	//
	this.update();
};