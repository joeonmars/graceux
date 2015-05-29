goog.provide('gux.controllers.modules.Workflow');

goog.require('goog.fx.Dragger');
goog.require('gux.controllers.Module');


gux.controllers.modules.Workflow = function(element) {

	goog.base(this, element);

	this._imageContainer = goog.dom.query('.image-container', this.el)[0];
	this._scroller = goog.dom.query('.scroller', this.el)[0];
	this._prevButton = goog.dom.query('.prev', this.el)[0];
	this._nextButton = goog.dom.query('.next', this.el)[0];
	this._stepButtons = goog.dom.query('.pagination button', this.el);

	this._dragger = new goog.fx.Dragger(this._scroller);
	this._dragger.setHysteresis(10);
	this._dragger.defaultAction = goog.bind(this.onDrag, this);

	this._scrollProps = {
		x1: 0,
		x2: 0,
		t1: 0,
		t2: 0,
		startX: 0,
		endX: 0,
		originalX: 0,
		isVertical: false
	};

	this._step = 0;
	this._numSteps = goog.dom.query('li', this._scroller).length;

	this.activate();
};
goog.inherits(gux.controllers.modules.Workflow, gux.controllers.Module);


gux.controllers.modules.Workflow.prototype.disposeInternal = function() {

	goog.base(this, 'disposeInternal');
};


gux.controllers.modules.Workflow.prototype.doActivate = function() {

	goog.base(this, 'doActivate');

	this._eventHandler.listen(this._dragger, goog.fx.Dragger.EventType.START, this.onDragStart, false, this);
	this._eventHandler.listen(this._dragger, goog.fx.Dragger.EventType.END, this.onDragEnd, false, this);

	this._eventHandler.listen(this._prevButton, goog.events.EventType.CLICK, this.prevStep, false, this);
	this._eventHandler.listen(this._nextButton, goog.events.EventType.CLICK, this.nextStep, false, this);

	this._eventHandler.listen(window, goog.events.EventType.RESIZE, this.resize, false, this);

	goog.array.forEach(this._stepButtons, function(el) {
		this._eventHandler.listen(el, goog.events.EventType.CLICK, this.onClickStepButton, false, this);
	}, this);
};


gux.controllers.modules.Workflow.prototype.doDeactivate = function() {

	goog.base(this, 'doDeactivate');

	this._dragger.dispose();
};


gux.controllers.modules.Workflow.prototype.prevStep = function() {

	var step = Math.max(0, this._step - 1);
	this.scrollToStep(step);
};


gux.controllers.modules.Workflow.prototype.nextStep = function() {

	var step = Math.min(this._numSteps - 1, this._step + 1);
	this.scrollToStep(step);
};


gux.controllers.modules.Workflow.prototype.scrollToStep = function(step) {

	this._step = step;

	var stepWidth = goog.style.getSize(this._imageContainer).width;
	var stepX = stepWidth * this._step;

	var duration = goog.math.lerp(.25, .65, Math.abs(stepX - this._scroller.scrollLeft) / stepWidth);

	var imageTweener = TweenMax.to(this._scroller, duration, {
		'scrollTo': {
			'x': stepX
		},
		'ease': Cubic.easeOut
	});

	goog.array.forEach(this._stepButtons, function(el, index) {
		goog.dom.classlist.enable(el, 'active', (step === index));
	});

	this._prevButton.disabled = (step === 0);
	this._nextButton.disabled = (step === this._numSteps - 1);
};


gux.controllers.modules.Workflow.prototype.resize = function() {

	this.scrollToStep(this._step);
};


gux.controllers.modules.Workflow.prototype.onDragStart = function(e) {

	var touchX = this._dragger.clientX;

	this._scrollProps.x1 = this._scrollProps.x2 = touchX;
	this._scrollProps.t1 = this._scrollProps.t2 = goog.now();

	this._scrollProps.startX = touchX;
	this._scrollProps.endX = touchX;

	this._scrollProps.originalX = this._scroller.scrollLeft;

	var deltaX = Math.abs(this._dragger.startX - this._dragger.clientX);
	var deltaY = Math.abs(this._dragger.startY - this._dragger.clientY);
	this._scrollProps.isVertical = (deltaX < deltaY);
};


gux.controllers.modules.Workflow.prototype.onDragEnd = function(e) {

	if (this._scrollProps.isVertical) return;

	var elapsedTime = (goog.now() - this._scrollProps.t2) / 1000;
	var threshold = 100;
	var viewportMid = goog.style.getSize(this._imageContainer).width / 2;
	var velocity = (this._scrollProps.endX - this._scrollProps.x2) / elapsedTime;
	var scrolledDistance = this._scrollProps.endX - this._scrollProps.startX;

	if (velocity > threshold || scrolledDistance > viewportMid) {

		// go prev step
		this.prevStep();

	} else if (velocity < -threshold || scrolledDistance < -viewportMid) {

		// go next step
		this.nextStep();

	} else {

		// return to current step
		this.scrollToStep(this._step);

	}
};


gux.controllers.modules.Workflow.prototype.onDrag = function(x, y) {

	if (this._scrollProps.isVertical) return;

	var touchX = this._dragger.clientX;

	this._scrollProps.x2 = this._scrollProps.x1;
	this._scrollProps.t2 = this._scrollProps.t1;
	this._scrollProps.t1 = goog.now();
	this._scrollProps.x1 = touchX;
	this._scrollProps.endX = touchX;

	var offsetX = this._scrollProps.startX - touchX;
	var scrollX = this._scrollProps.originalX + offsetX;

	this._scroller.scrollLeft = scrollX;
};


gux.controllers.modules.Workflow.prototype.onClickStepButton = function(e) {

	var step = parseInt(e.currentTarget.getAttribute('data-step'));

	if (this._step !== step) {
		this.scrollToStep(step);
	}
};