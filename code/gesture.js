/** Gesture class for watching an element */
export class Gesture {
    /**
     *
     * @param {HTMLElement} element
     * @param {object} [options]
     * @param {boolean} [options.capture] events will be dispatched to this registered listener before being dispatched to any EventTarget beneath it in the DOM tree
     */
    constructor(element, options) {
        /**
         * HTMLElement that this Gesture object handles
         * @type {HTMLElement}
         * @readonly
         */
        this.element = element
        this._options = { capture: false }
        /**
         * Plugins currently active on this element
         * @type {Plugin[]}
         */
        this.plugins = []
        this._createListeners()
    }

    /**
     * name of variable added to an HTMLElement that holds the gesture class for that element (defaults to __vanilla_gesture)
     * @type {string}
     */
    static get name() {
        return Gesture._name
    }
    static set name(value) {
        Gesture.name = value
    }

    /**
     * adds a plugin to a gesture class
     * @param {Plugin} plugin
     */
    addPlugin(plugin) {
        this.plugins.push(plugin)
    }

    /**
     * removes a plugin from the gesture class
     * @param {Plugin} plugin
     */
    removePlugin(plugin) {
        const index = this.plugins.indexOf(plugin)
        if (index !== -1) {
            this.plugins.splice(index, 1)
        }
        if (this.plugins.length === 0) {
            delete this.element[Gesture.name]
            this.destroy()
        }
    }

    _createListeners() {
        this._events = {
            mousedown: e => this.mousedown(e),
            mouseup: e => this.mouseup(e),
            mousemove: e => this.mousemove(e),
            touchstart: e => this.touchstart(e),
            touchmove: e => this.touchmove(e),
            touchcancel: () => this.cancel(),
            touchend: e => this.touchend(e),
            documentMouseMove: e => this.documentMouseMove(e),
            documentMouseUp: e => this.documentMouseUp(e),
            documentTouchMove: e => this.documentTouchMove(e),
            documentTouchEnd: e => this.documentTouchEnd(e),
        }
        this.element.addEventListener('mousedown', this._events.mousedown, { capture: this._options.capture })
        this.element.addEventListener('mouseup', this._events.mouseup, { capture: this._options.capture })
        this.element.addEventListener('mousemove', this._events.mousemove, { capture: this._options.capture })
        this.element.addEventListener('touchstart', this._events.touchstart, { passive: true, capture: this._options.capture })
        this.element.addEventListener('touchmove', this._events.touchmove, { passive: false, capture: this._options.capture })
        this.element.addEventListener('touchcancel', this._events.touchcancel, { capture: this._options.capture })
        this.element.addEventListener('touchend', this._events.touchend, { capture: this._options.capture })
        // passive is not right :(
        document.body.addEventListener('mousemove', this._events.documentMouseMove, { passive: false, capture: this._options.capture })
        document.body.addEventListener('mouseup', this._events.documentMouseUp, { capture: this._options.capture })
    }

    /** removes event listeners and cleans up */
    destroy() {
        this.plugins = []
        this.element[Gesture.name] = null
        this.element.removeEventListener('mousedown', this._events.mousedown)
        this.element.removeEventListener('mouseup', this._events.mouseup)
        this.element.removeEventListener('mousemove', this._events.mousemove)
        this.element.removeEventListener('touchstart', this._events.touchstart)
        this.element.removeEventListener('touchmove', this._events.touchmove)
        this.element.removeEventListener('touchcancel', this._events.touchend)
        this.element.removeEventListener('touchend', this._events.touchend)
        document.body.removeEventListener('mousemove', this._events.documentMouseMove)
        document.body.removeEventListener('mouseup', this._events.documentMouseUp)
        document.body.removeEventListener('touchmove', this._events.documentTouchMove)
        document.body.removeEventListener('touchend', this._events.documentTouchEnd)
    }

    mousedown(e) {
        for (const plugin of this.plugins) {
            plugin.mousedown(e)
        }
    }

    mousemove(e) {
        for (const plugin of this.plugins) {
            plugin.mousemove(e)
        }
    }

    mouseup(e) {
        for (const plugin of this.plugins) {
            plugin.mouseup(e)
        }
    }

    touchstart(e) {
        for (const plugin of this.plugins) {
            plugin.touchstart(e)
        }
    }

    touchmove(e) {
        for (const plugin of this.plugins) {
            plugin.touchmove(e)
        }
    }

    touchend(e) {
        for (const plugin of this.plugins) {
            plugin.touchend(e)
        }
    }

    documentMouseMove(e) {
        for (const plugin of this.plugins) {
            plugin.documentMouseMove(e)
        }

    }

    documentMouseUp(e) {
        for (const plugin of this.plugins) {
            plugin.documentMouseUp(e)
        }

    }

    documentTouchMove(e) {
        for (const plugin of this.plugins) {
            plugin.documentTouchMove(e)
        }

    }

    documentTouchEnd(e) {
        for (const plugin of this.plugins) {
            plugin.documentTouchEnd(e)
        }
    }
}

Gesture._name = '__vanilla_gesture'