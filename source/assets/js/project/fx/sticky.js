goog.provide( 'gux.fx.Sticky' );

goog.require( 'goog.Disposable' );
goog.require( 'goog.dom' );
goog.require( 'goog.style' );


gux.fx.Sticky = function( element, scrollerElement, opt_autoRender ) {

	goog.base( this );

	this.el = element;
	this._parentEl = goog.dom.getParentElement( this.el );
	this._scrollerEl = scrollerElement;

	this._stickyPosition = .5;

	switch ( element.getAttribute( 'data-sticky-position' ) ) {
		case 'top':
			this._stickyPosition = 0;
			break;

		case 'bottom':
			this._stickyPosition = 1;
			break;
	}

	this._elHeight = 0; // element height
	this._parentHeight = 0;
	this._top = 0; // relative to scroller
	this._marginTop = 0; // offset to align element at vertical center
	this._y = 0;
	this._prevY = 0;

	this._autoRender = goog.isBoolean( opt_autoRender ) ? opt_autoRender : true;
	this._eventHandler = new goog.events.EventHandler( this );
};
goog.inherits( gux.fx.Sticky, goog.Disposable );


gux.fx.Sticky.prototype.disposeInternal = function() {

	this.deactivate();

	this.el = null;
	this._parentEl = null;
	this._scrollerEl = null;

	goog.base( this, 'disposeInternal' );
};


gux.fx.Sticky.prototype.activate = function() {

	this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );

	if ( this._autoRender ) {
		this._eventHandler.listen( this._scrollerEl, goog.events.EventType.SCROLL, this.render, false, this );
	}

	this.resize();
	this.render();
};


gux.fx.Sticky.prototype.deactivate = function() {

	this._eventHandler.removeAll();
};


gux.fx.Sticky.prototype.resize = function() {

	this._elHeight = goog.style.getSize( this.el ).height;

	this._top = goog.style.getPosition( this._parentEl ).y;
	this._bottom = goog.style.getSize( this._parentEl ).height - this._elHeight;

	this._marginTop = ( goog.dom.getViewportSize().height - this._elHeight ) * this._stickyPosition;

	this.render();
};


gux.fx.Sticky.prototype.render = function( opt_scrollTop ) {

	var scrollTop = goog.isNumber( opt_scrollTop ) ? opt_scrollTop : this._scrollerEl.scrollTop;
	scrollTop += this._marginTop;

	var y = Math.min( Math.max( scrollTop - this._top, 0 ), this._bottom );

	if ( this._prevY === y ) {

		return;

	} else {

		this._prevY = y;
		this._y = y;
	}

	goog.style.setStyle( this.el, 'transform', 'translateY(' + this._y + 'px)' );
};