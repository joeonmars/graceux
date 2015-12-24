goog.provide( 'gux.Utils' );

goog.require( 'goog.dom' );
goog.require( 'goog.string' );
goog.require( 'goog.Uri' );
goog.require( 'goog.window' );


gux.Utils.escapeConsole = function() {

	window.console = {};

	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];

	for ( var i = 0; i < methods.length; i++ ) {
		console[ methods[ i ] ] = function() {};
	}
};


gux.Utils.findUrls = function( text ) {

	var source = ( text || '' ).toString();
	var urlArray = [];
	var url;
	var matchArray;

	// Regular expression to find FTP, HTTP(S) and email URLs.
	var regexToken = /url\(([^)]+)\)/gi;

	// Iterate through any URLs in the text.
	matchArray = source.match( regexToken );

	var urlArray = goog.array.map( matchArray, function( str ) {
		return str.replace( 'url("', '' ).replace( '")', '' );
	} );

	return urlArray;
};


gux.Utils.popup = function( url ) {

	var width, height;

	var isFacebook = goog.string.contains( url, 'facebook' );
	var isTwitter = goog.string.contains( url, 'twitter' );
	var isGoogle = goog.string.contains( url, 'google' );

	if ( isFacebook ) {

		width = 640;
		height = 275;

	} else if ( isTwitter ) {

		width = 575;
		height = 275;

	} else if ( isGoogle ) {

		width = 640;
		height = 470;
	}

	var viewportSize = goog.dom.getViewportSize();

	goog.window.open( url, {
		'width': width,
		'height': height,
		'left': ( window.screenLeft || window.screenX ) + ( viewportSize.width - width ) / 2,
		'top': ( window.screenTop || window.screenY ) + ( viewportSize.height - height ) / 2,
		'toolbar': false,
		'scrollbars': true,
		'statusbar': false,
		'menubar': false,
		'resizable': true
	} );
};


gux.Utils.setCursorType = function( type, el ) {

	var _el = el || goog.dom.query( 'html' )[ 0 ];
	_el.setAttribute( 'data-cursor', type );
};