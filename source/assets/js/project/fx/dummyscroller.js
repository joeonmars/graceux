goog.provide( 'gux.fx.DummyScroller' );

goog.require( 'goog.async.Delay' );
goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.dom' );
goog.require( 'goog.fx.Dragger' );
goog.require( 'goog.math.Size' );
goog.require( 'goog.math.Box' );
goog.require( 'gux.events' );

/**
 * @constructor
 */
gux.fx.DummyScroller = function( viewOuter, scrollbar, opt_speed, opt_ease ) {

  goog.base( this );

  // scroll properties
  this._dummyScrollTop = 0;
  this._viewInnerY = 0;
  this._viewInnerHeight = 0;
  this._viewOuterHeight = 0;
  this._dummyInnerHeight = 0;
  this._dummyOuterHeight = 0;
  this._handleHeight = 0;
  this._scrollbarHeight = 0;
  this._speed = opt_speed || 1;
  this._ease = opt_ease || .25;

  this._callbacks = {};
  this._callbacks[ gux.events.EventType.SCROLL_UPDATE ] = [];
  this._callbacks[ gux.events.EventType.SCROLL_COMPLETE ] = [];

  this._isAnimating = false;

  // dom elements
  this._viewOuter = viewOuter;

  this._dummyOuter = goog.dom.createDom( 'div', {
    'className': 'dummy-scroller'
  } );
  this._dummyInner = goog.dom.createDom( 'div', {
    'className': 'inner'
  } );

  goog.style.setStyle( this._dummyOuter, {
    'position': 'absolute',
    'top': 0,
    'left': 0,
    'width': 'calc(100% + 50px)',
    'height': '100%',
    'overflow': 'auto',
    'z-index': 100
  } );

  goog.dom.classlist.add( this._viewOuter, 'dummy-scroll' );

  goog.dom.appendChild( this._dummyOuter, this._dummyInner );
  goog.dom.appendChild( goog.dom.getParentElement( this._viewOuter ), this._dummyOuter );

  this._scrollbar = scrollbar;
  this._handle = goog.dom.getElementByClass( 'handle', this._scrollbar );

  // events
  this._eventHandler = new goog.events.EventHandler( this );
  this._disableDummyScrollDelay = new goog.async.Delay( this.disableDummyScroll, 250, this );

  this._dragger = new goog.fx.Dragger( this._handle );
  this._dragger.defaultAction = goog.nullFunction;
  this._draggerLimits = new goog.math.Rect( 0, 0, 0, 0 );

  // init
  this.disableDummyScroll();
  this.unlock();
  this.resize();
};
goog.inherits( gux.fx.DummyScroller, goog.events.EventTarget );


gux.fx.DummyScroller.prototype.activate = function() {

  this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );

  this._eventHandler.listen( this._dragger, goog.fx.Dragger.EventType.START, this.onDragHandleStart, false, this );
  this._eventHandler.listen( this._dragger, goog.fx.Dragger.EventType.END, this.onDragHandleEnd, false, this );
  this._eventHandler.listen( this._dragger, goog.fx.Dragger.EventType.DRAG, this.onDragHandle, false, this );
};


gux.fx.DummyScroller.prototype.deactivate = function() {

  this._eventHandler.removeAll();
};


gux.fx.DummyScroller.prototype.reset = function() {

  this.resize();

  this._dummyOuter.scrollTop = 0;
  this.scrollTo( 0 );
};


gux.fx.DummyScroller.prototype.lock = function( opt_y ) {

  if ( !goog.userAgent.MOBILE ) {
    this._eventHandler.unlisten( this._viewOuter, 'mousewheel', this.onMouseWheel, false, this );
  }

  this._eventHandler.unlisten( this._dummyOuter, 'scroll', this.onDummyScroll, false, this );

  goog.style.setStyle( this._scrollbar, 'visibility', 'hidden' );
  goog.style.setStyle( this._dummyOuter, 'overflow', 'hidden' );

  if ( goog.isNumber( opt_y ) ) {
    this.scrollTo( opt_y );
  }
};


gux.fx.DummyScroller.prototype.unlock = function() {

  if ( !goog.userAgent.MOBILE ) {
    this._eventHandler.listen( this._viewOuter, 'mousewheel', this.onMouseWheel, false, this );
  }

  this._eventHandler.listen( this._dummyOuter, 'scroll', this.onDummyScroll, false, this );

  goog.style.setStyle( this._scrollbar, 'visibility', 'visible' );
  goog.style.setStyle( this._dummyOuter, 'overflow', 'auto' );
};


gux.fx.DummyScroller.prototype.getProgress = function() {

  return Math.abs( this._viewInnerY / ( this._viewInnerHeight - this._viewOuterHeight ) );
};


