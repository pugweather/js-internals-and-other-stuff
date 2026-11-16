import { useState, useEffect, useRef } from "react"
import styles from "./PostingsV2.module.css"

const JOB_IDS_API_URL = "https://hacker-news.firebaseio.com/v0/jobstories.json"
const PAGE_LENGTH = 6

export default function PostingsV2() {

    // Pseudocode:

    // Entry point is a click event that increments page. an effect listens for that page change
    // This page change calls some kind of fetch jobs function (page). 
        // For this func, create a fetch job ids function that grabs all ids from api and returns a slice
        // A separate function fetch jobs will store this func call in a var then call promise.all on an array of fetch requests
        // this func will call setjobs which is what we render to the screen

    const [jobIds, setJobIds] = useState(null)
    const [jobs, setJobs] = useState([])
    const [page, setPage] = useState(0)
    const [isFetching, setIsFetching] = useState(false)

    const isFetchingRef = useRef(false)

    const fetchedAllJobs = jobs.length >= (jobIds || []).length

    useEffect(() => {
        getJobs(page)
    }, [page])

    async function getJobIds(page) {
        try {

            let jobIdItems = jobIds

            if (!jobIdItems) {
                const response = await fetch(JOB_IDS_API_URL)
                if (!response.ok) {
                    throw new Error("Couldn't fetch job ids")
                }
                const ids = await response.json()
                jobIdItems = ids
                setJobIds(ids)
            }
            const start = page * PAGE_LENGTH
            const end = start + PAGE_LENGTH
            return jobIdItems.slice(start, end)

        } catch(err) {
            console.log("Err: ", err)
        }
    }

    async function getJobs(page) {
        try {

            if (isFetchingRef.current) return
            isFetchingRef.current = true
            setIsFetching(true)
            
            const ids = await getJobIds(page)
            if (!ids.length) return

            const newJobs = await Promise.all(ids.map(async (id) => 
                await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
                    .then(res => res.json())
            ))
            setJobs(prev => [...prev, ...newJobs])
            
        } catch(err) {
            console.error("Err: ", err)
        } finally {
            isFetchingRef.current = false
            setIsFetching(false)
        }
    }

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
            {!fetchedAllJobs && <button onClick={() => setPage(prev => prev + 1)} disabled={isFetching}>{isFetching ? "loading..." : 'load more'}</button>}
        </div>
    )
}