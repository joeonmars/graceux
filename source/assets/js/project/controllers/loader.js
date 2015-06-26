goog.provide('gux.controllers.Loader');

goog.require('goog.events.EventTarget');
goog.require('goog.net.ImageLoader');
goog.require('gux.controllers.Assets');
goog.require('gux.events');


gux.controllers.Loader = function(scope, opt_manifest, opt_duration) {

	goog.base(this);

	this._scope = scope;

	this._imageLoader = new goog.net.ImageLoader();
	this._imageLoader.listen(goog.events.EventType.LOAD, this.onImageLoad, false, this);
	this._imageLoader.listen(goog.net.EventType.COMPLETE, this.onLoadComplete, false, this);

	this._manifest = {};

	this._loadedAssets = 0;
	this._numAssets = 0;

	this._duration = opt_duration || 0.5;
	this._progress = 0;

	this._progressTweener = new TweenMax(this, this._duration, {
		_progress: 0,
		paused: true,
		ease: Linear.easeNone,
		onUpdate: this.onAnimateProgress,
		onUpdateScope: this
	});

	if (opt_manifest) {
		this.addManifest(opt_manifest);
	}
};
goog.inherits(gux.controllers.Loader, goog.events.EventTarget);


gux.controllers.Loader.prototype.disposeInternal = function() {

	goog.base(this, 'disposeInternal');

	this._imageLoader.removeAllListeners();
	this._imageLoader.dispose();

	this._progressTweener.kill();
};


gux.controllers.Loader.prototype.addManifest = function(manifest) {

	goog.object.extend(this._manifest, manifest);

	goog.object.forEach(this._manifest, function(value, id) {
		this._imageLoader.addImage(id, value);
	}, this);

	this._numAssets = goog.object.getCount(this._manifest);
};


gux.controllers.Loader.prototype.load = function(opt_manifest) {

	if (opt_manifest) {
		this.addManifest(opt_manifest);
	}

	this._loadedAssets = 0;

	this._imageLoader.start();
};


gux.controllers.Loader.prototype.onAnimateProgress = function() {

	this.dispatchEvent({
		type: gux.events.EventType.LOAD_PROGESS,
		progress: this._progress
	});

	if (this._progress === 1) {
		var assets = gux.controllers.Assets.getInstance().getFromScope(this._scope);

		this.dispatchEvent({
			type: gux.events.EventType.ANIMATE_COMPLETE,
			assets: assets
		});
	}
};


gux.controllers.Loader.prototype.onImageLoad = function(e) {

	var assets = gux.controllers.Assets.getInstance();
	assets.addToScope(e.target, e.target.id, this._scope);

	this._loadedAssets++;

	this._progressTweener.updateTo({
		_progress: this._loadedAssets / this._numAssets
	}, true).play();
};


gux.controllers.Loader.prototype.onLoadComplete = function(e) {

	var assets = gux.controllers.Assets.getInstance().getFromScope(this._scope);

	this.dispatchEvent({
		type: gux.events.EventType.LOAD_COMPLETE,
		assets: assets
	});
};