import { useContext } from "react"
import { CounterContext } from "./ContextReducer"

export default function Child() {

    const {state, dispatch} = useContext(CounterContext)
    console.log(state, dispatch)

    return (
        <div className="page">
            <div>value: {state.value}</div>
            {state.error && <div className="error-text">{state.error}</div>}
            <button onClick={() => dispatch({type: "decrement"})}>decrement</button>
            <button onClick={() => dispatch({type: "increment"})}>increment</button>
        </div>
    )
}