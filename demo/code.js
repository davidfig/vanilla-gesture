import { clickedExamples } from './clickedExamples'
import { swipeExamples } from './swipeExamples'

window.onload = () => {
    clickedExamples()
    swipeExamples()
    // hide context menu during right click
    window.addEventListener('contextmenu', (e) => e.preventDefault())
}