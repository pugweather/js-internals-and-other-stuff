import { useState, useEffect } from "react"
import styles from "./ServersHealth.module.css"
import ServersRow from "./ServersRow.jsx"

export default function ServersHealth() {

    // NOTE: never created server on port 3004 so fetch promise should reject
    const serverPorts = [3001, 3002, 3003, 3004]

    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState('')
    const [data, setData] = useState([])

    console.log(data)

    useEffect(() => {
        async function fetchServersHealth() {
            try {

                setIsPending(true)

                const promises = serverPorts.map(port => 
                    fetch(`http://localhost:${port}/health`)
                        .then(res => res.json())
                )
                const results = await Promise.allSettled(promises)
                setData(results)

                setIsPending(false)
                setError('')
            } catch(err) {
                setError(err.message)
            }   
        }

        let ticks = 0
        const fetchIntervalId = setInterval(function() {
            if (ticks > 100) return clearInterval(fetchIntervalId)
            ticks++
            fetchServersHealth()
        }, 500)
        
        return () => {
            clearInterval(fetchIntervalId)
        }
    }, [])

    if (isPending && data.length === 0) return (
        <div className={styles.page}>
            <div>...loading</div>
        </div>
    )

    if (error) return (
        <div className={styles.page}>
            <div>{error}</div>
        </div>
    )

    const normalizedData = data.map((row, idx) => {
        const { status } = row
        // Always include status & port (need port for key prop. Prob could use another unique idenitifier honestly :p)
        const res = { 
            status, 
            port: row.value?.port || serverPorts[idx] 
        }
        if (status === "fulfilled") {
            res.uptime = row.value.uptime
            res.requests = row.value.data.requests
            res.path = Object.keys(row.value.data.perPath)[0]
        }
        return res
    })

    return (
        <div className={styles.page}>
            <div className={styles.dataWrapper}>
                <div className={styles.top}>
                    <div>
                        <div>Server health</div>
                        <div>{normalizedData.length} instances</div>
                    </div>
                    <div>
                        <div>{normalizedData.filter(x => x.status === "fulfilled").length} healthy</div>
                        <div>{normalizedData.filter(x => x.status === "rejected").length} failed</div>
                    </div>
                </div>
                <div>
                    {normalizedData.map((obj, idx) => <ServersRow key={obj.port} {...obj} />)}
                </div>
            </div>
        </div>
    )
}