'use strict'

const ModuleState = require('./Store')

class StoreWithSubscribes extends ModuleState {
    #subscribes = []
    constructor(initialState, delay, onUpdateCallback) {
        super(initialState, delay, (...args) => {
            this.#onUpdate.call(this, ...args)
            onUpdateCallback?.(...args)
        })

    }

    #onUpdate() {
        const newState = { ...this.state }
        for (let i = 0; i < this.#subscribes.length; i++) {
            this.#subscribes[i](newState)
        }
    }

    subscribe(callback) {
        this.#subscribes.push(callback)
    }

    unsubscribe(callback) {
        this.#subscribes = this.#subscribes.filter(v => v !== callback)
    }
}

module.exports = StoreWithSubscribes
