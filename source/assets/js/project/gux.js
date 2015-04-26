goog.provide('gux');

goog.require('gux.apps.Main');


gux.Config = {};


gux.init = function( config ) {

	gux.Config = config;
	
	switch(gux.Config['app']) {
		case 'main':
		gux.apps.Main();
		break;
	};
};

goog.exportProperty(window, 'gux', gux);
goog.exportProperty(gux, 'init', gux.init);