goog.provide('gux.controllers.MainScroller');

goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('gux.fx.DummyScroller');


gux.controllers.MainScroller = function() {

	this.el = goog.dom.getElement('main-container');

	this.scrollbar = goog.dom.getElement('main-scrollbar');

	goog.base(this, this.el, this.scrollbar, .8);

	this.activate();
};
goog.inherits(gux.controllers.MainScroller, gux.fx.DummyScroller);
goog.addSingletonGetter(gux.controllers.MainScroller);


gux.controllers.MainScroller.prototype.activate = function() {

	goog.base(this, 'activate');

	this._eventHandler.listen(gux.router, gux.events.EventType.LOAD_PAGE, this.onLoadPage, false, this);
	this._eventHandler.listen(gux.router, gux.events.EventType.SWITCH_PAGE, this.onSwitchPage, false, this);
};


gux.controllers.MainScroller.prototype.deactivate = function() {

	goog.base(this, 'deactivate');
};


gux.controllers.MainScroller.prototype.onLoadPage = function() {

	this.lock();
};


gux.controllers.MainScroller.prototype.onSwitchPage = function() {

	this.reset();
	this.unlock();
};