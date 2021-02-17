import { swipe } from '../code'
import { el } from '../code/helper'

function countTypes(e, count) {
    if (e.direction === 'left') count.left++
    else if (e.direction === 'right') count.right++
    else if (e.direction === 'up') count.up++
    else if (e.direction === 'down') count.down++
    return `left (${count.left}), right (${count.right}), up (${count.up}), down (${count.down})`
}

export function swipeExamples() {
    let element1Count = { left: 0, right: 0, up: 0, down: 0 }
    swipe('.swipe-element-1', e => {
        el('.swipe-response-1').innerHTML = countTypes(e, element1Count)
    })
    let element2Count = 0
    swipe('.swipe-element-2', e => {
        el('.swipe-response-2').innerHTML = `${e.type} (${++element2Count})`
    }, { direction: 'horizontal' })
    let element2aCount = 0
    swipe('.swipe-element-2a', e => {
        el('.swipe-response-2a').innerHTML = `${e.type} (${++element2aCount})`
    }, { direction: 'vertical' })
    let element3Count = { left: 0, right: 0, up: 0, down: 0 }
    swipe('.swipe-element-3', e => {
        el('.swipe-response-3').innerHTML = countTypes(e, element3Count)
    }, { mouse: false })
    let element4Count = { left: 0, right: 0, up: 0, down: 0 }
    swipe('.swipe-element-4', e => {
        el('.swipe-response-4').innerHTML = countTypes(e, element4Count)
    }, { touch: false })
    let element5Count = { left: 0, right: 0, up: 0, down: 0 }
    swipe('.swipe-element-5', e => {
        el('.swipe-response-5').innerHTML = countTypes(e, element5Count)
    }, { mouse: 'right' })
}
