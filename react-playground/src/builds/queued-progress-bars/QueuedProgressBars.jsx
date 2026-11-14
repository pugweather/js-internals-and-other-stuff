import { useState, useEffect } from "react"
import styles from "./QueuedProgressBars.module.css"

const MAX_CONCURRENT_BARS_PROGRESSED = 3

export default function QueuedProgressBars() {

    // status: 1 = filled, 0 = not filled
    const [bars, setBars] = useState([{ id: crypto.randomUUID(), pct: 0}])
    const [isProgressing, setIsProgressing] = useState(false)

    const isDone = bars.every(bar => bar.pct >= 100)

    useEffect(() => {
        
        const intervalId = setInterval(() => {

            setBars(prev => {

                const firstBarToIncrement = prev.findIndex(bar => bar.pct < 100)
                const arrayOfBarsToProgress = prev
                    .slice(firstBarToIncrement, firstBarToIncrement + MAX_CONCURRENT_BARS_PROGRESSED)
                    .map((_, idx) => idx + firstBarToIncrement)

                return prev.map((bar, idx) => ({...bar, pct: arrayOfBarsToProgress.includes(idx) ? Math.min(bar.pct + 1, 100) : bar.pct}))
            })
        }, 20)

        if (isDone) {
            clearInterval(intervalId)
        }

        if (!isProgressing) {
            clearInterval(intervalId)
            return
        }

        return () => {
            clearInterval(intervalId)
        }

    }, [isProgressing, isDone])

    function handleAddBar() {
        setBars(prev => [...prev, { id: crypto.randomUUID(), pct: 0 }])
    }

    function handleStart() {
        setIsProgressing(prev => !prev)
    }

    function handleReset() {
        setBars(prev => [{ id: crypto.randomUUID(), pct: 0 }])
        setIsProgressing(false)
    }

    return (
        <div>
            <div className={styles.buttonsWrapper}>
                <button onClick={handleAddBar}>Add</button>
                <button onClick={handleStart}>{isProgressing ? "Pause" : "Start"}</button>
                <button onClick={handleReset}>Reset</button>
            </div>
            <div style={{marginTop: "10px"}}>
                {
                    bars.map(bar => {
                        return (
                            <div key={bar.id} className={styles.bar}>
                                <div className={styles.filledBar} style={{width: `${bar.pct}%`}}></div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}