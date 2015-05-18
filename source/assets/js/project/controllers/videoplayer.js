goog.provide( 'gux.controllers.VideoPlayer' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.fx.Dragger' );


gux.controllers.VideoPlayer = function( element ) {

	this.el = element;

	this._video = goog.dom.query( 'video', this.el )[ 0 ];
	this._controls = goog.dom.getElementByClass( 'controls', this.el );
	this._playButton = goog.dom.getElementByClass( 'play', this.el );
	this._slider = goog.dom.getElementByClass( 'slider', this.el );
	this._track = goog.dom.getElementByClass( 'track', this.el );
	this._fill = goog.dom.getElementByClass( 'fill', this.el );

	this._hasPlayed = false;
	this._wasPlaying = false;
	this._canPlay = false;
	this._shouldLoop = ( this.el.getAttribute( 'data-loop' ) === 'true' );

	this._eventHandler = new goog.events.EventHandler( this );

	this._dragger = new goog.fx.Dragger( this._track );
	this._dragger.defaultAction = goog.nullFunction;
	this._draggerLimits = new goog.math.Rect( 0, 0, 0, 0 );

	this.activate();
};
goog.inherits( gux.controllers.VideoPlayer, goog.events.EventTarget );


gux.controllers.VideoPlayer.prototype.activate = function() {

	this._eventHandler.listen( this._playButton, goog.events.EventType.CLICK, this.togglePlay, false, this );
	this._eventHandler.listen( this.el, goog.events.EventType.MOUSEOVER, this.onMouseOver, false, this );
	this._eventHandler.listen( this.el, goog.events.EventType.MOUSEOUT, this.onMouseOut, false, this );
	this._eventHandler.listen( this._controls, goog.events.EventType.CLICK, this.onClickControls, false, this );
	this._eventHandler.listen( this._video, 'canplay', this.onCanPlay, false, this );
	this._eventHandler.listen( this._video, 'play', this.onPlay, false, this );
	this._eventHandler.listen( this._video, 'pause', this.onPause, false, this );
	this._eventHandler.listen( this._video, 'ended', this.onEnd, false, this );
	this._eventHandler.listen( this._dragger, goog.fx.Dragger.EventType.START, this.onDragStart, false, this );
	this._eventHandler.listen( this._dragger, goog.fx.Dragger.EventType.END, this.onDragEnd, false, this );
	this._eventHandler.listen( this._dragger, goog.fx.Dragger.EventType.DRAG, this.onDrag, false, this );
	this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );

	this.resize();
};


gux.controllers.VideoPlayer.prototype.deactivate = function() {

	this._eventHandler.removeAll();
};


gux.controllers.VideoPlayer.prototype.togglePlay = function() {

	if ( this._video.paused ) {

		if ( this._canPlay ) {
			this._video.play();
		} else {
			this._video.load();
		}

	} else {
		this._video.pause();
	}
};


gux.controllers.VideoPlayer.prototype.resize = function() {

	this._draggerLimits.width = goog.style.getSize( this._track ).width;
	this._dragger.setLimits( this._draggerLimits );
};


gux.controllers.VideoPlayer.prototype.onMouseOver = function( e ) {

	if ( !e.relatedTarget || goog.dom.contains( this.el, e.relatedTarget ) ) {
		return false;
	}

	goog.dom.classlist.enable( this.el, 'clean', false );
};


gux.controllers.VideoPlayer.prototype.onMouseOut = function( e ) {

	if ( !e.relatedTarget || goog.dom.contains( this.el, e.relatedTarget ) ) {
		return false;
	}

	if ( this._hasPlayed ) {
		goog.dom.classlist.enable( this.el, 'clean', true );
	}
};


gux.controllers.VideoPlayer.prototype.onClickControls = function( e ) {

	if ( e.currentTarget === e.target ) {
		this.togglePlay();
	}
};


gux.controllers.VideoPlayer.prototype.onDragStart = function( e ) {

	this._wasPlaying = !this._video.paused;

	this._video.pause();

	this.onDrag( e );

	goog.dom.classlist.enable( this._slider, 'dragging', true );
};


gux.controllers.VideoPlayer.prototype.onDragEnd = function( e ) {

	if ( this._wasPlaying ) {
		this._video.play();
	}

	goog.dom.classlist.enable( this._slider, 'dragging', false );
};


gux.controllers.VideoPlayer.prototype.onDrag = function( e ) {

	var dragDistance = e.clientX - goog.style.getPageOffsetLeft( this._track );
	var progress = goog.math.clamp( dragDistance / this._draggerLimits.width, 0, 1 );

	this._video.currentTime = this._video.duration * progress;
	this.onAnimationFrame();
};


gux.controllers.VideoPlayer.prototype.onCanPlay = function( e ) {

	this._canPlay = true;

	if ( !this._dragger.isDragging() ) {
		this._video.play();
	}
};


gux.controllers.VideoPlayer.prototype.onPlay = function( e ) {

	goog.dom.classlist.enable( this._playButton, 'paused', false );

	goog.fx.anim.registerAnimation( this );

	this._hasPlayed = true;
	goog.dom.classlist.enable( this.el, 'not-played', false );
};


gux.controllers.VideoPlayer.prototype.onPause = function( e ) {

	goog.dom.classlist.enable( this._playButton, 'paused', true );

	goog.fx.anim.unregisterAnimation( this );
};


gux.controllers.VideoPlayer.prototype.onEnd = function( e ) {

	if ( this._dragger.isDragging() ) {
		return;
	}

	if ( this._shouldLoop ) {

		this._video.play();

	} else {

		this.onAnimationFrame();
		goog.dom.classlist.enable( this.el, 'clean', false );
	}
};


gux.controllers.VideoPlayer.prototype.onAnimationFrame = function( now ) {

	var progress = this._video.currentTime / this._video.duration;
	var percent = Math.round( progress * 100 ) + '%';
	goog.style.setStyle( this._fill, 'width', percent );
};