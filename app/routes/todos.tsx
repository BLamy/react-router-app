import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Checkbox } from "~/components/ui/checkbox"
import { Trash2 } from "lucide-react"

interface Todo {
  id: number
  text: string
  completed: boolean
}

const STORAGE_KEY = "todos"

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [input, setInput] = useState("")

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  function addTodo() {
    const text = input.trim()
    if (!text) return
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }])
    setInput("")
  }

  function toggleTodo(id: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTodo(id: number) {
    // Bug: does nothing instead of deleting
  }

  return (
    <div className="flex min-h-svh justify-center p-6">
      <div className="flex w-full max-w-md flex-col gap-4">
        <h1 className="text-2xl font-bold">Todos</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            addTodo()
          }}
          className="flex gap-2"
        >
          <Input
            aria-label="New todo"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" aria-label="Add todo">
            Add
          </Button>
        </form>

        {todos.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No todos yet. Add one above!
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  aria-label={`Toggle ${todo.text}`}
                />
                <span
                  className={`flex-1 ${todo.completed ? "text-muted-foreground line-through" : ""}`}
                >
                  {todo.text}
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`Delete ${todo.text}`}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
