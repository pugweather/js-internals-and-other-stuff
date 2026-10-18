const counterReducer = require('./CounterReducer')
const loggerMiddleware = require('./loggerMiddleware')
const Store = require('./Store')

const store = new Store(counterReducer, {count: 0}, [loggerMiddleware])

function logState() {
    console.log(store.getState())
}

const unsubscribe = store.subscribe(logState)
unsubscribe()

store.dispatch({type: "INCREMENT"})
store.dispatch({type: "INCREMENT"})
store.dispatch({type: "DECREMENT"})