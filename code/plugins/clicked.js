import { el } from '../helper'
import { Gesture } from '../gesture'
import { Plugin } from './plugin'

const defaultOptions = {
    threshold: 10,
    clicked: true,
    mouse: true,
    touch: 1,
    doubleClicked: false,
    doubleClickedTime: 300,
    longClicked: false,
    longClickedTime: 500,
    capture: false,
    clickDown: false,
}

/**
 * add an adjustable clicked handler on an element
 * @param {(HTMLElement | string}) element - element or querySelector query string (e.g., #id-name or .class-name)
 * @param {ClickedCallback} callback called after a click, double click, and/or long click is registered
 * @param {object} [options]
 * @param {boolean} [options.clicked=true] call callback when clicked
 * @param {number} [options.threshold=10] threshold of movement to cancel all events
 * @param {(boolean|'left'|'center'|'right'|'left-right'|'left-center'|'right-center'|'left-center')}[options.mouse=true] enable mouse clicks; optionally set which buttons to register for mouse events: true = all
 * @param {(boolean|number)} [options.touch=1] how many touch points to listen for touch events (0 or false is disable touch; true is all touch points)
 * @param {boolean} [options.doubleClicked=false] call callback when double clicked
 * @param {number} [options.doubleClickedTime=500] wait time in milliseconds for double click
 * @param {boolean} [options.longClicked=false] call callback when long clicked
 * @param {number} [options.longClickedTime=500] wait time for long click
 * @param {boolean} [options.clickDown=false] call callback on click down - ie, when mousedown/touchstart is received
 * @param {boolean} [options.capture=false] events will be dispatched to this registered listener before being dispatched to any EventTarget beneath it in the DOM tree
 * @returns {Clicked}
 */
export function clicked(element, callback, options) {
    const e = el(element)
    let gesture
    if (e[Gesture.name]) {
        gesture = e[Gesture.name]
    } else {
        e[Gesture.name] = gesture = new Gesture(e)
    }
    const clicked = new Clicked(gesture, callback, options)
    gesture.addPlugin(clicked)
    return clicked
}

class Clicked extends Plugin {
    constructor(gesture, callback, options = {}) {
        super(gesture)

        /**
         * callback function for clicked
         * @type {ClickedCallback}
         */
        this.callback = callback
        this._options = { ...defaultOptions, ...options }
    }

    touchstart(e) {
        if (this._options.touch) {
            if (this._down === true) {
                this.cancel()
            } else {
                if (this._options.touch === true || e.touches.length <= this._options.touch) {
                    this._handleDown(e, e.changedTouches[0].screenX, e.changedTouches[0].screenY)
                }
            }
        }
    }

    _pastThreshold(x, y) {
        return Math.abs(this.lastX - x) > this._options.threshold || Math.abs(this.lastY - y) > this._options.threshold
    }

    touchmove(e) {
        if (this._down) {
            if (e.touches.length !== 1) {
                this.cancel()
            } else {
                const x = e.changedTouches[0].screenX
                const y = e.changedTouches[0].screenY
                if (this._pastThreshold(x, y)) {
                    this.cancel()
                }
            }
        }
    }

    /** cancel current event */
    cancel() {
        this._down = false
        if (this._doubleClickedTimeout) {
            clearTimeout(this._doubleClickedTimeout)
            this._doubleClickedTimeout = null
        }
        if (this._longClickedTimeout) {
            clearTimeout(this._longClickedTimeout)
            this._longClickedTimeout = null
        }
    }

    touchend(e) {
        if (this._down) {
            e.preventDefault()
            this._handleClicks(e)
        }
    }

    _handleClicks(e) {
        if (this._options.doubleClicked) {
            this._doubleClickedTimeout = this._setTimeout(() => this._doubleClickedCancel(e), this._options.doubleClickedTime)
        } else if (this._options.clicked) {
            this.callback({ event: e, type: 'clicked', clicked: this })
        }
        if (this._longClickedTimeout) {
            clearTimeout(this._longClickedTimeout)
            this._longClickedTimeout = null
        }
        this._down = false
    }

    _handleDown(e, x, y) {
        if (this._doubleClickedTimeout) {
            if (this._pastThreshold(x, y)) {
                if (this._options.clicked) {
                    this.callback({ event: e, type: 'clicked' })
                }
                this.cancel()
            } else {
                this.callback({ event: e, type: 'double-clicked' })
                this.cancel()
            }
        } else {
            this.lastX = x
            this.lastY = y
            this._down = true
            if (this._options.longClicked) {
                this._longClickedTimeout = this._setTimeout(() => this.longClicked(e), this._options.longClickedTime)
            }
            if (this._options.clickDown) {
                this.callback({ event: e, type: 'click-down' })
            }
        }
    }

    longClicked(e) {
        this._longClickedTimeout = null
        this._down = false
        this.callback({ event: e, type: 'long-clicked', clicked: this })
    }

    _doubleClickedCancel(e) {
        this._doubleClickedTimeout = null
        if (this._options.clicked) {
            this.callback({ event: e, type: 'clicked', clicked: this })
        }
    }

    _checkMouseButtons(e) {
        if (this._options.mouse === false) {
            return false
        } else if (this._options.mouse === true) {
            return true
        } else if (e.button === 0) {
            return (this._options.mouse).indexOf('left') !== -1
        } else if (e.button === 1) {
            return (this._options.mouse).indexOf('middle') !== -1
        } else if (e.button === 2) {
            return (this._options.mouse).indexOf('right') !== -1
        }
    }

    mousedown(e) {
        if (this._checkMouseButtons(e)) {
            if (this._down === true) {
                this._down = false
            } else {
                this._handleDown(e, e.screenX, e.screenY)
            }
        }
    }

    mousemove(e) {
        if (this._down) {
            const x = e.screenX
            const y = e.screenY
            if (this._pastThreshold(x, y)) {
                this.cancel()
            }
        }
    }

    mouseup(e) {
        if (this._down) {
            e.preventDefault()
            this._handleClicks(e)
        }
    }

    _setTimeout(callback, time) {
        return setTimeout(callback, time)
    }
}

/**
 * Callback for clicked events
 * @callback Clicked~ClickedCallback
 * @param {object} options
 * @param {UIEvent} options.event
 * @param {('clicked'|'double-clicked'|'long-clicked'|'click-down')} options.type
 * @param {Clicked} options.clicked
 */