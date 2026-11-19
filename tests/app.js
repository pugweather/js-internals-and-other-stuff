export function add(a, b) {

    if (typeof(a) !== "number" || typeof(b) !== "number") return null

    return a + b
}

export function factorial(n) {

    if (typeof(n) !== "number") return null
    if (n < 0) return

    if (n === 0 || n === 1) return 1
    return n * factorial(n - 1)
}

console.log(factorial(4))