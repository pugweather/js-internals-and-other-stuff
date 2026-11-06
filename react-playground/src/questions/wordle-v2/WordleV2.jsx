import { useState, useEffect } from "react"
import styles from "./WordleV2.module.css"

const API_URL = "https://random-word-api.herokuapp.com/word?length=5"
const GUESS_LENGTH = 5
const NUM_GUESSES = 6

export default function WordleV2() {

    const [answer, setAnswer] = useState('')
    const [guesses, setGuesses] = useState(new Array(NUM_GUESSES).fill(null))

    console.log(guesses)

    useEffect(() => {
        async function fetchWord() {
            const response = await fetch(API_URL)
            const word = await response.json()
            setAnswer(word)
        }
        fetchWord()
    }, [])

    useEffect(() => {

        function handleKeydown(e) {

            const guessIndex = guesses.findIndex(g => g === null)
            
            if (e.key === "Backspace") {
                setGuesses(prev => {
                    const guessSoFar = prev[guessIndex] || ''
                    if (guessSoFar.length === 0) return prev

                    const newGuesses = [...prev]
                    newGuesses[guessIndex] = (newGuesses[guessIndex] || '').slice(0, -1)

                    return newGuesses
                })
                return
                
            } else if (e.key === "Enter") {

                return

            } else {

                if (guessIndex === -1) {
                    console.log("No more rows to play")
                    return
                }
                setGuesses(prev => {
                    const guessSoFar = prev[guessIndex]

                    if ((guessSoFar || '').length >= 5) return prev

                    const newGuesses = [...prev]
                    newGuesses[guessIndex] = (newGuesses[guessIndex] || '') + e.key.toLowerCase()
                    return newGuesses
                })
            }
        }
        document.addEventListener("keydown", handleKeydown) 

        return () => {
            document.removeEventListener("keydown", handleKeydown)
        }

    }, [])

    function Line({ guess }) {

        // console.log(guess)

        const chars = guess ? guess.split('') : new Array(5).fill('')
        console.log(chars.length)

        return (
            chars.map(c => <div className={styles.cell}>{c}</div>)
        )
    }

    return (
        <div>
            <div className={styles.wrapper}>
                {
                    guesses.map(guess => <Line guess={guess} />)
                }
            </div>
        </div>
    )
}