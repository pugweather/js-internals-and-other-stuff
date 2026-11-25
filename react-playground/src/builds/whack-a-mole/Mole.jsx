import { useState, useEffect, cloneElement } from "react"
import styles from "./Mole.module.css"
// rows: Number of rows.
// cols: Number of columns.
// roundDuration: How long the round lasts.
// molesAtOnce: How many moles appear at once. In arcades, there could be multiple moles appearing at the same time for higher difficulty levels.
// molesAppearingInterval: How long the moles show up for.
export default function Mole({rows = 3, cols = 3, roundDuration=15000, molesAtOnce = 3, moleAppearingInterval = 2500}) {

    const [board, setBoard] = useState(Array.from({ length: rows * cols }).fill(0))

    return (
        <div>
            <div className={styles.board} style={{gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`}}>
                {
                    board.map((cell, idx) => {
                        return (
                            <div className={styles.cell}>
                                <img className={styles.cellMoleImg} src="https://www.greatfrontend.com/img/questions/whack-a-mole/mole-head.webp" alt="mole" />
                                <img className={styles.cellDirtImg} src="https://www.greatfrontend.com/img/questions/whack-a-mole/mole-hill.webp" alt="dirt hill" />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
// https://www.greatfrontend.com/img/questions/whack-a-mole/mole-head.webp