'use client'

import * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type Theme = 'dark' | 'light' | 'system'

const ThemeProviderContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
} | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  ..._props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme as Theme)

  useEffect(() => {
    if (typeof globalThis !== 'undefined' && globalThis.document) {
      const root = globalThis.document.documentElement
      root.classList.remove('light', 'dark')

      if (theme === 'system') {
        const systemTheme = globalThis.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        root.classList.add(systemTheme)
        return
      }

      root.classList.add(theme)
    }
  }, [theme])

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')
  return context
}