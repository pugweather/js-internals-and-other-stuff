import { useState, useEffect } from 'react'
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

  const [results, setResults] = useState([])
  const [term, setTerm] = useState('')
  const debouncedTerm = useDebounce(term, 1000)

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
      try {
        const data = await fakeFetch(debouncedTerm)
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
