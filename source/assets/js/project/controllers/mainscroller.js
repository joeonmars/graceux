goog.provide( 'gux.controllers.MainScroller' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'gux.fx.DummyScroller' );


gux.controllers.MainScroller = function() {


	this.el = goog.dom.getElement( 'main-container' );

	var scrollbar = goog.dom.getElement( 'main-scrollbar' );

	this._dummyScroller = new gux.fx.DummyScroller( this.el, scrollbar, .8 );
	this._dummyScroller.activate();

	this.resize();
};
goog.inherits( gux.controllers.MainScroller, goog.events.EventTarget );
goog.addSingletonGetter( gux.controllers.MainScroller );


gux.controllers.MainScroller.prototype.activate = function() {

};


gux.controllers.MainScroller.prototype.deactivate = function() {

};


gux.controllers.MainScroller.prototype.resize = function() {

};