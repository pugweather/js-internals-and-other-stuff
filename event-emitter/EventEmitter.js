class EventEmitter {
    constructor() {
        this.listeners = {}
    }

    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback)
        } else {
            this.listeners[event] = [callback]
        }
    }
    
    emit(event, data) {
        if (!this.listeners[event]) return
        for (let cb of this.listeners[event]) {
            cb(data)
        }
    }

    off(event, listener) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(x => x !== listener)
        }
    }

    once(event, listener) {
        const wrapper = (...args) => {
            listener(...args)
            this.off(event, wrapper)
        }
        this.on(event, wrapper)
    }

    removeAllListeners(event) {
        if (!event) {
            this.listeners = {}
        } else {
            delete this.listeners[event]
        }
    }
}

module.exports = EventEmitter
