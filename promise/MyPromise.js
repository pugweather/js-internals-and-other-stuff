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
            console.log(this)
        }
    
        const reject = (data) => {
            if (this.state !== "pending") return
            this.state = "rejected"
            this.reason = data
            queueMicrotask(() => this.onRejectedCallbacks.forEach(cb => cb(this.reason)))
            console.log(this)
        }

        try {
            executor(resolve, reject)
        } catch(err) {
            reject(err)
        }
    }

    then(onFulfilledCallback, onRejectedCallback) {
        // Can rename the resolve and reject params btw
        return new MyPromise((resolve, reject) => {
            if (this.state === "pending") {
                this.onFulfilledCallbacks.push(() => {
                    try {
                        // If cb function isn't passed just resolve with the current value or reason of previous promise
                        if (typeof onFulfilledCallback === "function") {
                            let result = onFulfilledCallback(this.value)
                            if (typeof result.then === "function") {
                                result.then(resolve, reject)
                            } else {
                                resolve(result)
                            }
                        } else {
                            resolve(this.value)
                        }
                    } catch(err) {
                        reject(err)
                    }
                })
                this.onRejectedCallbacks.push(() => {
                    try {
                        if (typeof onRejectedCallback === "function") {
                            let result = onRejectedCallback(this.reason)
                            if (typeof result.then === "function") {
                                result.then(resolve, reject) 
                            } else {
                                resolve(result)
                            }
                        } else {
                            resolve(this.reason)
                        }
                    } catch(err) {
                        reject(err)
                    }
                })
            } else {
                if (this.state === "fulfilled") {
                    queueMicrotask(() => {
                        try {
                            if (typeof onFulfilledCallback === "function") {
                                let result = onFulfilledCallback(this.value)
                                if (typeof result.then === "function") {
                                    result.then(resolve, reject)
                                } else {
                                    resolve(result)
                                }
                            } else {
                                resolve(this.value)
                            }
                        } catch(err) {  
                            reject(err)
                        }
                    })
                } else {
                    queueMicrotask(() => {
                        try {
                            if (typeof onRejectedCallback === "function") {
                                let result = onRejectedCallback(this.reason)
                                if (typeof result.then === "function") {
                                    // Inner promise (one inside cb basically "mimics" the outer promise "new MyPromise above")
                                    result.then(resolve, reject)
                                } else{
                                    resolve(result)
                                }
                            } else {
                                resolve(this.reason)
                            }
                        } catch(err) {
                            reject(err)
                        }
                    })
                }
            }
        })
    }

    // This is basically just syntactic sugar for having two cbs inside a single then
    catch(onRejectedCallback) {
        return this.then(null, onRejectedCallback)
    }

    finally(callback) {
        return this.then(
            val => {
                let result = callback()
                if (result && typeof result.then === "function") {
                    return result.then(() => val, () => val)
                }
                return val
            },
            err => {
                let result = callback()
                if (result && typeof result.then === "function") {
                    return result.then(() => {throw err}, () => {throw err})
                }
                throw err
            }
        )
    }
}

const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve("hi")
    }, 2000)
})


const res = promise
    .then(val => val)
    .catch(err => console.log(err))


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
