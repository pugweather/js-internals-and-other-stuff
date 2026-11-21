import { useState, useReducer } from 'react';
import styles from "./DataTable.module.css"

export default function DataTable({ tableId, columns, data }) {

  const [page, setPage] = useState(0)
  const [shown, setShown] = useState(5)
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    dir: "asc"
  }) // null | { dir: asc/des, key: columnName }

  const initialInputValsState = initializeColumnInputState(columns)
  const [state, dispatch] = useReducer(reducer, initialInputValsState)


  const pageData = getSortedData(data)

  // TODO: would memoize these for production
  const filteredData = getFilteredData(pageData)
  const dataToShow = filteredData.slice(page * shown, (page * shown) + shown)

  const totalPages = Math.max(Math.ceil(filteredData.length / shown), 1)

  function reducer(state, action) {

    switch(action.type) {

      case("SET_FIELD"): {
        if (action.bound) {
          if (action.bound === "min") {
            return {...state, [action.key]: {...state[action.key], [action.bound]: action.value}}
          } else if (action.bound === "max") {
            return {...state, [action.key]: {...state[action.key], [action.bound]: action.value}}
          }
        } else {
          return {...state, [action.key]: {value: action.value}}
        }
      }

      default: {
        throw new Error("Invalid action: ", action)
      }

    }
  }

  function getFilteredData(data){

    let newData = [...data]

    for (const [column, filters] of Object.entries(state)) {
      for (const filter in filters) {
        const filterVal = filters[filter]
        if (filterVal) { // Ignore empty inputs
          if (filter === "min") {
            newData = newData.filter(x => x[column] >= Number(filters[filter].trim()))
          } else if (filter === "max") {
            newData = newData.filter(x => x[column] <= Number(filters[filter].trim()))
          } else if (filter === "value") {
            newData = newData.filter(x => x[column].toLowerCase().includes(filters[filter].toLowerCase().trim()))
          }
        }
      }
    }

    return newData
  }

  function changeShownValue(val) {
    setPage(0)
    setShown(val)
  }

  function handleClickSortingOption(key) {
    setSortConfig(prev => {
      if (prev.key !== key) {
        return { key: key, dir: "asc" }
      } else {
        return { ...prev, dir: prev.dir === "asc" ? "des" : "asc" }
      }
    })
  }

  function getSortedData(data) {

    if (sortConfig === null) return data

    const { key, dir } = sortConfig
    const isNumberColumn = columns.find(col => col.key === key).type === "number"
    const isStringColumn = columns.find(col => col.key === key).type === "string"
    if (isNumberColumn) {
      return dir === "asc" ? [...data].sort((a, b) => a[key] - b[key]) : [...data].sort((a, b) => b[key] - a[key])
    } else if (isStringColumn) {
      return dir === "asc" ? [...data].sort((a, b) => a[key].localeCompare(b[key])) : [...data].sort((a, b) => b[key].localeCompare(a[key]))
    }

    console.error("Invalid key filter - returning default data", key)
    return data
  }

  function initializeColumnInputState(cols) {
    if (!cols) {
      console.error("cols doesn't exist, " + cols)
      return null
    }
    const inputVals = {}
    cols.forEach(col => {
      const isNumberColumn = col.type === "number"
      const isStringColumn = col.type === "string"
      if (isNumberColumn) {
        inputVals[col.key] = { min: "", max: "" }
      } else if (isStringColumn) {
        inputVals[col.key] = { value: "" }
      }
    })
    return inputVals

  }
 
  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map(({ label, key, type }) => {

              const inputsJsxForType = (type) => {
                if (type === "string") {
                  return <input type="text" value={state[key].value} onChange={(e) => {dispatch({type: "SET_FIELD", key: key, value: e.target.value}); setPage(0)}} placeholder="Search..." />
                } else if (type === "number") {
                  return (
                    <div style={{display: "flex", flexDirection: "column"}}>
                      <input type="number" value={state[key].min} onChange={(e) => {dispatch({type: "SET_FIELD", key: key, value: e.target.value, bound: "min"}); setPage(0)}} placeholder="Min" />
                      <input type="number" value={state[key].max} onChange={(e) => {dispatch({type: "SET_FIELD", key: key, value: e.target.value, bound: "max"}); setPage(0)}} placeholder="Max" />
                    </div>
                  )
                }
              }

              return (
                <th key={key} style={{cursor: "pointer"}}>
                  <div onClick={() => handleClickSortingOption(key)}>{label}</div>
                  {inputsJsxForType(type)}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {dataToShow.map(item => {
            return (
              <tr key={item.id}>
                {columns.map(col => <td key={col.key}>{item[col.key]}</td>)}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className={styles.buttonsWrapper}>
        <select name="show-dropdown" id="show-dropdown" onChange={(e) => changeShownValue(Number(e.target.value))} value={shown}>
          {[5, 10, 20].map(amt => {
            return <option key={amt} value={amt}>{`Show ${amt}`}</option>
          })}
        </select>
        <button onClick={() => setPage(prev => Math.max(0, prev - 1))} disabled={page === 0}>prev</button>
        <div>{`Page ${page + 1} of ${totalPages}`}</div>
        <button onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))} disabled={page === totalPages - 1}>next</button>
      </div>
    </div>
  );
}