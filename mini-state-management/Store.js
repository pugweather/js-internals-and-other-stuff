module.exports = class Store {
    constructor(reducer, initialState, middlewares = []) {
        this.state = initialState
        this.listeners = []
        this.reducer = reducer
        this.middlewares = middlewares
    }   

    getState() {
        return this.state
    }

    dispatch(action) {
        let index = 0
        const next = () => {
            if (index < this.middlewares.length) {
                this.middlewares[index++](this, action, next)
            } else {
                this.state = this.reducer(this.state, action)
                this.listeners.forEach(l => l())
            }
        }
        next()
    }

    subscribe(listener) {
        this.listeners.push(listener)
        return () => {
            this.listeners = this.listeners.filter(l => l != listener)
        }
    }
}