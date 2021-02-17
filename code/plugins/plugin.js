/** Base class for all Plugins */
export class Plugin {
    /** @param {Gesture} gesture object on the element */
    constructor(gesture) {
        /**
         * gesture object on the element
         * @type {Gesture}
         */
        this.gesture = gesture

        /**
         * type of plugin
         * @type {string}
         */
        this.type = 'plugin'
    }

    /** removes this plugin from the element */
    remove() {
        this.gesture.removePlugin(this)
    }

    /** pauses this plugin */
    pause() {
        this._paused = true
    }

    /** resumes this plugin */
    resume() {
        this._paused = false
    }

    mousedown() {}
    mousemove() {}
    mouseup() {}
    touchstart() {}
    touchmove() {}
    touchend() {}
    documentMouseMove() {}
    documentMouseUp() {}
    documentTouchMove() {}
    documentTouchEnd() {}
}