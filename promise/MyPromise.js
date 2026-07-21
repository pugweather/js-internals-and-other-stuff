class MyPromise {
    constructor(executor) {
        this.state = "pending"
        this.value = null
        this.reason = null
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []

        const resolve = (data) => {
            if (this.state !== "pending") return
            this.state = "fulfilled"
            this.value = data
            queueMicrotask(() => this.onFulfilledCallbacks.forEach(cb => cb(this.value)))
        }
    
        const reject = (data) => {
            if (this.state !== "pending") return
            this.state = "rejected"
            this.reason = data
            queueMicrotask(() => this.onRejectedCallbacks.forEach(cb => cb(this.reason)))
        }

        try {
            executor(resolve, reject)
        } catch(err) {
            reject(err)
        }
    }

    then(callback) {
        return new MyPromise((resolve, reject) => {
            if (this.state === "pending") {
                this.onFulfilledCallbacks.push(() => {
                    let result = callback(this.value)
                    resolve(result)
                })
            } else {
                queueMicrotask(() => {
                    let result = callback(this.value)
                    resolve(result)
                })
            }
        })
    }
}

const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve("yay")
    }, 2000)
})


const res = promise
    .then(val => val + "!")
    .then(val => val + "!")
    .then(val => console.log(val))

// console.log("s1")

// promise.then(val => console.log(val + " 1"))
// promise.then(val => console.log(val + " 2"))
// promise.then(val => console.log(val + " 3"))

// console.log("s2")

module.exports = MyPromise
