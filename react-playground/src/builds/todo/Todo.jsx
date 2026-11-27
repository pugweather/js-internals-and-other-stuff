import { useState } from "react"

export default function Todo() {

    const [todos, setTodos] = useState([])
    const [text, setText] = useState('')

    function handleSubmit() {

        if (!text.length) return

        const todoExists = todos.find(todo => todo === text.trim())
        if (todoExists) return
        
        setTodos(prev => [...prev, text.trim()])
        setText('')
    }

    function handleDeleteTodo(idx) {
        setTodos(prev => prev.filter((_, i) => idx !== i))
    }

    return (
        <div>
            <h1>Todo List</h1>
            <div>
                <input type="text" placeholder="Add your task" value={text} onChange={(e) => setText(e.target.value)} />
            <div>
                <button onClick={handleSubmit}>Submit</button>
            </div>
            </div>
            <ul>
                {todos.map((todo, idx) => {
                    return (
                        <li>
                            <span>{todo}</span>
                            <button onClick={() => handleDeleteTodo(idx)}>Delete</button>
                        </li>
                    )
                })
                }
            </ul>
        </div>
    );
}
