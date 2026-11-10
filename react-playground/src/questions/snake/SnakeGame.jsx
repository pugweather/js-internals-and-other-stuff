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
    const [isPlaying, setIsPlaying] = useState(true)
    const [score, setScore] = useState(0)
    const [food, setFood] = useState([6, 6])

    const snakeSet = new Set(snake.map(([r, c]) => `${r}-${c}`))

    useEffect(() => {

        document.addEventListener("keydown", handleKeydown)

        return () => {
            document.removeEventListener("keydown", handleKeydown)
        }
    }, [velocity])

    useEffect(() => {

        const gameInterval = setInterval(() => {
            if (!isPlaying) return
            setSnake(prev => setNewSnakePosition(prev))
        }, 150)

        return () => {
            clearInterval(gameInterval)
        }
    }, [velocity, isPlaying])

    useEffect(() => {
        
        if (grabbedFood(snake)) {
            setScore(prev => prev + 1)
            setFood(spawnNewFood())
            growSnake([...food])
        }
        if (snakeCollidedWithBorder(snake) || collidedWithMyself(snake)) {
            setIsPlaying(false)
        }
    }, [snake])

    function collidedWithMyself(snk) {
        const [headR, headC] = snk[0]
        const headAsStr = `${headR}-${headC}`
        const snakeSetWithoutHead = new Set(snake.slice(1).map(([r, c]) => `${r}-${c}`))
        if (snakeSetWithoutHead.has(headAsStr)) {
            return true
        }
        return false
    }

    function grabbedFood(snk) {
        const [headR, headC] = snk[0]
        const [foodR, foodC] = food
        return headR === foodR && headC === foodC
    }

    function growSnake(newHead) {
        setSnake(prev => {
            const newSnake = [...prev]
            newSnake.unshift(newHead)
            return newSnake
        })
    }

    function spawnNewFood(snk) {
        let [foodR, foodC] = food
        let foodAsStr = `${foodR}-${foodC}` 
        while (snakeSet.has(foodAsStr)) {
            foodR = Math.floor(Math.random() * BOARD_HEIGHT)
            foodC = Math.floor(Math.random() * BOARD_WIDTH)
            foodAsStr = `${foodR}-${foodC}` 
        }
        return [foodR, foodC]
    }

    function setNewSnakePosition(snk) {

        let newSnake = grabbedFood(snk) ? snk : snk.slice(0, -1)

        const [headR, headC] = snk[0]
        const [velocityR, velocityC] = velocity
        const newHead = [headR + velocityR, headC + velocityC]

        newSnake.unshift(newHead)

        return newSnake
    }

    function snakeCollidedWithBorder(snk) {
        const head = snk[0]
        const [r, c] = head
        if (r < 0 || 
            r >= BOARD_HEIGHT || 
            c < 0 ||
            c >= BOARD_WIDTH
        ) {
            return true
        }
        return false
    }

    function areVelocitiesEqual(v1, v2) {
        const [r1, c1] = v1
        const [r2, c2] = v2
        return r1 === r2 && c1 === c2
    }

    function isValidDirectionChange(key) {

        let valid = true

        if (key === "ArrowUp") {
            if (areVelocitiesEqual(velocity, DOWN_VELOCITY)) {
                valid = false
            }
        }
        if (key === "ArrowDown") {
            if (areVelocitiesEqual(velocity, UP_VELOCITY)) {
                valid = false
            }
        }
        if (key === "ArrowLeft") {
            if (areVelocitiesEqual(velocity, RIGHT_VELOCITY)) {
                valid = false
            }
        }
        if (key === "ArrowRight") {
            if (areVelocitiesEqual(velocity, LEFT_VELOCITY)) {
                valid = false
            }
        }
        return valid
    }

    function handleKeydown(e) {
        const key = e.key
        if (key === "ArrowUp") {
            if (isValidDirectionChange(key)) {
                setVelocity(UP_VELOCITY)
            }
        } else if (key === "ArrowDown") {
            if (isValidDirectionChange(key)) {
                setVelocity(DOWN_VELOCITY)
            }
        } else if (key === "ArrowLeft") {
            if (isValidDirectionChange(key)) {
                setVelocity(LEFT_VELOCITY)
            }
        } else if (key === "ArrowRight") {
            if (isValidDirectionChange(key)) {
                setVelocity(RIGHT_VELOCITY)
            }
        }
    }

    function restartGame() {
        setSnake(INITIAL_SNAKE)
        setVelocity(UP_VELOCITY)
        setIsPlaying(true)
    }

    return (
        <div className={styles.wrapper}>
            <div>Score: {score}</div>
            <div className={styles.board}>   
                {
                    board.map((row, rowIdx) => row.map((cell, colIdx) => {
                        const classForEvenRows = colIdx % 2 === 0 ? "cell1" : "cell2"
                        const classForOddRows = colIdx % 2 !== 0 ? "cell1" : "cell2"
                        const checkerClass = rowIdx % 2 === 0 ? classForEvenRows : classForOddRows

                        const isSnake = snake.some(([r, c]) => r === rowIdx && c === colIdx)
                        const isFood = rowIdx === food[0] && colIdx === food[1]

                        let cellClass
                        if (isSnake) {
                            cellClass = "snake"
                        } else if (isFood) {
                            cellClass = "food"
                        } else {
                            cellClass = checkerClass
                        }

                        return (
                            <div key={`${rowIdx}-${colIdx}`} className={styles[cellClass]}>

                            </div>
                        )
                    }))
                }
                {!isPlaying && (
                    <div className={styles.popupModal}>
                        <div>YOU LOST</div>
                        <button onClick={restartGame}>Restart</button>
                    </div>
                )}
            </div>
        </div>
    )
} 