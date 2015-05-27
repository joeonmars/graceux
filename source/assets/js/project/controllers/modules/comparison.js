goog.provide( 'gux.controllers.modules.Comparison' );

goog.require( 'gux.controllers.Module' );
goog.require( 'goog.fx.Dragger' );


gux.controllers.modules.Comparison = function( element ) {

	goog.base( this, element );

	this._wiper = goog.dom.query( '.wiper', this.el )[ 0 ];
	this._topImg = goog.dom.query( '.images-container img', this.el )[ 0 ];
	this._captions = goog.dom.query( 'figcaption p', this.el );

	this._dragger = new goog.fx.Dragger( this._wiper );
	this._dragger.defaultAction = goog.bind( this.onDrag, this );
	this._draggerLimits = new goog.math.Rect( 0, 0, 0, 0 );

	this._topImgSize = null;

	this._currentX = 0;
	this._targetX = 0;

	this._isAnimating = false;

	this._progress = .5;

	this.activate();
};
goog.inherits( gux.controllers.modules.Comparison, gux.controllers.Module );


gux.controllers.modules.Comparison.prototype.disposeInternal = function() {

	this._dragger.dispose();

	goog.base( this, 'disposeInternal' );
};


gux.controllers.modules.Comparison.prototype.doActivate = function() {

	goog.base( this, 'doActivate' );

	this._eventHandler.listen( this._dragger, goog.fx.Dragger.EventType.START, this.startSlide, false, this );
	this._eventHandler.listen( this._dragger, goog.fx.Dragger.EventType.END, this.onDragEnd, false, this );
	this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );

	this.slideByProgress( this._progress );
};


gux.controllers.modules.Comparison.prototype.doDeactivate = function() {

	goog.base( this, 'doDeactivate' );

	goog.fx.anim.unregisterAnimation( this );
};


gux.controllers.modules.Comparison.prototype.resize = function() {

	var wiperParent = goog.dom.getParentElement( this._wiper );

	this._draggerLimits.width = goog.style.getSize( wiperParent ).width;
	this._dragger.setLimits( this._draggerLimits );

	this._topImgSize = goog.style.getSize( this._topImg );

	this.slideByProgress( this._progress );
};


gux.controllers.modules.Comparison.prototype.slideByProgress = function( progress ) {

	this._progress = progress;
	this._targetX = this._progress * this._draggerLimits.width;

	this.startSlide();
};


gux.controllers.modules.Comparison.prototype.startSlide = function() {

	if ( !this._isAnimating ) {

		goog.fx.anim.registerAnimation( this );

		goog.dom.classlist.enable( this._wiper, 'active', true );
	}
};


gux.controllers.modules.Comparison.prototype.update = function() {

	goog.style.setPosition( this._wiper, this._currentX, 0 );

	var right = this._currentX;
	var bottom = this._topImgSize.height;
	goog.style.setStyle( this._topImg, 'clip', 'rect(0px ' + right + 'px ' + bottom + 'px 0px)' );

	var progress = right / this._draggerLimits.width;
	goog.style.setStyle( this._captions[ 0 ], 'opacity', goog.math.lerp( .2, 1, progress ) );
	goog.style.setStyle( this._captions[ 1 ], 'opacity', goog.math.lerp( 1, .2, progress ) );
};


gux.controllers.modules.Comparison.prototype.onDrag = function( x, y ) {

	this._targetX = x;
	this._progress = x / this._draggerLimits.width;

	this.startSlide();
};


gux.controllers.modules.Comparison.prototype.onDragEnd = function( e ) {

	goog.dom.classlist.enable( this._wiper, 'active', false );
};


gux.controllers.modules.Comparison.prototype.onAnimationFrame = function( now ) {

	this._currentX += ( this._targetX - this._currentX ) * .3;

	if ( goog.math.nearlyEquals( this._currentX, this._targetX, 1 ) ) {

		goog.fx.anim.unregisterAnimation( this );

		if ( !this._dragger.isDragging() ) {
			goog.dom.classlist.enable( this._wiper, 'active', false );
		}

		this._currentX = this._targetX;
		this._isAnimating = false;
	}

	this.update();
};