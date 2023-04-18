'use strict'

const assert = require('assert')
const Store = require('./Store')

const wait = delay => new Promise(res => setTimeout(res, delay))

describe('Store', function () {
    describe('check reset state', function () {
        it('sync',  function () {
            const states = []
            const myStore = new Store({}, -1, () => states.push({ ...myStore.state }))
            myStore.state.a = 1
            myStore.state.b = 2
            myStore.reset()
            myStore.state.a = 3
            myStore.state.b = 4
            assert.deepEqual(states, [{ a: 1 }, { a: 1, b: 2 }, {}, { a: 3 }, { a: 3, b: 4 }])
        })
        it('async',  function (done) {
            const states = []
            const myStore = new Store({}, 10, () => states.push({ ...myStore.state }))
            setTimeout(() => {
                myStore.state.a = 1
                myStore.state.b = 2
            }, 0)
            setTimeout(() => {
                myStore.reset()
            }, 20)
            setTimeout(() => {
                myStore.state.a = 3
                myStore.state.b = 4
            }, 40)
            setTimeout(() => {
                assert.deepEqual(states, [{ a: 1, b: 2 }, {},{ a: 3, b: 4 }])
                done()
            }, 60)
        })
    })
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

    describe('check forceUpdate value', function () {
        it('check reset', function () {
            let updateIndicator = 0

            const myStore = new Store({}, -1, () => updateIndicator++)
            myStore.state.a = [1, 2,3 ]
            myStore.state.a.pop()
            myStore.triggerUpdate()
            assert.equal(updateIndicator, 2)
        })
    })
})
