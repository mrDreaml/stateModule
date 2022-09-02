'use strict'

const assert = require('assert')
const debounce = require('./debounce')

describe('debounce', function () {
    it('1', async function () {
        const arr = []
        const update = debounce((i) => arr.push(i), 100)
        let counter = 0
        await Promise.all([
        new Promise(res => {
            setTimeout(() => {
                res()
                update(counter++)
            }, 10)
        }),
        new Promise(res => {
            setTimeout(() => {
                res()
                update(counter++)
            }, 20)
        }),
        new Promise(res => {
            setTimeout(() => {
                res()
                update(counter++)
            }, 30)
        }),
        new Promise(res => {
            setTimeout(() => {
                res()
                update(counter++)
            }, 40)
        }),
        new Promise(res => {
            setTimeout(() => {
                res()
            }, 1000)
        })
    ])
        assert.deepEqual(arr, [3]);
    });

    it('2', async function () {
        const arr = []
        const update = debounce((i) => arr.push(i), 100)
        let counter = 0
        await Promise.all([
            new Promise(res => {
                setTimeout(() => {
                    res()
                    update(counter++)
                }, 10)
            }),
            new Promise(res => {
                setTimeout(() => {
                    res()
                    update(counter++)
                }, 110)
            }),
            new Promise(res => {
                setTimeout(() => {
                    res()
                }, 1000)
            })
        ])
        assert.deepEqual(arr, [0, 1]);
    });

    it('3', async function () {
        const arr = []
        const update = debounce((i) => arr.push(i), 100)
        let counter = 0
        await Promise.all([
            new Promise(res => {
                setTimeout(() => {
                    res()
                    update(counter++)
                }, 10)
            }),
            new Promise(res => {
                setTimeout(() => {
                    res()
                    update(counter++)
                }, 20)
            }),
            new Promise(res => {
                setTimeout(() => {
                    res()
                    update(counter++)
                }, 110)
            }),
            new Promise(res => {
                setTimeout(() => {
                    res()
                    update(counter++)
                }, 120)
            }),
            new Promise(res => {
                setTimeout(() => {
                    res()
                }, 1000)
            })
        ])
        assert.deepEqual(arr, [1, 3]);
    });

    it('4', async function () {
        const arr = []
        const update = debounce((i) => arr.push(i), 20)
        let counter = 0
        await Promise.all([
            new Promise(res => {
                setTimeout(() => {
                    res()
                    update(counter++)
                }, 0)
            }),
            new Promise(res => {
                setTimeout(() => {
                    res()
                    update(counter++)
                }, 50)
            }),
            new Promise(res => {
                setTimeout(() => {
                    res()
                    update(counter++)
                }, 100)
            }),
            new Promise(res => {
                setTimeout(() => {
                    res()
                    update(counter++)
                }, 150)
            }),
            new Promise(res => {
                setTimeout(() => {
                    res()
                }, 1000)
            })
        ])
        assert.deepEqual(arr, [0, 1, 2, 3]);
    });
});
