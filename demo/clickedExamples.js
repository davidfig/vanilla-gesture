import { clicked } from '../code'
import { el } from '../code/helper'

function countTypes(e, count) {
    if (e.type === 'clicked') count.clicked++
    else if (e.type === 'double-clicked') count.doubleClicked++
    else if (e.type === 'long-clicked') count.longClicked++
    return `clicked (${count.clicked}), double-clicked (${count.doubleClicked}), long-clicked (${count.longClicked})`
}

export function clickedExamples() {
    let element1Count = 0
    clicked('.element-1', e => {
        el('.response-1').innerHTML = `${e.type} (${++element1Count})`
    })

    let element2Count = 0
    clicked('.element-2', e => {
        el('.response-2').innerHTML = `${e.type} (${++element2Count})`
    }, { doubleClicked: true, clicked: false })

    let element3Count = 0
    clicked('.element-3', e => {
        el('.response-3').innerHTML = `${e.type} (${++element3Count})`
    }, { longClicked: true, clicked: false })

    const element4Count = { clicked: 0, longClicked: 0, doubleClicked: 0}
    clicked('.element-4', e => {
        el('.response-4').innerHTML = countTypes(e, element4Count)
    }, { doubleClicked: true, longClicked: true })

    let element5Count = 0
    clicked('.element-5', e => {
        el('.response-5').innerHTML = `${e.type} (${++element5Count})`
    }, { doubleClicked: true, doubleClickedTime: 1000, clicked: false })

    let element6Count = 0
    clicked('.element-6', e => {
        el('.response-6').innerHTML = `${e.type} (${++element6Count})`
    }, { longClicked: true, longClickedTime: 1000, clicked: false })

    let element7Count = { clicked: 0, longClicked: 0, doubleClicked: 0 }
    clicked('.element-7', e => {
        el('.response-7').innerHTML = countTypes(e, element7Count)
    }, { mouse: 'right', longClicked: true, doubleClicked: true })

    let element8Count = { clicked: 0, longClicked: 0, doubleClicked: 0 }
    clicked('.element-8', e => {
        el('.response-8').innerHTML = countTypes(e, element8Count)
    }, { mouse: false, doubleClicked: true, longClicked: true })

    // let element9Count = 0
    // clicked('.element-9', e =>
    // {
    //     el('.response-9').innerHTML = `${e.type} (${++element9Count})`
    // }, { touch: false })
}
