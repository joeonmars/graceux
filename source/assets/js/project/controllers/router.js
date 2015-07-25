goog.provide( 'gux.controllers.Router' );

goog.require( 'goog.async.Deferred' );
goog.require( 'goog.async.DeferredList' );
goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.history.Html5History' );
goog.require( 'goog.net.XhrIo' );
goog.require( 'goog.object' );
goog.require( 'goog.Uri' );
goog.require( 'gux.controllers.pages.Page' );
goog.require( 'gux.controllers.pages.ProjectPage' );


gux.controllers.Router = function() {

	goog.base( this );

	this._history = new goog.history.Html5History();
	this._history.setUseFragment( !goog.history.Html5History.isSupported() );
	this._history.setEnabled( true );

	goog.events.listen( this._history, goog.history.EventType.NAVIGATE, this.onNavigate, false, this );
	goog.events.listen( document.body, goog.events.EventType.CLICK, this.onClick, false, this );

	this._currentPage = null;
	this._nextPage = null;

	this._lightboxId = null;

	this._deferredSwitchToNextPage = null;
	this._deferredLoad = null;
	this._deferredAnimateOut = null;

	// setup crossroads
	crossroads.routed.add( this.onRouted, this );

	var mappings = gux.controllers.Router.mappings;

	this._routes = [];

	goog.object.forEach( mappings, function( value ) {
		this._routes.push( crossroads.addRoute( value.pattern ) );
	}, this );
};
goog.inherits( gux.controllers.Router, goog.events.EventTarget );
goog.addSingletonGetter( gux.controllers.Router );


gux.controllers.Router.prototype.init = function() {

	// create the page instance from initial token
	var initialToken = this._history.getToken();

	var route = this.getMatchedRoute( initialToken );

	var mainContent = goog.dom.getElement( 'main-content' );
	var el = goog.dom.getFirstElementChild( mainContent );

	this._currentPage = this.createPage( route[ '_pattern' ], el );
};


gux.controllers.Router.prototype.getMatchedRoute = function( token ) {

	var route = goog.array.find( this._routes, function( route ) {
		return route.match( token );
	} );

	return route;
};


gux.controllers.Router.prototype.createPage = function( pattern, el ) {

	var mapping = goog.object.findValue( gux.controllers.Router.mappings, function( value ) {
		return value.pattern === pattern;
	} );

	var PageClass = mapping.page;
	var page = new PageClass( el );

	return page;
};


gux.controllers.Router.prototype.switchToNextPage = function() {

	if ( this._nextPage ) {
		this._nextPage.animateIn( this._lightboxId );
	}

	this._lightboxId = null;

	this.dispatchEvent( {
		type: gux.events.EventType.SWITCH_PAGE
	} );
};


gux.controllers.Router.prototype.loadPage = function( url, routeKey, routeParams ) {

	// create deferred list
	this._deferredLoad = new goog.async.Deferred();
	this._deferredAnimateOut = new goog.async.Deferred();

	this._deferredSwitchToNextPage = goog.async.DeferredList.gatherResults( [
		this._deferredLoad, this._deferredAnimateOut
	] );

	this._deferredSwitchToNextPage.addCallback( this.switchToNextPage, this );

	// make ajax request for next page
	var timeout = 10000;
	goog.net.XhrIo.send( url, goog.bind( this.onLoadComplete, this ), 'GET', null, null, timeout );

	this.dispatchEvent( {
		type: gux.events.EventType.LOAD_PAGE,
		deferred: this._deferredAnimateOut,
		routeKey: routeKey,
		routeParams: routeParams,
		lightboxId: this._lightboxId
	} );

	console.log( "LOAD PAGE: ", routeKey, routeParams, "Lightbox Id: " + this._lightboxId );
};


gux.controllers.Router.prototype.onNavigate = function( e ) {

	crossroads.parse( e.token );
};


gux.controllers.Router.prototype.onRouted = function( request, data ) {

	console.log( 'routed: ', request, data );

	var routeKey = goog.object.findKey( gux.controllers.Router.mappings, function( value ) {
		return value.pattern === data.route[ '_pattern' ];
	} );

	var routeParams = data[ 'params' ];

	var url = gux.Config[ 'basePath' ] + data[ 'params' ][ 'input' ] + '?ajax=true';

	this.loadPage( url, routeKey, routeParams );
};


gux.controllers.Router.prototype.onLoadComplete = function( e ) {

	if ( e.target.isSuccess() ) {

		var lastUri = e.target.getLastUri();
		var path = goog.Uri.parse( lastUri ).getPath();

		var router = this.getMatchedRoute( path );

		var pattern = router[ '_pattern' ];

		var el = goog.dom.createDom( 'div' );
		el.appendChild( goog.dom.htmlToDocumentFragment( e.target.getResponseText() ) );

		this._nextPage = this.createPage( pattern, el );

		this._deferredLoad.callback();

	} else {

		console.log( "LOAD ERROR: ", e );
	}
};


gux.controllers.Router.prototype.onClick = function( e ) {

	var target = e.target;

	if ( target.tagName === goog.dom.TagName.A && target.getAttribute( 'data-ajax' ) === 'true' ) {

		this._lightboxId = target.getAttribute( 'data-loader-id' );

		var token = goog.Uri.parse( target.href ).getPath().replace( /^\/|\/$/g, '' );
		this._history.setToken( token );

		e.preventDefault();
	}
};


gux.controllers.Router.mappings = {
	'home': {
		pattern: '',
		page: gux.controllers.pages.Page
	},
	'labs': {
		pattern: 'labs',
		page: gux.controllers.pages.Page
	},
	'projects-project': {
		pattern: 'projects/{id}',
		page: gux.controllers.pages.ProjectPage
	},
	'labs-project': {
		pattern: 'labs/{id}',
		page: gux.controllers.pages.Page
	},
	'about': {
		pattern: 'about',
		page: gux.controllers.pages.Page
	}
};