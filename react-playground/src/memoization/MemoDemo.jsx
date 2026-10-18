import { useState, useEffect, useRef, useMemo, memo } from "react"

// const ExpensiveChild = memo(({result}) => {
//     const renders = useRef(0)
//     renders.current++
//     return (
//         <div>child: {result} - renders: {renders.current}</div>
//     )
// })

function ExpensiveChild({result}) {

    console.log(result)

    const renders = useRef(0)
    renders.current++

    return (
        <div>child: {result} - renders: {renders.current}</div>
    )
}

export default function MemoDemo() {

    const [counter, setCounter] = useState(0)
    const expensiveRef = useRef(0)
    
    function expensive() {

        expensiveRef.current++
        
        let curr = 0
        for (let i = 0; i < 1e8; i++) {
            curr += Math.sqrt(i)
        } 
        return curr
    }   

    const result = useMemo(() => expensive(), [])
    // const result = expensive()

    return (
        <div>
            <div>parent - expensive calls: {expensiveRef.current}</div>
            <button onClick={() => setCounter(prev => prev + 1)}>refresh</button>
            <ExpensiveChild result={result}/>    
        </div>
    )

}