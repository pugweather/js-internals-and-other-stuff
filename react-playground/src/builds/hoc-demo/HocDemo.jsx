// HOC exercise — Higher-Order Components
// ======================================
//
// A HOC is just a function: Component -> Component.
// It wraps a component to add behavior, then returns the enhanced one.
//
//   const Enhanced = withSomething(PlainComponent)
//
// Naming convention: "with<Behavior>" (withLoading, withAuth, ...).
//
// TASK 1 — implement withLoading:
//   Takes a component, returns a new component that renders
//   "Loading..." when the `loading` prop is true, otherwise renders
//   the wrapped component with ALL its props passed through ({...props}).
//
//   Skeleton:
//
//     function withLoading(Component) {
//       return function Enhanced(props) {
//         if (props.loading) return <div>Loading...</div>
//         return <Component {...props} />
//       }
//     }
//
// TASK 2 — wrap UserList below and render the wrapped version with a
//   loading prop driven by a button toggle in App-level state here.
//
// TASK 3 (stretch) — write withAuth: if props.user is null render
//   "Please log in", else render the component with props.
//
// Modern context: HOCs were the pre-hooks reuse pattern (Redux's
// connect(), React Router's withRouter). Hooks cover most of it now,
// but you'll see them in older codebases and they still test the core
// skill: functions that take/return components.
// ======================================================================

// TODO: implement withLoading here (Task 1)

import { useState } from "react"

function withLoading(Component) {
  return function Enhanced(props) {
    if (props.loading) {
      return <div>...loading</div>
    } else {
      return <Component {...props}/>
    }
  }
}

function UserList({ users }) {
  return (
    <ul>
      {users.map((u) => (
        <li key={u}>{u}</li>
      ))}
    </ul>
  )
}

const UsersListWithLoading = withLoading(UserList)

// TODO: const UserListWithLoading = ???  (Task 2)

export default function HocDemo() {

  const [loading, setLoading] = useState(true)

  const users = ['Ada', 'Grace', 'Linus']


  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
      {/* render <UserListWithLoading loading={...} users={users} /> */}
      {/* placeholder so the page isn't blank: */}
      <UsersListWithLoading users={users} loading={loading}/>
      <button onClick={() => setLoading(prev => !prev)}>toggle</button>
    </div>
  )
}