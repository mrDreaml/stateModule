'use strict'

const debounce = (callback, delay) => {
    let startTime = performance.now()
    let timer = null
    return (...p) => {
        const currentTime = performance.now()
        clearTimeout(timer)
        timer = setTimeout(() => {
            callback(...p)
            startTime = currentTime
            clearTimeout(timer)
        }, startTime - currentTime + delay)
    }
}

module.exports = debounce
