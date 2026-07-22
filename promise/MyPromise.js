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

    then(onFulfilledCallback, onRejectedCallback) {
        return new MyPromise((resolve, reject) => {
            if (this.state === "pending") {
                this.onFulfilledCallbacks.push(() => {
                    let result = onFulfilledCallback(this.value)
                    resolve(result)
                })
                this.onRejectedCallbacks.push(() => {
                    let result = onRejectedCallback(this.reason)
                    resolve(result) 
                })
            } else {
                if (this.state === "fulfilled") {
                    queueMicrotask(() => {
                        let result = onFulfilledCallback(this.value)
                        resolve(result)
                    })
                } else {
                    queueMicrotask(() => {
                        let result = onRejectedCallback(this.reason)
                        resolve(result)
                    })
                }
            }
        })
    }
}

const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject("error")
    }, 2000)
})


const res = promise
    .then(
        (val) => console.log(val),
        (err) => console.log(err)
    )
console.log(res)


// const res = promise
//     .then(val => val + "!")
//     .then(val => val + "!")
//     .then(val => console.log(val))

// console.log("s1")

// promise.then(val => console.log(val + " 1"))
// promise.then(val => console.log(val + " 2"))
// promise.then(val => console.log(val + " 3"))

// console.log("s2")

module.exports = MyPromise
