import { useState, useRef, useEffect } from "react"
import styles from "./Otp.module.css"
import { hashKey } from "@tanstack/react-query"

const NUM_INPUTS = 6

export default function Otp() {
    
    // TODO: 

    const [code, setCode] = useState(['','','','','',''])
    const [focusedIdx, setFocusedIdx] = useState(0)
    const inputRefs = useRef([])

    useEffect(() => {
        inputRefs[focusedIdx].focus()
    }, [focusedIdx])

    function handleKeydown(e, inputIdx) {

        e.preventDefault()

        const key = e.key
        if (isNumber(key)) {
            setCode(prev => prev.map((val, i) => i === inputIdx ? key : val))
            setFocusedIdx(prev => prev >= NUM_INPUTS - 1 ? NUM_INPUTS - 1 : prev + 1)
        } else if (key === "Backspace") {
            setCode(prev => prev.map((val, i) => i === inputIdx ? '' : val))
            setFocusedIdx(prev => prev <= 0 ? 0 : prev - 1)
        }
    }

    function handleRestart() {
        setFocusedIdx(0)
        setCode(['','','','','',''])
    }

    function handleSubmit() {
        e.preventDefault()
        // Would usually make some kind of POST request
        console.log("POST: " + code.join(' '))
    }

    function isNumber(key) {
        return key.charCodeAt(0) >= 48 && key.charCodeAt(0) <= 57
    }

    return (
        <form action="">
            <div>
                {
                    Array.from({length: NUM_INPUTS}).map((inp, idx) => 
                        <input 
                            key={idx} 
                            className={styles.otpInput} 
                            inputMode="numeric" 
                            maxLength={1} 
                            pattern="[0-9]" 
                            onKeyDown={(e) => handleKeydown(e, idx)} 
                            value={code[idx]}
                            ref={el => inputRefs[idx] = el}
                        />
                    )
                }
            </div>
            <div>
                <button type="button" onClick={handleRestart}>Restart</button>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </form>
    )
}