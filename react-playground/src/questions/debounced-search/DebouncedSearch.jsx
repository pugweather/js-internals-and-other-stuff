import { useState, useEffect } from 'react'

const data = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
  { id: 4, name: 'Date' },
  { id: 5, name: 'Elderberry' },
  { id: 6, name: 'Fig' },
  { id: 7, name: 'Grape' },
  { id: 8, name: 'Honeydew' },
  { id: 9, name: 'Kiwi' },
  { id: 10, name: 'Lemon' },
]

// TODO: implement your own useDebounce hook.
// Signature: const debouncedValue = useDebounce(value, delay)
// It should return `value` only after `delay` ms have passed
// without `value` changing again.

function useDebounce(value, delay) {

  const [debouncedQuery, setDebouncedQuery] = useState(value)

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(value)
    }, delay)

    return () => {
      clearTimeout(timerId)
    }

    
  }, [value])
  
  return debouncedQuery

}



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

  const [term, setTerm] = useState('')
  const debouncedTerm = useDebounce(term, 1000)

  const results = debouncedTerm.length ? 
    data.filter((item) =>
      item.name.toLowerCase().includes(debouncedTerm.toLowerCase())
    ) : []

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
