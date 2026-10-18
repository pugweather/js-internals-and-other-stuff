import './styles.css'

// Grid exercise: work the sections top to bottom.
// Each has a TODO in styles.css.

export default function GridDemo() {
  return (
    <div className="grid-demo">

      {/* 1. Basic grid — columns + gap */}
      <h3>1. Columns + gap</h3>
      <div className="ex1">
        {[1,2,3,4,5,6].map(n => <div className="cell" key={n}>{n}</div>)}
      </div>

      {/* 2. fr units vs fixed — toggle between the two rows */}
      <h3>2. fr vs px</h3>
      <div className="ex2-fr">
        {[1,2,3].map(n => <div className="cell" key={n}>{n}</div>)}
      </div>
      <div className="ex2-px">
        {[1,2,3].map(n => <div className="cell" key={n}>{n}</div>)}
      </div>

      {/* 3. Spanning tracks — cell A should span 2 columns */}
      <h3>3. Spanning</h3>
      <div className="ex3">
        <div className="cell featured">A</div>
        {[2,3,4,5].map(n => <div className="cell" key={n}>{n}</div>)}
      </div>

      {/* 4. Responsive without media queries — resize the browser */}
      <h3>4. auto-fill + minmax</h3>
      <div className="ex4">
        {[1,2,3,4,5,6,7,8].map(n => <div className="cell" key={n}>{n}</div>)}
      </div>

      {/* 5. Named areas — layout that reads like a diagram */}
      <h3>5. template-areas</h3>
      <div className="ex5">
        <div className="cell header">header</div>
        <div className="cell sidebar">sidebar</div>
        <div className="cell main">main</div>
        <div className="cell footer">footer</div>
      </div>

      {/* 6. Centering a child in a cell */}
      <h3>6. place-items</h3>
      <div className="ex6">
        <div className="cell center-me">center me</div>
        <div className="cell center-me">center me</div>
      </div>

    </div>
  )
}
