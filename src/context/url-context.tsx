import type { User } from '@supabase/supabase-js'
import { createContext } from 'react'

interface UrlContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  fetchUser: () => void
}

export const UrlContext = createContext<UrlContextType>({
  user: null,
  loading: false,
  isAuthenticated: false,
  fetchUser: () => {}
})
