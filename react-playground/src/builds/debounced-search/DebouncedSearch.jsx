import { useState, useEffect, useRef } from 'react'
import data from "./data.js"

function useDebounce(value, delay) {

  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {

    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
    }

  }, [value, delay])

  return debouncedValue
}

export default function DebouncedSearch() {

  const MAX_CACHE_SIZE = 3

  const [results, setResults] = useState([])
  const [term, setTerm] = useState('')
  const debouncedTerm = useDebounce(term, 1000)

  const cache = useRef(new Map())

  console.log(cache)

  function fakeFetch(query) {
    return new Promise((resolve, reject) => {
      
      setTimeout(() => {
        const filtered = query.length ? 
        data.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        ) : []

        resolve(filtered)

      }, 250)
    })
  }

  useEffect(() => {
    async function fetchData() {
      const lowercaseQuery = debouncedTerm.toLowerCase()
      const data = cache.current.get(lowercaseQuery)
      if (data){
        console.log("CACHE HIT -> " + lowercaseQuery)
        setResults(data)
        return
      }
      try {
        const data = await fakeFetch(debouncedTerm)
        if (data.length > 0) {
          if (cache.current.size >= MAX_CACHE_SIZE) {
            const oldestQueryKey = cache.current.keys().next().value
            cache.current.delete(oldestQueryKey)
          }
          cache.current.set(lowercaseQuery, data)
        }
        console.log("FETCH -> " + lowercaseQuery)
        setResults(data)
      } catch(err) {
        console.error(err)
      }
    } 
    fetchData()
 }, [debouncedTerm])

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <input
        style={{ width: '100%', padding: 10, fontSize: 16, boxSizing: 'border-box' }}
        placeholder="Search items..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {results.map((item) => (
          <li key={item.id} style={{ padding: 10, borderBottom: '1px solid #eee' }}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
