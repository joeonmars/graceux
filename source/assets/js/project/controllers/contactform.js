goog.provide( 'gux.controllers.ContactForm' );

goog.require( 'goog.async.Delay' );
goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.dom.classlist' );
goog.require( 'goog.dom.forms' );
goog.require( 'goog.format.EmailAddress' );
goog.require( 'goog.net.XhrIo' );


gux.controllers.ContactForm = function() {

	this.container = goog.dom.getElement( 'contact-form-container' );
	this.el = goog.dom.getElement( 'contact-form' );

	this._overlay = goog.dom.query( '.overlay', this.container )[ 0 ];
	this._form = goog.dom.query( 'form', this.el )[ 0 ];
	this._sendButton = goog.dom.query( '.send', this.el )[ 0 ];
	this._composeEl = goog.dom.query( '.compose', this.el )[ 0 ];
	this._resultEl = goog.dom.query( '.result', this.el )[ 0 ];
	this._successEl = goog.dom.query( '.success', this.el )[ 0 ];
	this._failEl = goog.dom.query( '.fail', this.el )[ 0 ];

	this._closeButton = goog.dom.query( '.close', this.el )[ 0 ];

	this._nameEl = goog.dom.getElement( 'from-name' );
	this._emailEl = goog.dom.getElement( 'from-email' );
	this._messageEl = goog.dom.getElement( 'message' );

	this._eventHandler = new goog.events.EventHandler( this );

	this._autoCloseDelay = new goog.async.Delay( this.close, 4000, this );
};
goog.inherits( gux.controllers.ContactForm, goog.events.EventTarget );
goog.addSingletonGetter( gux.controllers.ContactForm );


gux.controllers.ContactForm.prototype.activate = function() {

	this._eventHandler.listen( this._closeButton, goog.events.EventType.CLICK, this.close, false, this );
	this._eventHandler.listen( this._form, goog.events.EventType.SUBMIT, this.onSubmit, false, this );
};


gux.controllers.ContactForm.prototype.deactivate = function() {

	this._eventHandler.removeAll();
};


gux.controllers.ContactForm.prototype.show = function() {

	goog.dom.classlist.enable( this.container, 'hide', false );
};


gux.controllers.ContactForm.prototype.hide = function() {

	goog.dom.classlist.enable( this.container, 'hide', true );
};


