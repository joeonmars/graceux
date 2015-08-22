goog.provide( 'gux.controllers.Shortcuts' );

goog.require( 'goog.events' );
goog.require( 'goog.ui.KeyboardShortcutHandler' );


/**
 * The global shortcut controller. Allows shortcuts definition and register/unregister
 * shortcuts for entities of any kind.
 * @constructor
 */
gux.controllers.Shortcuts = function() {

	this._shortcutHandler = new goog.ui.KeyboardShortcutHandler( document );
	goog.events.listen( this._shortcutHandler, goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
		this.onShortcutTriggered, false, this );

	this._shortcuts = {};
	this._callbacks = {};
};
goog.addSingletonGetter( gux.controllers.Shortcuts );


gux.controllers.Shortcuts.prototype.register = function( id, shortcuts, callback ) {

	var isRegistered = this._shortcutHandler.isShortcutRegistered( this._shortcuts[ id ] );

	if ( isRegistered ) {
		return false;
	} else {
		this._shortcuts[ id ] = shortcuts;
	}

	this._callbacks[ id ] = callback;

	this._shortcutHandler.registerShortcut( id, this._shortcuts[ id ] );
};


gux.controllers.Shortcuts.prototype.unregister = function( id ) {

	this._shortcutHandler.unregisterShortcut( this._shortcuts[ id ] );

	delete this._callbacks[ id ];
	delete this._shortcuts[ id ];
};


gux.controllers.Shortcuts.prototype.onShortcutTriggered = function( e ) {

	var callback = this._callbacks[ e.identifier ];

	if ( callback ) {
		callback( e.identifier );
	}
};


gux.controllers.Shortcuts.KeyAlias = {
	'cmd': 'meta'
};