import { useState, useEffect } from "react"
import styles from "./Histogram.module.css"

const API_URL = "https://www.random.org/integers/?num=200&min=1950&max=2019&col=1&base=10&format=plain"

export default function Histogram() {

    const [data, setData] = useState([])

    const dateBuckets = getDateBuckets()
    const years = Object.keys(dateBuckets)
    const yearCounts = Object.values(dateBuckets)
    
    // Y axis label
    const highestLabelValue = Math.ceil(Math.max(...yearCounts) / 10) * 10
    const yAxisLabelPercentages = Array.from({ length: highestLabelValue / 10 }, (_, idx) => (idx + 1) * 10)

    console.log(yearCounts)
    console.log(yAxisLabelPercentages)

    async function fetchData() {
        try {
            const response = await fetch(API_URL)
            if (!response.ok) {
                throw new Error("Couldn't fetch data")
            }
            const data = await response.text()
            setData(data.split('\n').filter(date => Boolean(date)))
        } catch(err) {
            console.error("Error: couldn't fetch data")
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    function getDateBuckets() {
        // represents the dates 1950, 1960, etc...
        const dateBuckets = {}
        for (let date of data) {
            const bucket = Math.floor(date / 10)
            dateBuckets[bucket * 10] = (dateBuckets[bucket * 10] || 0) + 1
        }
        return dateBuckets
    }

    return (
        <>
            <div className={styles.wrapper}>
                {/* X axis */}
                {
                    years.map((year, idx) => {
                        const leftPercentage = (100 / years.length) * idx
                        return  <div key={year} className={styles.xLabel} style={{left: `${leftPercentage}%`}}>{year}</div>
                    })
                }
                {/* Y axis */}
                {
                    yAxisLabelPercentages.map((count, idx) => {
                        const bottomPercentage = (100 / yAxisLabelPercentages.length) * (idx + 1)
                        return  <div key={count} className={styles.yLabel} style={{bottom: `${bottomPercentage}%`}}>{count}</div>
                    })
                }
                {/* Bars */}
                {
                    yearCounts.map((count, idx) => {
                        const leftPercentage = (100 / yearCounts.length) * idx
                        const heightPercentage = (count / highestLabelValue) * 100
                        const barWidth = (100 / years.length) * 0.85
                        return <div key={years[idx]} className={styles.bar} style={{left: `${leftPercentage}%`, height: `${heightPercentage}%`, width: `${barWidth}%`}}>{count}</div>
                    })
                }
            </div>
            <button onClick={fetchData}>refetch</button>
        </>
    )
}