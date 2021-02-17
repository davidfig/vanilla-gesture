# vanilla-gesture
Configurable vanilla input handler for swipe, click, double-click, long-click that works with both mouse and touch.

## rationale

I decided to expand on https://www.npmjs.com/package/clicked to add additional gestures as a replacement for the seemingly defunct hammer.js. I plan to add a few more gestures as I need them (viz., pinch) Let me know if you have other suggested gestures.

## usage
```import { clicked, swipe } from 'vanilla-gesture'```

or

``` const { clicked, swipe } = require('vanilla-gesture')```
## demo
https://davidfig.github.io/vanilla-gesture/

## example
```js
import { clicked, swipe } from 'vanilla-gesture'

function handleClick()
{
   console.log('I was clicked.')
}
const div = document.getElementById('clickme')
const c = clicked(div, handleClick, { threshold: 15 })

// change callback
c.callback = () => console.log('different clicker')

// destroy
c.destroy()

// using built-in querySelector
clicked('#clickme', handleClick2)

// support for all types of clicks
function handleAllClicks(e) {
    switch (e.type)
    {
        case 'clicked': ...
        case 'double-clicked': ...
        case 'long-clicked': ...
    }
    // view UIEvent that caused callback
    console.log(e.event)
}
clicked('#clickme', handleAllClicks, { doubleClick: true, longClick: true })

function handleAllSwipes(results) {
    console.log('swiping', results.direction)
}

swipe('#clickme', handleAllSwipes, { direction: 'horizontal' })
```

## API

### clicked(element, callback, options) : Clicked
creates Clicked object for element

|name|type|default|description|
|---|---|---|---|
|element|HTMLElement or string||element or querySelector entry (e.g., #id-name or .class-name)|
|callback|ClickedCallback||callback called after clicked
|[options]|object||optional options|
|[options].clicked|boolean|true|dispatch event for clicked
|[options].threshold|number|10|threshold of movement to cancel all events
|[options.mouse]|boolean or 'left' or 'right' 'middle' or 'left-right' or 'left-middle' or 'right-middle'|true|whether to listen for mouse events; can also be used to set which mouse buttons are active
|[options.touch]|boolean or number|1|whether to listen for touch events; can also be used to set the number of touch points to accept
|[options.doubleClick]|boolean|false|dispatch events for double click
|[options.doubleClickTime]]|number|500|wait time in millseconds for double click
|[options.longClick]]|boolean|false|enable watcher for long click
|[options.longClickTime]]|boolean|500|wait time for long click
|[options.clickDown]|boolean|dispatch event for click down (ie, after touchstart or mousedown callback will be called with type 'click-down')
|[options.capture]|boolean|false|events will be dispatched to this registered listener before being dispatched to any EventTarget beneath it in the DOM tree

### Clicked
returned by clicked(...)

### Clicked.destroy()
removes clicked event on element and cleans up Gesture if no more gestures

### Clicked.callback (function): ClickedCallback

|name|type|description
|---|---|---|
|event|MouseEvent or TouchEvent|mouse or touch event that triggered callback|
|type|'clicked' or 'double-clicked' or 'long-clicked' or 'click-down'|type of click|

### Clicked.cancel()
cancel any outstanding events

### swipe(element, callback, options) : Swipe
creates Swipe object for element

|name|type|default|description|
|---|---|---|---|
|element|HTMLElement or string||element or querySelector query string (e.g., #id-name or .class-name)|
|[options]|object||optional options|
|[options.direction]|'all'|'horizontal'|'vertical'|all|direction to allow swipes|
|[options.mouse]|boolean|'left'|'center'|'right'|'left-right'|'left-center'|'right-center'|'left-center'|true|enable mouse swipe; optionally set which buttons to listen for mouse events: true = all
|[options.touch]|boolean|number|true|enable touch swipe; optionally provide minimum number of touch points before registering a swipe|
|[options.threshold]|number|20 threshold of movement (in px) to register a swipe|
|[options.singleSwipe|boolean|true|only allow 1 swipe per mousedown/touchstart, otherwise keep the swipe active; note that a simultaneous horizontal and vertical swipe may happen|

### Swipe
returned by swipe(...)

### Swipe.destroy()
removes swipe event on element and cleans up Gesture if no more gestures

### Swipe.callback (function): CancelCallback

### Swipe.cancel()
cancel any outstanding events

## demo
```npm run demo```

Open browser to https://localhost:1234/

## license
MIT License
(c) 2021 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](mailto://david@yopeyopey.com)
