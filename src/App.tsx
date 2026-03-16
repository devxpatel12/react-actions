import { useState, useMemo } from 'react'
import { useTodos } from './useTodos'
import type { Todo, Filter } from './types'
import './App.css'

function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={`todo-label ${todo.completed ? 'completed' : ''}`}
      >
        {todo.text}
      </label>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className="todo-delete"
        aria-label="Delete todo"
      >
        ×
      </button>
    </li>
  )
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos()
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed)
    if (filter === 'completed') return todos.filter((t) => t.completed)
    return todos
  }, [todos, filter])

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addTodo(input)
    setInput('')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tasks</h1>
        <p className="subtitle">Add items, mark done, filter. Data is saved in this browser.</p>
      </header>

      <form onSubmit={handleSubmit} className="add-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you need to do?"
          className="add-input"
          autoFocus
          aria-label="New todo"
        />
        <button type="submit" className="add-btn" disabled={!input.trim()}>
          Add
        </button>
      </form>

      {todos.length > 0 && (
        <>
          <div className="filters">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`filter-btn ${filter === f.value ? 'active' : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <ul className="todo-list" aria-label="Todo list">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </ul>

          {filteredTodos.length === 0 && (
            <p className="empty-message">
              {filter === 'all'
                ? 'No tasks yet. Add one above.'
                : `No ${filter} tasks.`}
            </p>
          )}

          {completedCount > 0 && (
            <button
              type="button"
              onClick={clearCompleted}
              className="clear-completed"
            >
              Clear completed ({completedCount})
            </button>
          )}
        </>
      )}

      {todos.length === 0 && (
        <p className="empty-message">No tasks yet. Add one above to get started.</p>
      )}
    </div>
  )
}

export default App
