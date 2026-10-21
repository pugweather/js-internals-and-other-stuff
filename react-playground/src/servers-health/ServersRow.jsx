import styles from "./ServersHealth.module.css"
import { useRef, memo } from "react"
import { useDashboard } from "./ServersHealthContext.jsx"

function ServersRow({ port, path, requests, uptime, status }) {
    
    const ctx = useDashboard()
    const { paused, setPaused } = ctx
    const rendersRef = useRef(0)
    
    rendersRef.current++

    console.log(port + " " + rendersRef.current)

    function formatUptime(time) {
        const mins = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${mins} mins ${seconds} seconds`
    }

    return (
        <div className={styles.rowWrapper}>
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
                    <div>{uptime ? formatUptime(uptime) : '-'}</div>
                </div>
                <div style={{marginLeft: "auto", color: status === "fulfilled" ? "green" : "red"}}>
                    {status === "fulfilled" ? "Healthy" : "Failed"}
                </div>
            </div>
            <div>
                <div>Renders: {rendersRef.current}</div>
                <div>Ctx val: {paused ? "paused" : "active"}</div>
            </div>
        </div>
    )
}

export default memo(ServersRow)