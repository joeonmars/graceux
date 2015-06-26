goog.provide('gux.controllers.Assets');


gux.controllers.Assets = function() {

	this._assets = {};
};
goog.addSingletonGetter(gux.controllers.Assets);


gux.controllers.Assets.prototype.getFromScope = function(scope, opt_id) {

	return opt_id ? this._assets[scope][opt_id] : this._assets;
};


gux.controllers.Assets.prototype.addToScope = function(asset, id, scope) {

	this._assets[scope] = this._assets[scope] || {};
	this._assets[scope][id] = asset;
};


gux.controllers.Assets.prototype.disposeFromScope = function(scope, opt_id) {

	if (opt_id) {
		goog.object.remove(this._assets[scope], id);
	} else {
		goog.object.clear(this._assets[scope]);
	}
};