import { describe, test, it, expect } from "vitest"
import { add, factorial } from "./app"

describe("add", () => {
    it("Should return the sum of a and b if both values are passed in", () => {
        expect(add(1,2)).toBe(3)
    })
    it ("Should return null if either a or b isn't a number", () => {
        expect(add("hello", 2)).toBe(null)
    })
})

describe("factorial", () => {
    it("Should return null if n is not a number", () => {
        expect(factorial("hello")).toBe(null)
    })
    it("Should return undefined is number < 0", () => {
        expect(factorial(-4)).toBeUndefined()
    })
    it ("Should return !n if number > 0", () => {
        expect(factorial(4)).toBe(24)
    })
    
})