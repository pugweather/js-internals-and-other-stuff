import { useState, useEffect, useRef } from "react"
import styles from "./Postings.module.css"

const JOB_IDS_API_URL = "https://hacker-news.firebaseio.com/v0/jobstories.json"
const NUM_JOBS_TO_FETCH = 6

export default function Postings() {

    const [jobIds, setJobIds] = useState([])
    const [jobs, setJobs] = useState([])
    const [isFetching, setIsFetching] = useState(false)

    const jobsIdxRef = useRef(0)
    const isFetchingRef = useRef(false)

    const allFetchesComplete = jobs.length >= jobIds.length

    useEffect(() => {
        async function fetchIds() {
            try {
                const response = await fetch(JOB_IDS_API_URL)
                if (!response.ok) {
                    throw new Error("Couldn't fetch job ids")
                }
                const ids = await response.json()
                setJobIds(ids)
            } catch(err) {
                console.error("err: ", err)
            }
        }
        fetchIds()
    }, [])

    useEffect(() => {
        fetchJobs()
    }, [jobIds])
    
    async function fetchJobs() {

        if (isFetchingRef.current) return
        if (jobsIdxRef.current >= jobIds.length) return

        const start = jobsIdxRef.current

        try {

            setIsFetching(true)
            isFetchingRef.current = true
            
            jobsIdxRef.current = Math.min(jobsIdxRef.current + NUM_JOBS_TO_FETCH, jobIds.length)
            
            const jobArr = []
            const jobIdsToFetch = jobIds.slice(start, start + NUM_JOBS_TO_FETCH)
            
            for (let id of jobIdsToFetch) {
                const jobApiUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`
                const response = await fetch(jobApiUrl)
                const job = await response.json()
                jobArr.push(job)
            }
            setJobs(prev => [...prev, ...jobArr])
        } catch(err) {
            jobsIdxRef.current = start
            console.error("err: ", err)
        } finally {
            setIsFetching(false)
            isFetchingRef.current = false
        }
    }

    if (!jobs.length) return <div>loading....</div>

    return (
        <div>
            <h1>Hacker News Job Board</h1>
            <div>
                {
                    jobs.map(job => {
                        return (
                            <div key={job.id} className={styles.jobWrapper}>
                                <h2>{job.url ? <a target="_blank" href={job.url}>{job.title}</a> : job.title}</h2>
                                <div className={styles.by}>by: {job.by}</div>
                            </div>
                        )
                    })
                }
            </div>
            {!allFetchesComplete && <button onClick={fetchJobs} disabled={isFetching}>load more</button>}
        </div>
    )
}