import { useState, useRef, useEffect } from "react"
import styles from "./Otp.module.css"

const NUM_INPUTS = 6

export default function Otp() {

    const [code, setCode] = useState(['','','','','',''])
    const [focusedIdx, setFocusedIdx] = useState(0)
    const inputRefs = useRef([])

    console.log(code)

    useEffect(() => {
        inputRefs.current[focusedIdx].focus()
    }, [focusedIdx])

    function handleKeydown(e, inputIdx) {

        // preventDefault call prevents paste event, so only preventDefault if cmd or ctrl isn't clicked
        // In other words, we don't want to preventDefault (block paste event) if cmd/ctrl is clicked
        if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault()
        }

        const key = e.key
        if (isNumber(key)) {
            setCode(prev => prev.map((val, i) => i === inputIdx ? key : val))
            setFocusedIdx(prev => focusNextInput(prev))
        } else if (key === "Backspace") {
            setCode(prev => prev.map((val, i) => i === inputIdx ? '' : val))
            setFocusedIdx(prev => focusPrevInput(prev))
        } else if (key === "ArrowRight") {
            setFocusedIdx(prev => focusNextInput(prev))
        } else if (key === "ArrowLeft") {
            setFocusedIdx(prev => focusPrevInput(prev))
        } 

        function focusNextInput(prev) {
            return prev >= NUM_INPUTS - 1 ? NUM_INPUTS - 1 : prev + 1
        }

        function focusPrevInput(prev) {
            return prev <= 0 ? 0 : prev - 1
        }
    }



    function handleRestart() {
        setFocusedIdx(0)
        setCode(['','','','','',''])
    }

    function handleSubmit(e) {
        e.preventDefault()
        // Would usually make some kind of POST request
        console.log("POST: " + code.join(' '))
    }

    function isNumber(key) {
        return key.charCodeAt(0) >= 48 && key.charCodeAt(0) <= 57
    }

    function handleClickInput(idx) {
        setFocusedIdx(idx)
    }

    function handlePasteCode(e) {
        const pastedCodeArr = e.clipboardData.getData("text").trim().split('')
        const pastedCodeIsAllNums = pastedCodeArr.every(char => isNumber(char))
        if (pastedCodeIsAllNums) {
            const firstSixNums = pastedCodeArr.slice(0, NUM_INPUTS)
            setCode(Array.from({ length: NUM_INPUTS }, (_, idx) => firstSixNums[idx] ?? ''))
            setFocusedIdx(Math.min(firstSixNums.length, NUM_INPUTS - 1))
        } else {
            alert("Pasted code must only contain numbers")
        }
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
                            onClick={() => handleClickInput(idx)}
                            ref={el => inputRefs.current[idx] = el}
                            onPaste={handlePasteCode}
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