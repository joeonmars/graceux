goog.provide( 'gux.apps.Main' );

goog.require( 'goog.dom' );
goog.require( 'goog.dom.query' );
goog.require( 'goog.fx.anim' );
goog.require( 'goog.style' );
goog.require( 'gux.templates.Main' );
goog.require( 'gux.controllers.Router' );
goog.require( 'gux.controllers.Intro' );
goog.require( 'gux.controllers.PortfolioNavigation' );
goog.require( 'gux.controllers.MainScroller' );
goog.require( 'gux.controllers.ContactForm' );
goog.require( 'gux.controllers.VideoPlayer' );


gux.apps.Main = function() {

	goog.fx.anim.setAnimationWindow( window );

	//var helloWorld = soy.renderAsFragment(gux.templates.Main.HelloWorld);
	//goog.dom.appendChild(document.body, helloWorld);

	var intro = gux.controllers.Intro.getInstance();
	var portfolioNavigation = gux.controllers.PortfolioNavigation.getInstance();
	var contactForm = gux.controllers.ContactForm.getInstance();

	//
	gux.router = gux.controllers.Router.getInstance();
	gux.router.init();

	gux.mainScroller = gux.controllers.MainScroller.getInstance();
};