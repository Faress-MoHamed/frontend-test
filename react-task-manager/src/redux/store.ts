import { configureStore } from "@reduxjs/toolkit"
import tasksReducer, { type Task } from "./tasksSlice"

const loadState = (): Task[] | undefined => {
  try {
    const serializedState = localStorage.getItem("tasks")
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error("Error loading state from localStorage:", err)
    return undefined
  }
}

const saveState = (state: Task[]) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem("tasks", serializedState)
  } catch (err) {
    console.error("Error saving state to localStorage:", err)
  }
}

export const makeStore = () => {
  const preloadedState = loadState()
  const store = configureStore({
    reducer: {
      tasks: tasksReducer,
    },
    preloadedState: {
      tasks: {
        tasks: preloadedState || [],
      },
    },
  })

  store.subscribe(() => {
    saveState(store.getState().tasks.tasks)
  })

  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
