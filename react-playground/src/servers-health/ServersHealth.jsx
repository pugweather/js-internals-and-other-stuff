import { useState, useEffect } from "react"
import styles from "./ServersHealth.module.css"

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
        fetchServersHealth()
    }, [])

    if (isPending) return (
        <div className={styles.page}>
            <div>...loading</div>
        </div>
    )

    if (error) return (
        <div className={styles.page}>
            <div>{error}</div>
        </div>
    )

    const normalizedData = data.map(row => {
        const { status } = row
        const res = { status }
        if (status === "fulfilled") {
            res.port = row.value.port
            res.uptime = row.value.uptime
            res.requests = row.value.data.requests
            res.path = Object.keys(row.value.data.perPath)[0]
        }
        return res
    })

    console.log(normalizedData)

    return (
        <div className={styles.page}>
            <div className={styles.dataWrapper}>
                <div className={styles.top}>
                    <div>
                        <div>Server health</div>
                        <div>4 instances</div>
                    </div>
                    <div>
                        <div>3 healthy</div>
                        <div>1 failed</div>
                    </div>
                </div>
                <div>
                    {
                        normalizedData.map((obj, idx) => {      
                            const { port, path, requests, uptime, status } = obj                  
                            return (
                                <div key={crypto.randomUUID()} className={styles.rowWrapper}>
                                    <div className={styles.partOne}>
                                        <div className="dot"></div>
                                        <div>
                                            <div>Port {port}</div>
                                            <div>{status === "fulfilled" ? path : "-"}</div>
                                        </div>
                                    </div>
                                    <div className={styles.partTwo}>
                                        <div>Requests</div>
                                        <div>{status === "fulfilled" ? requests : "-"}</div>
                                    </div>
                                    <div className={styles.partThree}>
                                        <div>
                                            <div>Uptime</div>
                                            <div>{uptime ? uptime : '-'}</div>
                                        </div>
                                        <div style={{marginLeft: "auto", color: status === "fulfilled" ? "green" : "red"}}>
                                            {status === "fulfilled" ? "Healthy" : "Failed"}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}