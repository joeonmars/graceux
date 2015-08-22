goog.provide( 'gux.apps.Main' );

goog.require( 'goog.dom' );
goog.require( 'goog.dom.query' );
goog.require( 'goog.fx.anim' );
goog.require( 'goog.userAgent' );
goog.require( 'gux.controllers.Router' );
goog.require( 'gux.controllers.Header' );
goog.require( 'gux.controllers.Intro' );
goog.require( 'gux.controllers.PortfolioNavigation' );
goog.require( 'gux.controllers.MainScroller' );
goog.require( 'gux.controllers.FullscreenLoader' );
goog.require( 'gux.controllers.Shortcuts' );


gux.apps.Main = function() {

	goog.fx.anim.setAnimationWindow( window );

	if ( goog.userAgent.MOBILE ) {

		FastClick.attach( document.body );
	}

	// load site map
	gux.siteMap = null;

	var siteMapUrl = gux.Config[ 'basePath' ] + 'sitemap.html';

	goog.net.XhrIo.send( siteMapUrl, function( e ) {
		if ( e.target.isSuccess() ) {

			goog.dom.classlist.add( document.body, 'load' );

			gux.siteMap = e.target.getResponseJson();

			gux.router = gux.controllers.Router.getInstance();

			gux.shortcuts = gux.controllers.Shortcuts.getInstance();

			gux.portfolioNavigation = gux.controllers.PortfolioNavigation.getInstance();

			gux.mainScroller = gux.controllers.MainScroller.getInstance();

			gux.header = gux.controllers.Header.getInstance();

			gux.fullscreenLoader = gux.controllers.FullscreenLoader.getInstance();

			var intro = gux.controllers.Intro.getInstance();
			intro.activate();

			gux.router.init();

		} else {

			throw Error( "Failed to load sitemap.html." );
		}
	} );
};