// import StarWars from './questions/star-wars-demo/StarWars.jsx'
// import PostsListManual from './questions/posts-fetch/PostsListManual.jsx'
// import ServersHealth from "./servers-health/ServersHealth"
// import DebouncedSearch from "./questions/debounced-search/DebouncedSearch.jsx"
// import { CommentsSection } from "./questions/nested-comments/CommentsSection"
// import Form from "./content/mutli-step/Form"
import Child from "./questions/state-management/Child"
import { ContextReducer } from "./questions/state-management/ContextReducer"

// Swap the import above to work on a different question.
export default function App() {

  return (
    <ContextReducer>
        <Child />
    </ContextReducer>
  )
}
