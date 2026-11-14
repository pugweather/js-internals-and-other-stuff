import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

export default function StarWars() {

    const [inputVal, setInputVal] = useState('')

    const [view, setView] = useState("cards")
    const [page, setPage] = useState(1)

    const { data, isPending, error, isError, refetch } = useQuery({
        queryKey: ["starships", page],
        queryFn: () => fetchData()
    })

    async function fetchData() {

        const response = await fetch(`https://swapi.dev/api/starships/?page=${page}`)
        if (!response.ok) {
            throw new Error("Network error")
        }
        const data = await response.json()

        return data
    }

    console.log(data)
    
    if (isPending) return <div>...loading</div>
    
    const filteredStarships = inputVal.length === 0 ?
    data.results :
    data.results.filter(x => 
        x.name.toLowerCase().includes(inputVal.toLowerCase()) ||
        x.manufacturer.toLowerCase().includes(inputVal.toLowerCase())
    )

    return (
        <div>
            {isPending && <div>...loading</div>}
            <div className="top-wrapper">
                <label htmlFor="search">Search</label>
                <input id="search" type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)}/>
                <button onClick={() => setView(prev => prev === "cards" ? "list" : "cards")}>toggle view</button>
                <div style={{marginLeft: "10px"}}>view: {view}</div>
            </div>
            {isError && error && <div className="error-text">error: {error}</div>}
            {   view === "cards" ? 
                <>
                    <div className="cards-wrapper">
                        {
                            filteredStarships.map(x => {
                                return (
                                    <div className="card-item">
                                        <div>{x.name}</div>
                                        <div>{x.manufacturer}</div>
                                        <div>{x.starship_class}</div>
                                    </div>
                                )
                            })
                        }
                    </div> 
                    <button onClick={() => setPage(prev => data.previous == null ? 1 : prev - 1)} disabled={data.previous === null ? true : false}>prev</button>
                    <button onClick={() => setPage(prev => data.next === null ? page : prev + 1)} disabled={data.next === null ? true : false}>next</button>
                </>

                :
                <ul className="list-wrapper">
                    {
                        filteredStarships.map(x => {
                            return (
                                <li className="list-item">
                                    <div>{x.name}</div>
                                    <div>{x.manufacturer}</div>
                                    <div>{x.starship_class}</div>
                                </li>
                            )
                        })
                    }
                </ul>
            }
        </div>
    )
}