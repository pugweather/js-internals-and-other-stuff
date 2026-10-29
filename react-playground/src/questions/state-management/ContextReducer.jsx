import { createContext, useReducer } from "react"

const initialState = { value: 1, error: null }

export const CounterContext = createContext(null)

export function ContextReducer({children}) {

    const [state, dispatch] = useReducer(reducer, initialState)

    function reducer(state, action) {
        switch(action.type) {
            case "increment":
                return { value: state.value + 1, error: null }
            case "decrement":
                const min = 0
                return { value: Math.max(0, state.value - 1), error: state.value <= min ? "can't go below 0" : null }
            default:
                throw new Error("Error: invalid action: " + action.type)
        }
    }

    return (
        <CounterContext.Provider value={{state, dispatch}}>
            {children}
        </CounterContext.Provider>
    )

}