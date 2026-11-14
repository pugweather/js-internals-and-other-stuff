import {   useState } from 'react'
import { useQuery } from "@tanstack/react-query"
import './styles.css'

export default function PostsList() {

  const [page, setPage] = useState(0)

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts()
  })

  const totalPages = data ? Math.ceil(data.total / 10) : 0

  async function fetchPosts() {

      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page + 1}&_limit=10`)

      if (!response.ok) {
        throw new Error("Failed to fetch!!!!")
      }
      
      const total = response.headers.get('X-Total-Count')
      const data = await response.json()

      return {posts: data, total: Number(total)}
  }

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <div className="posts">
      {isPending && <div>loading...</div>}
      {isError && <div>{error.message}</div>}
      {!isPending && !isError &&
        data.posts.map(p => {
          return (
            <div key={p.id} style={{marginBottom: "5px"}}>
              <div style={{fontWeight: "bold", fontSize: "14px"}}>{p.title}</div>
              <div>{p.id} - {p.body}</div>
            </div>
          )
        })
      }
      </div>
      <div style={{display: "flex", gap: "10px"}}>
        <button onClick={() => setPage(prev => Math.max(0, prev - 1))} disabled={page <= 0}>prev</button>
        <div>{`Page ${page + 1} of ${totalPages}`}</div>
        <button onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))} disabled={page >= totalPages - 1}>next</button>
        <button onClick={refetch}>refresh</button>
      </div>
    </div>
  )
}
