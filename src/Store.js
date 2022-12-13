'use strict'

const debounce = require('./debounce')

class Store {
    state
    initialState
    #triggerUpdate

    #getState (initialState) {
        return new Proxy({ ...initialState }, {
            set: (obj, prop, value) => {
                obj[prop] = value
                this.#triggerUpdate()
                return true
            },
        })
    }

    constructor(initialState = {}, delay = 100, onUpdate = () => {}) {
        this.initialState = initialState
        this.#triggerUpdate = delay !== -1 ? debounce(onUpdate, delay) : onUpdate
        this.state = this.#getState(initialState)

        Object.defineProperty(this, 'state', { writable: false })
    }

    reset() {
        Object.defineProperty(this, 'state', { writable: true })
        this.state = this.#getState(this.initialState)
        Object.defineProperty(this, 'state', { writable: false })
        this.#triggerUpdate()
    }
}



module.exports = Store
