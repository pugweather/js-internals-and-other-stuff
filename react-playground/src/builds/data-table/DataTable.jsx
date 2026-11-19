import { useState } from 'react';
import users from './users';
import styles from "./DataTable.module.css"

export default function DataTable() {

  const [page, setPage] = useState(0)
  const [shown, setShown] = useState(5)

  const usersToShow = users.slice(page * shown, (page * shown) + shown)

  const totalPages = Math.ceil(users.length / shown)

  function changeShownValue(val) {
    setPage(0)
    setShown(val)
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            {[
              { label: 'ID', key: 'id' },
              { label: 'Name', key: 'name' },
              { label: 'Age', key: 'age' },
              { label: 'Occupation', key: 'occupation' },
            ].map(({ label, key }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {usersToShow.map(({ id, name, age, occupation }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td>{age}</td>
              <td>{occupation}</td>
            </tr>
          ))}
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