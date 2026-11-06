import { useState, useEffect } from "react"
import styles from "./WordleV2.module.css"

const API_URL = "https://random-word-api.herokuapp.com/word?length=5"
const GUESS_LENGTH = 5
const NUM_GUESSES = 6
const KEY_ROWS = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"]
]

const rankToClassMap = {
    2: "correct",
    1: "badPosition",
    0: "incorrect"
}

export default function WordleV2() {

    const [answer, setAnswer] = useState('')
    const [guesses, setGuesses] = useState(new Array(NUM_GUESSES).fill(''))
    const [guessIndex, setGuessIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [usedKeys, setUsedKeys] = useState({})

    async function fetchWord() {
        const response = await fetch(API_URL)
        const word = await response.json()
        setAnswer(...word)
    }

    useEffect(() => {
        fetchWord()
    }, [])

    function handleKeydown(e) {

        // Reset game on shift
        if (e.key === "Shift") {
            setGuesses(new Array(6).fill(''))
            setGuessIndex(0)
            setIsPlaying(true)
            setUsedKeys({})
            fetchWord()
            return
        }

        // Ignore key presses when not playing
        if (guessIndex >= NUM_GUESSES) {
            setIsPlaying(false)
            return
        }

        if (!isPlaying) return
        
        if (e.key === "Backspace") {
            setGuesses(prev => {
                const guessSoFar = prev[guessIndex]
                if (guessSoFar.length === 0) return prev

                const newGuesses = [...prev]
                newGuesses[guessIndex] = (newGuesses[guessIndex]).slice(0, -1)

                return newGuesses
            })
            return
            
        } else if (e.key === "Enter") {

            const currGuess = guesses[guessIndex]

            if (currGuess.length < 5) return

            if (currGuess === answer) {
                setIsPlaying(false)
            }
            
            if (guessIndex >= NUM_GUESSES) {
                setIsPlaying(false)
                return
            }
            
            const guessKeys = {}
            const ranks = { correct: 2, badPosition: 1, incorrect: 0 }
            currGuess.split('').forEach((char, idx) => {

                let guessRank = 0
                if (currGuess[idx] === answer[idx]) {
                    guessRank = 2
                } else if (answer.includes(char)) {
                    guessRank = 1
                }

                // Only add to guess keys if it overrides its current rank, otherwise no point in adding
                if (!usedKeys[char] || guessRank > usedKeys[char]) {
                    // If a character appears twice in the same guess, don't overwrite unless it has a higher rank
                    if (!guessKeys[char] || guessRank > guessKeys[char]) {
                        guessKeys[char] = guessRank
                    }
                }
            })
            console.log(usedKeys)
            setUsedKeys(prev => {
                const newKeys = { ...prev, ...guessKeys }
                return newKeys
            })
            setGuessIndex(prev => prev + 1)

            return

        } else {

            if (!(e.key.toLowerCase().charCodeAt(0) >= 97 && e.key.toLowerCase().charCodeAt(0) <= 122)) {
                return
            }

            if (guessIndex === -1) {
                console.log("No more rows to play")
                return
            }
            setGuesses(prev => {
                const guessSoFar = prev[guessIndex]

                if (guessSoFar.length >= GUESS_LENGTH) return prev

                const newGuesses = [...prev]
                newGuesses[guessIndex] = newGuesses[guessIndex] + e.key.toLowerCase()
                return newGuesses
            })
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeydown)
        return () => document.removeEventListener("keydown", handleKeydown)
    }, [guesses, guessIndex])

    function Line({ guess, rowIndex }) {

        const chars = guess ? guess.padEnd(5, ' ').split('') : new Array(5).fill('')
        // console.log(guess)
        return (
            chars.map((c, idx) => {

                let cellClass = ''

                if (rowIndex < guessIndex) {
                    if (c === answer[idx]) {
                        cellClass = "correct"
                    } else if (answer.includes(c)) {
                        cellClass = "badPosition"
                    } else {
                        cellClass = "incorrect"
                    }
                }
                return <div className={`${styles.cell} ${cellClass ? styles[cellClass] : ''}`}>{c.toUpperCase()}</div>
            })
        )
    }

    return (
        <div>
            <div className={styles.wrapper}>
                {
                    guesses.map((guess, idx) => <Line key={idx} rowIndex={idx} guess={guess} />)
                }
            </div>
            <div className={styles.keyboard}>
                {KEY_ROWS.map((row, i) => (
                    <div key={i} className={styles.keyRow}>
                        {row.map(k => (
                            <button
                                key={k}
                                className={`${styles.key} ${styles[rankToClassMap[usedKeys[k]]]}`}
                                onClick={() => handleKeydown({ key: k })}
                            >
                                {k === "Backspace" ? "⌫" : k.toUpperCase()}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}