goog.provide( 'gux.events' );

goog.require( 'goog.userAgent' );

gux.events.EventType = {
	ANIMATE_IN_START: 'animate_in_start',
	ANIMATE_OUT_START: 'animate_out_start',
	ANIMATE_IN_COMPLETE: 'animate_in_complete',
	ANIMATE_OUT_COMPLETE: 'animate_out_complete',
	SCROLL_START: 'scroll_start',
	SCROLL_UPDATE: 'scroll_update',
	SCROLL_COMPLETE: 'scroll_complete',
	LOAD_PAGE: 'load_page',
	SWITCH_PAGE: 'switch_page',
	LOAD_PROGRESS: 'load_progress',
	LOAD_COMPLETE: 'load_complete',
	ANIMATE_COMPLETE: 'animate_complete',
	OPEN: 'open',
	CLOSE: 'close',
	CLOSED: 'closed',
	DOWN: goog.userAgent.MOBILE ? 'touchstart' : 'mousedown',
	MOVE: goog.userAgent.MOBILE ? 'touchmove' : 'mousemove',
	UP: goog.userAgent.MOBILE ? [ 'touchend', 'touchcancel' ] : 'mouseup'
};