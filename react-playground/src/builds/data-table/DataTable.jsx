import { useState, useReducer } from 'react';
import styles from "./DataTable.module.css"

export default function DataTable({ columns, data }) {

  const [page, setPage] = useState(0)
  const [shown, setShown] = useState(5)
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    dir: "asc"
  }) // null | { dir: asc/des, key: columnName }

  const initialInputValsState = initializeColumnInputState(columns)
  const [state, dispatch] = useReducer(reducer, initialInputValsState)

  console.log(state)

  const pageData = getSortedData(data)
  const dataToShow = pageData.slice(page * shown, (page * shown) + shown)

  const totalPages = Math.ceil(data.length / shown)

  function reducer(state, action) {

    switch(action.type) {

      case("SET_FIELD"): {
        return {...state}
      }

      default: {
        throw new Error("Invalid action: ", action)
      }

    }
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
                  return <input type="text" value={state[key].value} onChange={(e) => dispatch({type: "SET_FIELD", key: key, value: e.target.value})}/>
                } else if (type === "number") {
                  return (
                    <div>
                      <input type="number" value={state[key].min} />
                      <input type="number" value={state[key].max} />
                    </div>
                  )
                }
              }

              return (
                <th key={key} style={{cursor: "pointer"}} onClick={() => handleClickSortingOption(key)}>
                  <div>{label}</div>
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