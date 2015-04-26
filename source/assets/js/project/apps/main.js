goog.provide('gux.apps.Main');

goog.require('goog.dom');
goog.require('goog.fx.anim');
goog.require('gux.templates.Main');


gux.apps.Main = function() {

	goog.fx.anim.setAnimationWindow(window);

	var helloWorld = soy.renderAsFragment(gux.templates.Main.HelloWorld);
	goog.dom.appendChild(document.body, helloWorld);

	//console.log(TweenMax);
};