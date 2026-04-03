import { create } from 'zustand'
import { CurrentUser } from '../types'

interface AuthState {
  token: string | null
  user: CurrentUser | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  setUser: (user: CurrentUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  setToken: (token) => {
    localStorage.setItem('token', token)
    set({ token, isAuthenticated: true })
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null, isAuthenticated: false })
  },
}))
