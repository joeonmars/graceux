goog.provide( 'gux.controllers.PasscodeForm' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.dom.classlist' );
goog.require( 'goog.dom.forms' );
goog.require( 'goog.net.XhrIo' );
goog.require( 'gux.events' );


gux.controllers.PasscodeForm = function() {

	goog.base( this );

	this.container = goog.dom.getElement( 'passcode-form-container' );
	this.el = goog.dom.getElement( 'passcode-form' );

	this._overlay = goog.dom.query( '.overlay', this.container )[ 0 ];
	this._form = goog.dom.query( 'form', this.el )[ 0 ];

	this._closeButton = goog.dom.query( '.close', this.el )[ 0 ];

	this._codeEl = goog.dom.getElement( 'passcode' );

	this._eventHandler = new goog.events.EventHandler( this );
};
goog.inherits( gux.controllers.PasscodeForm, goog.events.EventTarget );
goog.addSingletonGetter( gux.controllers.PasscodeForm );


gux.controllers.PasscodeForm.prototype.activate = function() {

	this._eventHandler.listen( this._closeButton, goog.events.EventType.CLICK, this.exit, false, this );
	this._eventHandler.listen( this._form, goog.events.EventType.SUBMIT, this.onSubmit, false, this );

	// shortcuts
	gux.shortcuts.register( 'close-form', 'esc', goog.bind( this.exit, this ) );
};


gux.controllers.PasscodeForm.prototype.deactivate = function() {

	this._eventHandler.removeAll();

	gux.shortcuts.unregister( 'close-form' );
};


gux.controllers.PasscodeForm.prototype.show = function() {

	goog.dom.classlist.enable( this.container, 'hide', false );
};


gux.controllers.PasscodeForm.prototype.hide = function() {

	goog.dom.classlist.enable( this.container, 'hide', true );
};


gux.controllers.PasscodeForm.prototype.open = function() {

	this.activate();
	this.reset();

	this.show();

	this._codeEl.focus();

	TweenMax.fromTo( this._overlay, .5, {
		'opacity': 0
	}, {
		'opacity': 1,
		'immediateRender': true,
		'ease': Cubic.easeInOut
	} );

	TweenMax.fromTo( this.el, .8, {
		'y': '200%',
		'opacity': 0
	}, {
		'y': '0%',
		'opacity': 1,
		'immediateRender': true,
		'ease': Expo.easeOut
	} );
};


gux.controllers.PasscodeForm.prototype.close = function() {

	this.deactivate();

	TweenMax.to( this._overlay, .65, {
		'opacity': 0,
		'onComplete': this.hide,
		'onCompleteScope': this
	} );

	TweenMax.to( this.el, .65, {
		'y': '200%',
		'opacity': 0,
		'ease': Expo.easeOut
	} );
};


gux.controllers.PasscodeForm.prototype.exit = function() {

	this.dispatchEvent( gux.events.EventType.EXIT );

	this.close();
};


gux.controllers.PasscodeForm.prototype.reset = function() {

	this._codeEl.value = '';
};


gux.controllers.PasscodeForm.prototype.onSubmit = function( e ) {

	e.preventDefault();

	this.dispatchEvent( {
		type: goog.events.EventType.SUBMIT,
		passcode: this._codeEl.value
	} );

	this.close();
};