gux.fx.DummyScroller.prototype.getScrollTop = function() {

  return this._viewInnerY;
};


gux.fx.DummyScroller.prototype.enableDummyScroll = function() {

  goog.style.setStyle( this._dummyOuter, 'visibility', 'visible' );
};


gux.fx.DummyScroller.prototype.disableDummyScroll = function() {

  goog.style.setStyle( this._dummyOuter, 'visibility', 'hidden' );
};


gux.fx.DummyScroller.prototype.addCallback = function( type, callback ) {

  goog.array.insert( this._callbacks[ type ], callback );
};


gux.fx.DummyScroller.prototype.removeCallback = function( type, callback ) {

  goog.array.remove( this._callbacks[ type ], callback );
};


gux.fx.DummyScroller.prototype.scrollTo = function( y ) {

  this._viewInnerY = Math.round( y );

  this._viewOuter.scrollTop = this._viewInnerY;

  var handleRatio = Math.abs( this._viewInnerY / this._viewInnerHeight );
  var handleY = Math.round( this._scrollbarHeight * handleRatio );
  goog.style.setStyle( this._handle, 'top', handleY + 'px' );

  // call update callbacks
  var updateCallbacks = this._callbacks[ gux.events.EventType.SCROLL_UPDATE ];
  var i, l = updateCallbacks.length;
  for ( i = 0; i < l; i++ ) {
    updateCallbacks[ i ]( this.getProgress(), this._viewInnerY );
  }
};


gux.fx.DummyScroller.prototype.resize = function() {

  this._viewOuterHeight = goog.style.getSize( this._viewOuter ).height;
  this._viewInnerHeight = this._viewOuter.scrollHeight;

  this._dummyOuterHeight = goog.style.getSize( this._dummyOuter ).height;
  this._dummyInnerHeight = this._viewInnerHeight * ( 1 / this._speed );
  goog.style.setHeight( this._dummyInner, this._dummyInnerHeight );

  // resize scrollbar
  var viewInnerHeightFraction = this._viewInnerHeight / this._viewOuterHeight;

  this._scrollbarHeight = goog.style.getSize( this._scrollbar ).height;

  this._handleHeight = this._scrollbarHeight / viewInnerHeightFraction;
  goog.style.setHeight( this._handle, this._handleHeight );

  this._draggerLimits.height = this._scrollbarHeight - this._handleHeight;
  this._dragger.setLimits( this._draggerLimits );
};


gux.fx.DummyScroller.prototype.onDummyScroll = function( e ) {

  this._dummyScrollRatio = goog.math.clamp(
    this._dummyOuter.scrollTop / ( this._dummyInnerHeight - this._dummyOuterHeight ), 0, 1 );

  if ( !this._isAnimating ) {

    this._isAnimating = true;
    goog.fx.anim.registerAnimation( this );
  }
};


gux.fx.DummyScroller.prototype.onMouseWheel = function( e ) {

  this.enableDummyScroll();

  this._disableDummyScrollDelay.start();
};


gux.fx.DummyScroller.prototype.onDragHandleStart = function( e ) {

  goog.dom.classlist.enable( this._scrollbar, 'dragging', true );
};


gux.fx.DummyScroller.prototype.onDragHandleEnd = function( e ) {

  goog.dom.classlist.enable( this._scrollbar, 'dragging', false );
};


gux.fx.DummyScroller.prototype.onDragHandle = function( e ) {

  var ratio = goog.math.clamp( e.dragger.deltaY / this._draggerLimits.height, 0, 1 );

  this._dummyOuter.scrollTop = ( this._dummyInnerHeight - this._dummyOuterHeight ) * ratio;
};


gux.fx.DummyScroller.prototype.onAnimationFrame = function( now ) {

  var startY = 0;
  var endY = this._viewInnerHeight - this._viewOuterHeight;

  var targetY = goog.math.lerp( startY, endY, this._dummyScrollRatio );

  this._viewInnerY += ( targetY - this._viewInnerY ) * this._ease;

  if ( goog.math.nearlyEquals( this._viewInnerY, targetY, 2 ) ) {

    this._viewInnerY = targetY;

    goog.fx.anim.unregisterAnimation( this );

    this._isAnimating = false;

    // call complete callbacks
    var completeCallbacks = this._callbacks[ gux.events.EventType.SCROLL_COMPLETE ];
    var i, l = completeCallbacks.length;
    for ( i = 0; i < l; i++ ) {
      completeCallbacks[ i ]( this.getProgress(), this._viewInnerY );
    }
  }

  this.scrollTo( this._viewInnerY );
};