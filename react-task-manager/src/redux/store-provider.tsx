"use client"

import type React from "react"

import { useRef } from "react"
import { Provider } from "react-redux"
import { makeStore, type AppStore } from "./store"

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore>(null)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
