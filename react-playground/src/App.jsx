// import StarWars from './questions/star-wars-demo/StarWars.jsx'
// import PostsListManual from './questions/posts-fetch/PostsListManual.jsx'
// import ServersHealth from "./servers-health/ServersHealth"
// import DebouncedSearch from "./questions/debounced-search/DebouncedSearch.jsx"
// import { CommentsSection } from "./questions/nested-comments/CommentsSection"
// import Form from "./content/mutli-step/Form"
// import Child from "./questions/state-management/Child"
// import { ContextReducer } from "./questions/state-management/ContextReducer"
// import BasicGrid from "./questions/basic-grid/BasicGrid"
// import Wordle from "./wordle/Wordle"
// import WordleV2 from "./questions/wordle-v2/WordleV2.jsx"
// import Matching from "./questions/matching/Matching.jsx"
// import SnakeGame from "./questions/snake/SnakeGame.jsx"
// import Otp from "./questions/otp/Otp.jsx"
// import ConnectFour from "./questions/connect-four/ConnectFour.jsx"
import QueuedProgressBars from "./questions/queued-progress-bars/QueuedProgressBars.jsx"

// Swap the import above to work on a different question.
export default function App() {

  return (
    <div className="page">
      <QueuedProgressBars />
    </div>
    // <ContextReducer>
    //     <Child />
    // </ContextReducer>
  )
}