gux.controllers.ContactForm.prototype.open = function() {

	this.activate();
	this.reset();

	this.show();

	TweenMax.set( this._overlay, {
		'opacity': 1
	} );

	TweenMax.fromTo( this._overlay, .5, {
		'height': 0
	}, {
		'height': '100%',
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


gux.controllers.ContactForm.prototype.close = function() {

	this.deactivate();
	this._autoCloseDelay.stop();

	TweenMax.to( this._overlay, .65, {
		'opacity': 0,
		'onComplete': this.hide,
		'onCompleteScope': this
	} );

	TweenMax.to( this.el, .65, {
		'y': '200%',
		'ease': Expo.easeOut
	} );
};


gux.controllers.ContactForm.prototype.reset = function() {

	this._sendButton.value = this._sendButton.getAttribute( 'data-copy-send' );
	this._sendButton.disabled = false;

	goog.dom.classlist.enable( this._composeEl, 'sending', false );
	goog.dom.classlist.enable( this._resultEl, 'hide', true );

	goog.dom.classlist.enable( this._successEl, 'hide', true );
	goog.dom.classlist.enable( this._successEl, 'animate', false );

	goog.dom.classlist.enable( this._failEl, 'hide', true );
	goog.dom.classlist.enable( this._failEl, 'animate', false );

	this.unstyleValidationErrors();
};


gux.controllers.ContactForm.prototype.unstyleValidationErrors = function() {

	var allHintEls = goog.dom.query( '.hint span' );
	goog.array.forEach( allHintEls, function( hintEl ) {
		goog.dom.classlist.enable( hintEl, 'show', false );
	} );

	goog.array.forEach( goog.dom.query( 'fieldset', this._form ), function( fieldset ) {
		goog.dom.classlist.enable( fieldset, 'error', false );
	} );
}


gux.controllers.ContactForm.prototype.validate = function() {

	var errorType = gux.controllers.ContactForm.ValidationErrorType;

	// name
	var name = this._nameEl.value;

	if ( name.length === 0 ) {
		return errorType.NAME_NOT_FILLED;
	}

	// email
	var email = this._emailEl.value;

	if ( email.length === 0 ) {
		return errorType.EMAIL_NOT_FILLED;
	}

	if ( !goog.format.EmailAddress.isValidAddress( email ) ) {
		return errorType.EMAIL_INVALID;
	}

	// message
	var message = this._messageEl.value;

	if ( message.length === 0 ) {
		return errorType.MESSAGE_NOT_FILLED;
	}

	if ( message.length <= 20 ) {
		return errorType.MESSAGE_TOO_SHORT;
	}

	// validated
	return true;
};


gux.controllers.ContactForm.prototype.handleValidationError = function( currentErrorType ) {

	this.unstyleValidationErrors();

	var hintEl;
	var fieldEl;
	var errorType = gux.controllers.ContactForm.ValidationErrorType;

	switch ( currentErrorType ) {
		case errorType.NAME_NOT_FILLED:
			fieldEl = goog.dom.query( '.name' )[ 0 ];
			hintEl = goog.dom.query( '.not-filled', fieldEl )[ 0 ];
			break;

		case errorType.EMAIL_NOT_FILLED:
			fieldEl = goog.dom.query( '.email' )[ 0 ];
			hintEl = goog.dom.query( '.not-filled', fieldEl )[ 0 ];
			break;

		case errorType.EMAIL_INVALID:
			fieldEl = goog.dom.query( '.email' )[ 0 ];
			hintEl = goog.dom.query( '.invalid', fieldEl )[ 0 ];
			break;

		case errorType.MESSAGE_NOT_FILLED:
			fieldEl = goog.dom.query( '.message' )[ 0 ];
			hintEl = goog.dom.query( '.not-filled', fieldEl )[ 0 ];
			break;

		case errorType.MESSAGE_TOO_SHORT:
			fieldEl = goog.dom.query( '.message' )[ 0 ];
			hintEl = goog.dom.query( '.too-short', fieldEl )[ 0 ];
			break;
	}

	goog.dom.classlist.enable( fieldEl, 'error', true );
	goog.dom.classlist.enable( hintEl, 'show', true );
};


gux.controllers.ContactForm.prototype.onSubmit = function( e ) {

	e.preventDefault();

	var validated = this.validate();
	if ( validated !== true ) {
		this.handleValidationError( validated );
		return;
	}

	this._sendButton.value = this._sendButton.getAttribute( 'data-copy-sending' );
	this._sendButton.disabled = true;
	goog.dom.classlist.enable( this._composeEl, 'sending', true );

	this.unstyleValidationErrors();

	var url = '/';
	var timeout = 10000;
	var data = goog.dom.forms.getFormDataString( this._form );

	goog.net.XhrIo.send( url, goog.bind( this.onSubmitComplete, this ), 'POST', data, null, timeout );
};


gux.controllers.ContactForm.prototype.onSubmitComplete = function( e ) {

	goog.dom.classlist.enable( this._successEl, 'animate-in', false );
	goog.dom.classlist.enable( this._failEl, 'animate-in', false );

	if ( e.target.isSuccess() ) {

		goog.dom.classlist.enable( this._successEl, 'hide', false );
		goog.dom.classlist.enable( this._successEl, 'animate', true );

		this._messageEl.value = '';

		this._autoCloseDelay.start();

	} else {

		goog.dom.classlist.enable( this._failEl, 'hide', false );
		goog.dom.classlist.enable( this._failEl, 'animate', true );
	}

	goog.dom.classlist.enable( this._resultEl, 'hide', false );
};


gux.controllers.ContactForm.ValidationErrorType = {
	NAME_NOT_FILLED: 'name_not_filled',
	EMAIL_NOT_FILLED: 'email_not_filled',
	EMAIL_INVALID: 'email_invalid',
	MESSAGE_NOT_FILLED: 'message_not_filled',
	MESSAGE_TOO_SHORT: 'message_too_short'
}