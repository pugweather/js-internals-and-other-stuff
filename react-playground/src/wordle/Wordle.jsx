import { $ZodFunction } from "zod/v4/core"
import styles from "./Wordle.module.css"
import { useState } from "react" 

const POSSIBLE_WORDS = ["smart", " faint", "plead", "phone", "apple", "truck", "waive", "melon"]
const KEYS = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "<-"]
]
const MAX_ROW_IDX = 4
const MAX_COL_IDX = 4

export default function Wordle() {

    const randomlyChosenIdx = Math.floor(Math.random() * POSSIBLE_WORDS.length)
    const [answer, setAnswer] = useState(POSSIBLE_WORDS[randomlyChosenIdx])
    const [status, setStatus] = useState("playing")

    const [grid, setGrid] = useState(() => Array.from({ length: 5 }, () => Array(5).fill("")))
    const [keys, setKeys] = useState({})
    
    const [position, setPosition] = useState([0, 0]) // [row, col] by index
    const [currRow, currCol] = position

    
    function handleKeyPress(key) {

        if (status !== "playing") return
        
        if (key === "enter") {

            const won = Object.values(keys)
                .filter(status => status === "correct")
                .length === 5

            if (won) {
                setStatus("won")
                return
            }
            
            if (currCol === MAX_COL_IDX + 1) {
                if (currRow === MAX_ROW_IDX) {
                    
                } else {
                    setPosition(prev => [currRow + 1, 0])
                }

                // Set keys
                const answerArr = answer.split('')
                for (let i = 0; i < grid[currRow].length; i++) {
                    const char = grid[currRow][i]
                    const status = answerArr.includes(char) ? (char === answerArr[i] ? "correct" : "incorrect") : "miss"
                    const ranks = { miss: 0, incorrect: 1, correct: 2}
                    // correct | incorrect | miss
                    setKeys(prev => {
                        const existing = prev[char]
                        const rankIsHigher = ranks[status] > ranks[prev[char]]
                        // Only update if key not in map OR if rank is lower than existing rank
                        if (!existing || rankIsHigher) {
                            return { ...prev, [char]: status}
                        }
                        return prev
                    })
                }
            }

        } else if (key === "<-") {
            setGrid(prev => {
                const newGrid = prev.map(row => [...row])
                newGrid[currRow][Math.min(currCol - 1, MAX_COL_IDX)] = ''
                return newGrid
            })
            setPosition(prev => [currRow, Math.max(0, currCol - 1)])
        } else {
            
            if (currCol > MAX_COL_IDX) return // Already at end of row

            setGrid(prev => {
                const newGrid = prev.map(row => [...row])
                newGrid[currRow][currCol] = key
                return newGrid
            })
            setPosition(prev => [currRow, currCol + 1])
        }
    }

    return (
        <div className="wrapper">
            <div>
                {answer}
                {status !== "playing" && <span>you {status}! answer: {answer}</span>}
                <button>reset</button>
            </div>
            <div className={styles.grid}>
                {
                    grid.map((row, rowIdx) => 
                        row.map((col, colIdx) => 
                            <div key={colIdx} className={`${styles.cell} ${currRow === rowIdx && Math.min(currCol, MAX_COL_IDX) === colIdx ? styles.green : ''}`}>{col}</div>
                        )
                    )
                }
            </div>
            <div className={styles.keyboard}>
                {
                    KEYS.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx} className={styles.rowWrapper}>
                                {
                                    row.map((key, colIdx) => {
                                        let keyClass = keys[key]
                                        return (
                                            <span 
                                                key={key} 
                                                className={`${styles.key} ${keyClass ? styles[keyClass] : ''}`}
                                                onClick={() => handleKeyPress(key)}>
                                                {key}
                                            </span>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )  
}