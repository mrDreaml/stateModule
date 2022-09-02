'use strict'

const assert = require('assert')
const Store = require('./Store')

const wait = delay => new Promise(res => setTimeout(res, delay))

describe('Store', function () {
    describe('check changing value', function () {
        it('check reset',  function () {
            const myStore = new Store({}, 0)
            myStore.state.a = 1
            myStore.reset()
            assert.deepEqual(myStore.state, {})
        })
        it('change value, without onUpdate',  function () {
            const { state } = new Store({}, 0)
            state.a = 1
            state.b = [1, 2, 3]
            assert.deepEqual(state, { a: 1, b: [1, 2, 3] })
        })
        it('change value, with onUpdate', async function () {
            const updates = []
            const MyStore = new Store({}, 10, () => {
                updates.push({ ...MyStore.state })
            })
            MyStore.state.a = 1
            MyStore.state.b = 2
            await wait(100)
            assert.deepEqual(updates, [{ a: 1, b: 2 }])
        })
        it('change value, with onUpdate with delay', async function () {
            const updates = []
            const MyStore = new Store({}, 10, () => {
                updates.push({ ...MyStore.state })
            })
            MyStore.state.a = 1
            await wait(20)
            MyStore.state.b = 2
            await wait(20)
            assert.deepEqual(updates, [{ a: 1 }, { a: 1, b: 2 }])
        })
        it('change value, with onUpdate with delay batch', async function () {
            const updates = []
            const MyStore = new Store({}, 10, () => {
                updates.push({ ...MyStore.state })
            })
            MyStore.state.a = 1
            MyStore.state.c = 3
            await wait(20)
            MyStore.state.b = 2
            MyStore.state.d = 4
            await wait(20)
            assert.deepEqual(updates, [{ a: 1, c: 3 }, { a: 1, c: 3, b: 2, d: 4 }])
        })
        it('change value, sync', function () {
            const updates = []
            const MyStore = new Store({}, -1, () => {
                updates.push({ ...MyStore.state })
            })
            MyStore.state.a = 1
            MyStore.state.b = 2
            assert.deepEqual(updates, [{ a: 1 }, { a: 1, b: 2 }])
        })
        it('change value, sync without onUpdate', function () {
            const MyStore = new Store({}, -1)
            MyStore.state.a = 1
            MyStore.state.b = 2
            assert.deepEqual(MyStore.state, { a: 1, b: 2 })
        })
        it('reassign state, sync', function () {
            const MyStore = new Store({}, -1)
            assert.throws(() => MyStore.state = { a: 1 }, Error)
        })
    })
})
