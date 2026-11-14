import { useState, useEffect } from "react"
import styles from "./Matching.module.css"

const data = [
  { id: 1, value: "🐶" },
  { id: 2, value: "🐱" },
  { id: 3, value: "🐸" },
  { id: 4, value: "🦊" },
  { id: 5, value: "🐼" },
  { id: 6, value: "🐵" },
  { id: 7, value: "🦁" },
  { id: 8, value: "🐨" },
  { id: 9, value: "🐶" },
  { id: 10, value: "🐱" },
  { id: 11, value: "🐸" },
  { id: 12, value: "🦊" },
  { id: 13, value: "🐼",},
  { id: 14, value: "🐵" },
  { id: 15, value: "🦁" },
  { id: 16, value: "🐨" },
];

const NUM_CARDS = data.length

export default function Matching() {

    const [cards, setCards] = useState(data)
    const [selected, setSelected] = useState(new Set())
    const [solved, setSolved] = useState(new Set())
    const [isPlaying, setIsPlaying] = useState(true)

    useEffect(() => {
        let timeoutId = null
        if (selected.size >= 2) {
            timeoutId = setTimeout(() => {
                const [card1, card2] = [...selected].map(id => cards.find(card => card.id === id))
                if (card1.value === card2.value) {
                    setSolved(prev => {
                        const newSolved = new Set(prev)
                            .add(card1.id)
                            .add(card2.id)
                        return newSolved
                    })
                }
                // Hide selected Cards
                setSelected(new Set())
            }, 1250)
        }
        return () => {
            clearTimeout(timeoutId)
        }
    }, [selected])

    useEffect(() => {
        if (solved.size === NUM_CARDS) {
            setIsPlaying(false)
        }
    }, [solved])

    function handleCardClick(id) {

        if (!isPlaying) return

        if (selected.size >= 2) return
        if (solved.has(id) || selected.has(id)) return

        setSelected(prev => new Set([...prev]).add(id))
    }

    function restartGame() {
        setSelected(new Set())
        setSolved(new Set())
        setIsPlaying(true)
    }

    return (
        <div>
            <button onClick={restartGame}>restart</button>
            <div className={styles.grid}>
                {
                    cards.map(card => {
                        const shouldShowValue = solved.has(card.id) || selected.has(card.id)
                        return <div key={card.id} className={styles.card} onClick={() => handleCardClick(card.id)}>{shouldShowValue && card.value}</div>
                    })
                }
            </div>
        </div>
    )
}