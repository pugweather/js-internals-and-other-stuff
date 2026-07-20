class MyPromise {
    constructor(executor) {
        this.state = "pending"
        this.value = null
        this.reason = null

        const resolve = (data) => {
            if (this.state !== "pending") return
            this.state = "fulfilled"
            this.value = data
        }
    
        const reject = (data) => {
            if (this.state !== "pending") return
            this.state = "rejected"
            this.reason = data
        }

        try {
            executor(resolve, reject)
        } catch(err) {
            reject(err)
        }
    }
}

const promise = new Promise((resolve, reject) => {
    resolve("yay")
    reject("oof")
})

module.exports = MyPromise
