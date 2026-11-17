import { useState, useEffect } from "react"

export default function useFetch<T>(url: string) {

    const [data, setData] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error("Couldn't make fetch request")
                }
                const responseData = await response.json()
                setData(responseData)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error") 
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [url])

    return { data, isLoading, error }
}