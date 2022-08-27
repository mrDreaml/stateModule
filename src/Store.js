'use strict'

const batchUpdates = (callback, delay) => {
    let startTime = performance.now()
    let timer = null
    return (...p) => {
        const currentTime = performance.now()
        if (currentTime - startTime > delay) {
            callback(...p)
            startTime = currentTime
            clearTimeout(timer)
        } else {
            clearTimeout(timer)
            timer = setTimeout(() => {
                callback(...p)
                startTime = performance.now()
                clearTimeout(timer)
            }, delay - currentTime + startTime)
        }
    }
}

class Store {
    state
    initialState
    #triggerUpdate
    constructor(initialState = {}, delay = 100, onUpdate) {
        this.initialState = initialState
        this.#triggerUpdate = batchUpdates(onUpdate, delay)
        this.state = new Proxy({ ...initialState }, {
            set: (obj, prop, value) => {
                obj[prop] = value
                this.#triggerUpdate()
                return true
            },
        })

        Object.defineProperty(this, 'state', { writable: false })
    }

    reset() {
        Object.defineProperty(this, 'state', { writable: true })
        this.state = { ...this.initialState }
        Object.defineProperty(this, 'state', { writable: false })
        this.#triggerUpdate()
    }
}



module.exports = Store
