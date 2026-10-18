import { useEffect, useState } from 'react'
import './styles.css'

export default function PostsListManual() {

  const MAX_FETCH_ATTEMPTS = 3

  const [posts, setPosts] = useState([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [fetchMessage, setFetchMessage] = useState('')

  const totalPages = Math.ceil(totalPosts / 10)

  useEffect(() => {

    // Practice for stale 
    // let ignore = false

    let retryTimeoutId
    const controller = new AbortController()
    const { signal } = controller

    async function fetchPosts(attempts = 1) {
      setFetchMessage("attempt # " + attempts)
      setStatus('loading')
      setError(null)

      try {

        // TODO: implement AbortController
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_page=${page + 1}&_limit=10`, { signal: AbortSignal.any([signal, AbortSignal.timeout(1000)]) })

        // if (ignore) return

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const total = Number(response.headers.get('X-Total-Count'))
        const data = await response.json()

        setPosts(data)
        setTotalPosts(total)
        setStatus('success')
      } catch (e) {
        // if (ignore) return
        // if (e.name === "AbortError") return
        if (attempts < MAX_FETCH_ATTEMPTS) {
          fetchPosts(attempts + 1)
        } else {
          setError(e.message)
          setStatus('error')
          setFetchMessage('')
        }
      }
    }

    fetchPosts()

    return () => {
      // clearTimeout(retryTimeoutId)
      // controller.abort()
      // ignore = true
    }
  }, [page])

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <div className="posts">
        {status === 'loading' && <div>loading...</div>}
        {status === 'error' && <div>{error}</div>}
        {status === 'success' &&
          posts.map(p => (
            <div key={p.id} style={{marginBottom: "5px"}}>
              <div style={{fontWeight: "bold", fontSize: "14px"}}>{p.title}</div>
              <div>{p.id} - {p.body}</div>
            </div>
          ))
        }
      </div>
      <div>{fetchMessage}</div>
      <div style={{display: "flex", gap: "10px"}}>
        <button onClick={() => setPage(prev => Math.max(0, prev - 1))} disabled={page <= 0}>prev</button>
        <div>{`Page ${page + 1} of ${totalPages}`}</div>
        <button onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))} disabled={page >= totalPages - 1}>next</button>
      </div>
    </div>
  )
}
