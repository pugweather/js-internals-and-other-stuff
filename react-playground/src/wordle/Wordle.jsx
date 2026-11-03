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
    const [statusGrid, setStatusGrid] = useState(() => Array.from({ length: 5 }, () => Array(5).fill(null)))
    const [keys, setKeys] = useState({})
    
    const [position, setPosition] = useState([0, 0]) // [row, col] by index
    const [currRow, currCol] = position

    function resetGame() {
        const randomlyChosenIdx = Math.floor(Math.random() * POSSIBLE_WORDS.length)
        setAnswer(POSSIBLE_WORDS[randomlyChosenIdx])
        setStatus("playing")
        setGrid(() => Array.from({ length: 5 }, () => Array(5).fill("")))
        setStatusGrid(() => Array.from({ length: 5 }, () => Array(5).fill(null)))
        setPosition([0,0])
        setKeys({})
    }
    
    function handleKeyPress(key) {

        if (status !== "playing") return
        
        if (key === "enter") {
            
            if (currCol === MAX_COL_IDX + 1) {


                // Set keys
                const answerArr = answer.split('')
                const statusRow = []
                const rowKeys = {}
                for (let i = 0; i < grid[currRow].length; i++) {
                    const char = grid[currRow][i]
                    const status = answerArr.includes(char) ? (char === answerArr[i] ? "correct" : "incorrect") : "miss"
                    const ranks = { miss: 0, incorrect: 1, correct: 2 }
                    
                    const currTopRank = Math.max(ranks[keys[char]] ?? -1, ranks[rowKeys[char]] ?? -1)
                    const rankIsHigher = ranks[status] > currTopRank
                    // Only update if key not in map OR if rank is lower than existing rank
                    if (rankIsHigher) {
                        rowKeys[char] = status
                    }
                    statusRow[i] = status
                }
                console.log(rowKeys)

                // correct | incorrect | miss
                setKeys(prev => {
                    return {...prev, ...rowKeys}
                })
                
                setStatusGrid(prev => prev.map((row, ridx) => ridx === currRow ? statusRow : [...row]))

                
                if (currRow === MAX_ROW_IDX) {
                    setStatus("lost")
                    return
                } else {
                    setPosition(prev => [currRow + 1, 0])
                }
                
                const won = grid[currRow].join('').toLowerCase() === answer.toLowerCase()
                if (won) {
                    setStatus("won")
                    return
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
                <button onClick={resetGame}>reset</button>
            </div>
            <div className={styles.grid}>
                {
                    grid.map((row, rowIdx) => 
                        row.map((cell, colIdx) => 
                            {   const [currRow] = position
                                return <div key={colIdx} className={`${styles.cell} ${styles[statusGrid[rowIdx][colIdx]] && rowIdx !== currRow ? styles[statusGrid[rowIdx][colIdx]] : ''} ${currRow === rowIdx && Math.min(currCol, MAX_COL_IDX) === colIdx ? styles.greenBorder : ''}`}>{cell}</div>
                            }
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