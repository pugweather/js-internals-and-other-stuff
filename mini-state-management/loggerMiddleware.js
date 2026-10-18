// Add other middlewares?
module.exports = function loggerMiddleware(store, action, next) {
    console.log(store, action)
    next()
}