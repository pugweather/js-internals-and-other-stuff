import { useState } from "react"
import styles from "./ConnectFour.module.css"

const NUM_COLUMNS = 7
const NUM_ROWS = 6

export default function ConnectFour() {

    const [player, setPlayer] = useState("yellow") // yellow | red
    const [isPlaying, setIsPlaying] = useState(true)
    const [board, setBoard] = useState(Array.from({ length: NUM_ROWS }, () => new Array(NUM_COLUMNS).fill(null)))

    const isDraw = !board.some(row => row.includes(null))
    // console.log(board.reduce((acc, row) => acc + row.filter(val => Boolean(val)).length, 0))

    function getValidPlaceLocation(colIdx) {
        // Assume no position is valid until we find one that is (hopefully)
        let res = null
        for (let rowIdx = NUM_ROWS - 1; rowIdx >= 0; rowIdx--) {
            if (board[rowIdx][colIdx] === null) {
                res = [rowIdx, colIdx]
                break
            }
        }
        if (!res) {
            res = [null, null]
        }
        return res
    }

    function handleClickSlot(colIdx) {

        if (!isPlaying) return

        const [row, col] = getValidPlaceLocation(colIdx)

        if (row === null) return

        const newBoard = board.map(row => [...row])
        newBoard[row][col] = player
        setBoard(newBoard)

        const isDraw = !newBoard.some(row => row.includes(null))
        const isWin = isWinningSolution(row, col, newBoard)
        if (isWin || isDraw) {
            setIsPlaying(false)
            return
        }

        setPlayer(prev => prev === "yellow" ? "red" : "yellow")
    }
    function isWinningSolution(row, col, newBoard) {
        const solutions = [
            [[0, -1], [0, 1]], // Horizontal
            [[-1, 0], [1, 0]], // Vertical
            [[1, -1], [-1, 1]], // left to right diag
            [[-1, -1], [1, 1]] // right to left diag
        ]

        let maxStreak = 1
        for (const [dir1, dir2] of solutions) {

            let currStreak = 1
            
            const [dirRow1, dirCol1] = dir1
            let nextR = row + dirRow1
            let nextC = col + dirCol1
            while (isInBounds(nextR, nextC) && newBoard[nextR][nextC] === player) {
                currStreak++
                nextR += dirRow1
                nextC += dirCol1
            }
            
            const [dirRow2, dirCol2] = dir2
            nextR = row + dirRow2
            nextC = col + dirCol2
            while (isInBounds(nextR, nextC) && newBoard[nextR][nextC] === player) {
                currStreak++
                nextR += dirRow2
                nextC += dirCol2
            } 
            maxStreak = Math.max(maxStreak, currStreak)
        }

        return maxStreak >= 4

        function isInBounds(nextR, nextC) {
            return nextR >= 0 && nextR < NUM_ROWS && nextC >= 0 && nextC < NUM_COLUMNS
        }
    }


    function restartGame() {
        setIsPlaying(true)
        setBoard(Array.from({ length: NUM_ROWS }, () => new Array(NUM_COLUMNS).fill(null)))
    }

    return (
        <div className={styles.board}>
            {
                board.map((row, rowIdx) => {
                    return row.map((col, colIdx) => {
                        const cellClass = board[rowIdx][colIdx]
                        return <div key={`${rowIdx}-${colIdx}`} className={`${styles.cell} ${cellClass ? styles[cellClass] : ''}`} onClick={() => handleClickSlot(colIdx)}></div>
                    })
                })
            }
            {
            !isPlaying && (
            <div className={styles.popupModal}>
                <div>
                    {isDraw && !won ? "Draw" : `Player ${player.charAt(0).toUpperCase() + player.slice(1)} wins!`}
                </div>
                <button onClick={restartGame}>Restart</button>
            </div>)
            }
        </div>
    )
}