import { useState, useEffect } from "react"
import styles from "./SnakeGame.module.css"

const BOARD_WIDTH = 15
const BOARD_HEIGHT = 15
const INITIAL_SNAKE = [[7,7], [8,7], [9,7]]
const UP_VELOCITY = [-1, 0]
const DOWN_VELOCITY = [1, 0]
const RIGHT_VELOCITY = [0, 1]
const LEFT_VELOCITY = [0, -1]

export default function SnakeGame() {

    const [board, setBoard] = useState(new Array(BOARD_HEIGHT).fill(new Array(BOARD_WIDTH).fill(null)))
    const [snake, setSnake] = useState(INITIAL_SNAKE)
    const [velocity, setVelocity] = useState(UP_VELOCITY)

    function setNewSnakePosition(snk) {

        const newSnake = snk.slice(0, -1)

        const [headR, headC] = snk[0]
        const [velocityR, velocityC] = velocity
        console.log(velocityR, velocityC)
        const newHead = [headR + velocityR, headC + velocityC]

        newSnake.unshift(newHead)
        return newSnake
    }

    function handleKeydown(key) {
        if (key === "ArrowUp") {
            setVelocity(UP_VELOCITY)
        } else if (key === "ArrowDown") {
            setVelocity(DOWN_VELOCITY)
        } else if (key === "ArrowLeft") {
            setVelocity(LEFT_VELOCITY)
        } else if (key === "ArrowRight") {
            setVelocity(RIGHT_VELOCITY)
        }
    }

    useEffect(() => {

        document.addEventListener("keydown", (e) => handleKeydown(e.key))

        return () => {
            document.removeEventListener("keydown", handleKeydown)
        }
    }, [])

    useEffect(() => {
        const gameInterval = setInterval(() => {
            setSnake(prev => setNewSnakePosition(prev))
        }, 75)

        return () => {
            clearInterval(gameInterval)
        }
    }, [velocity])

    return (
        <div className={styles.board}>   
            {
                board.map((row, rowIdx) => row.map((cell, colIdx) => {
                    const classForEvenRows = colIdx % 2 === 0 ? "cell1" : "cell2"
                    const classForOddRows = colIdx % 2 !== 0 ? "cell1" : "cell2"
                    const checkerClass = rowIdx % 2 === 0 ? classForEvenRows : classForOddRows

                    const isSnake = snake.some(([r, c]) => r === rowIdx && c === colIdx)

                    const cellClass = isSnake ? "snake" : checkerClass

                    return (
                        <div key={`${rowIdx}-${colIdx}`} className={styles[cellClass]}>

                        </div>
                    )
                }))
            }
        </div>
    )
} 

function Snake() {
    return (
        <div>

        </div>
    )
}