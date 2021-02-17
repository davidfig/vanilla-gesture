/**
 * Finds an element using querySelector if needed
 * @param {(HTMLElement|string)} el Element or string to query
 * @param {HTMLElement} [parent=document.body] use this parent for the query
 * @returns {HTMLElement}
 */
export function el(el, parent = document.body) {
    if (typeof el === 'string') {
        return parent.querySelector(el)
    } else {
        return el
    }
}
