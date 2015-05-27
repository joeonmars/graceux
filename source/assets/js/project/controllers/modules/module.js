goog.provide( 'gux.controllers.Module' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );


gux.controllers.Module = function( element ) {

	this.el = element;

	this._isActivated = false;
	this._eventHandler = new goog.events.EventHandler( this );
};
goog.inherits( gux.controllers.Module, goog.events.EventTarget );


gux.controllers.Module.prototype.disposeInternal = function() {

	this.deactivate();

	this._eventHandler.dispose();

	goog.base( this, 'disposeInternal' );
};


gux.controllers.Module.prototype.activate = function() {

	if ( !this._isActivated ) {

		this.doActivate();
		this._isActivated = true;
	}
};


gux.controllers.Module.prototype.deactivate = function() {

	if ( this._isActivated ) {

		this.doDeactivate();
		this._isActivated = false;
	}
};


gux.controllers.Module.prototype.doActivate = function() {

	this.resize();
};


gux.controllers.Module.prototype.doDeactivate = function() {

	this._eventHandler.removeAll();
};