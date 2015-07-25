goog.provide( 'gux.apps.Main' );

goog.require( 'goog.dom' );
goog.require( 'goog.dom.query' );
goog.require( 'goog.fx.anim' );
goog.require( 'goog.style' );
goog.require( 'gux.controllers.Router' );
goog.require( 'gux.controllers.Header' );
goog.require( 'gux.controllers.Intro' );
goog.require( 'gux.controllers.PortfolioNavigation' );
goog.require( 'gux.controllers.MainScroller' );
goog.require( 'gux.controllers.ContactForm' );
goog.require( 'gux.controllers.FullscreenLoader' );


gux.apps.Main = function() {

	goog.fx.anim.setAnimationWindow( window );

	//
	gux.router = gux.controllers.Router.getInstance();

	gux.portfolioNavigation = gux.controllers.PortfolioNavigation.getInstance();

	gux.mainScroller = gux.controllers.MainScroller.getInstance();

	gux.header = gux.controllers.Header.getInstance();

	gux.fullscreenLoader = gux.controllers.FullscreenLoader.getInstance();

	// load site map
	gux.siteMap = null;

	var siteMapUrl = gux.Config[ 'basePath' ] + 'sitemap.html';

	goog.net.XhrIo.send( siteMapUrl, function( e ) {
		if ( e.target.isSuccess() ) {

			gux.siteMap = e.target.getResponseJson();

			var intro = gux.controllers.Intro.getInstance();
			intro.activate();

			var contactForm = gux.controllers.ContactForm.getInstance();

			gux.router.init();

		} else {

			throw Error( "Failed to load sitemap.html." );
		}
	} );
};