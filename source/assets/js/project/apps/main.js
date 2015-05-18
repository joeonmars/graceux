goog.provide( 'gux.apps.Main' );

goog.require( 'goog.dom' );
goog.require( 'goog.dom.query' );
goog.require( 'goog.fx.anim' );
goog.require( 'goog.style' );
goog.require( 'gux.templates.Main' );
goog.require( 'gux.controllers.Intro' );
goog.require( 'gux.controllers.MainScroller' );
goog.require( 'gux.controllers.ContactForm' );
goog.require( 'gux.controllers.VideoPlayer' );


gux.apps.Main = function() {

	goog.fx.anim.setAnimationWindow( window );

	//var helloWorld = soy.renderAsFragment(gux.templates.Main.HelloWorld);
	//goog.dom.appendChild(document.body, helloWorld);

	var intro = gux.controllers.Intro.getInstance();
	var mainScroller = gux.controllers.MainScroller.getInstance();
	var contactForm = gux.controllers.ContactForm.getInstance();

	goog.array.forEach( goog.dom.query( '.video-player' ), function( el ) {
		var videoPlayer = new gux.controllers.VideoPlayer( el );
	} );
};