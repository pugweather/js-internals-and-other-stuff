import { useState, useEffect, cloneElement } from "react"
import styles from "./Mole.module.css"
// rows: Number of rows.
// cols: Number of columns.
// roundDuration: How long the round lasts.
// molesAtOnce: How many moles appear at once. In arcades, there could be multiple moles appearing at the same time for higher difficulty levels.
// molesAppearingInterval: How long the moles show up for.
export default function Mole({rows = 3, cols = 3, roundDuration=15000, molesAtOnce = 3, moleAppearingInterval = 2500}) {

    const [board, setBoard] = useState(Array.from({ length: rows * cols }).fill(0))
    const [timer, setTimer] = useState(roundDuration)
    const [score, setScore] = useState(0)
    const [selectedMoles, setSelectedMoles] = useState(new Set())
    const [isPlaying, setIsPlaying] = useState(true)
    const [round, setRound] = useState(0)

    useEffect(() => {

        if (!isPlaying) return

        const moleInterval = setInterval(() => {
            setSelectedMoles(prev => {
                const newMolePositions = new Set()
                while (newMolePositions.size < molesAtOnce) {
                    const newMole = Math.floor(Math.random() * (rows * cols))
                    if (prev.has(newMole)) {
                        continue
                    } else {
                        newMolePositions.add(newMole)
                    }
                }
                return newMolePositions
            })
        }, moleAppearingInterval)

        return () => {
            clearInterval(moleInterval)
        }
    }, [isPlaying, round])

    useEffect(() => {

        if (timer <= 0) {
            setIsPlaying(false)
            return
        }

         const timerInterval = setInterval(() => {
            setTimer(prev => {
                const nextTime = prev - 1000
                return nextTime >= 0 ? nextTime : 0
            })
         }, 1000)

         return () => {
            clearInterval(timerInterval)
         }
    }, [timer])

    function restartGame() {
        setIsPlaying(true)
        setTimer(roundDuration)
        setScore(0)
        setSelectedMoles(new Set())
        setRound(prev => prev + 1)
    }

    function handleClickMole(idx) {
        if (selectedMoles.has(idx)) {
            setSelectedMoles(prev => {
                const newSelectedMoles = new Set(prev)
                newSelectedMoles.delete(idx)
                return newSelectedMoles
            })
            setScore(prev => prev + 1)
        }
    }

    return (
        <div style={{position: "relative"}}>
            <div className={styles.topWrapper}>
                <span>Score: {score}</span>
                <span>Time: {timer / 1000}</span>
                <button onClick={restartGame}>restart</button>
            </div>
            <div className={styles.board} style={{gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`}}>
                {
                    board.map((cell, idx) => {
                        return (
                            <div className={styles.cell} onClick={() => handleClickMole(idx)}>
                                {selectedMoles.has(idx) && <img className={styles.cellMoleImg} src="https://www.greatfrontend.com/img/questions/whack-a-mole/mole-head.webp" alt="mole" />}
                                <img className={styles.cellDirtImg} src="https://www.greatfrontend.com/img/questions/whack-a-mole/mole-hill.webp" alt="dirt hill" />
                            </div>
                        )
                    })
                }
            </div>
            {!isPlaying && timer <= 0 && (
                <div className={styles.gameEndWrapper}>
                    <button onClick={restartGame}>restart</button>
                </div>
            )}
        </div>
    )
}
// https://www.greatfrontend.com/img/questions/whack-a-mole/mole-head.webp