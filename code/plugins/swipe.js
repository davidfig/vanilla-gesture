import { el } from '../helper'
import { Gesture } from '../gesture'
import { Plugin } from './plugin'

const defaultOptions = {
    direction: 'all',
    mouse: true,
    touch: true,
    threshold: 20,
    singleSwipe: true,
}

/**
 * add an adjustable swipe handler on an element
 * @param {(HTMLElement | string}) element - element or querySelector query string (e.g., #id-name or .class-name)
 * @param {object} [options]
 * @param {('all'|'horizontal'|'vertical')} [direction=all]
 * @param {(boolean|'left'|'center'|'right'|'left-right'|'left-center'|'right-center'|'left-center')}[options.mouse=true] enable mouse swipe; optionally set which buttons to listen for mouse events: true = all
 * @param {(boolean|number)} [touch=true] enable touch swipe; optionally provide minimum number of touch points before registering a swipe
 * @param {number} [options.threshold=20] threshold of movement (in px) to register a swipe
 * @param {boolean} [singleSwipe=true] only allow 1 swipe per mousedown/touchstart, otherwise keep the swipe active; note that a simultaneous horizontal and vertical swipe may happen
 */
export function swipe(element, callback, options) {
    const e = el(element)
    let gesture
    if (e[Gesture.name]) {
        gesture = e[Gesture.name]
    } else {
        e[Gesture.name] = gesture = new Gesture(e)
    }
    const clicked = new Swipe(gesture, callback, options)
    gesture.addPlugin(clicked)
    return clicked

}

class Swipe extends Plugin {
    constructor(gesture, callback, options={}) {
        super(gesture)
        this.type = 'swipe'

        /**
         * callback function for swipe
         * @type {SwipeCallback}
         */
        this.callback = callback
        this._options = { ...defaultOptions, ...options }
        this._touchPoints = 0
    }

    /** cancel current event */
    cancel() {
        this._down = false
    }

    touchstart(e) {
        if (this._options.touch) {
            if (this._down) {
                this.cancel()
            } else {
                if (this._options.touch === true || e.touches.length >= this._options.touch) {
                    this._handleDown(e, e.changedTouches[0].screenX, e.changedTouches[0].screenY)
                }
            }
        }
    }

    touchmove(e) {
        if (this._down) {
            const x = e.changedTouches[0].screenX
            const y = e.changedTouches[0].screenY
            this._handleMove(e, x, y)
        }
        e.preventDefault()
    }

    documentTouchMove(e) {
        if (this._down) {
            const x = e.changedTouches[0].screenX
            const y = e.changedTouches[0].screenY
            this._handleMove(e, x, y)
        }
    }

    _checkMouseButtons(e) {
        if (this._options.mouse === false) {
            return false
        } else if (this._options.mouse === true) {
            return true
        } else if (e.button === 0) {
            return (this._options.mouse).includes('left')
        } else if (e.button === 1) {
            return (this._options.mouse).includes('middle')
        } else if (e.button === 2) {
            return (this._options.mouse).includes('right')
        }
    }

    mousedown(e) {
        if (this._checkMouseButtons(e)) {
            if (this._down === true) {
                this.cancel()
            } else {
                this._handleDown(e, e.screenX, e.screenY)
            }
        }
    }

    mouseMove(e) {
        if (this._down) {
            const x = e.screenX
            const y = e.screenY
            this._handleMove(e, x, y)
        }
    }

    documentMouseMove(e) {
        if (this._down) {
            const x = e.screenX
            const y = e.screenY
            this._handleMove(e, x, y)
        }
    }

    _handleDown(_, x, y) {
        this.lastX = x
        this.lastY = y
        this._down = true
    }

    _handleMove(e, x, y) {
        if (this._down) {
            const horizontal = (this._options.direction === 'all' || this._options.direction === 'horizontal') &&
                Math.abs(this.lastX - x) > this._options.threshold
            const vertical = (this._options.direction === 'all' || this._options.direction === 'vertical') &&
                Math.abs(this.lastY - y) > this._options.threshold
            if (horizontal) {
                this.callback({ event: e, type: 'swipe-horizontal', swipe: this, direction: x > this.lastX ? 'right' : 'left' })
                if (this._options.singleSwipe) {
                    this.cancel()
                } else {
                    this.lastX = x
                }
            }
            if (vertical) {
                this.callback({ event: e, type: 'swipe-vertical', swipe: this, direction: y > this.lastY ? 'down' : 'up' })
                if (this._options.singleSwipe) {
                    this.cancel()
                } else {
                    this.lastY = y
                }
            }
            e.preventDefault()
        }
    }

    mouseup() {
        if (this._down) {
            this.cancel()
        }
    }

    documentMouseUp(e) {
        if (this._down) {
            this.cancel()
        }
    }

    touchend() {
        if (this._down) {
            this.cancel()
        }
    }
}

/**
 * Callback for swipe events
 * @callback Swipe~SwipeCallback
 * @param {object} options
 * @param {UIEvent} options.event
 * @param {string} options.type
 * @param {'left'|'right'|'up'|'down'} options.direction
 * @param {Swipe} options.swipe
 */