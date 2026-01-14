import { create } from 'zustand'
import { authAPI } from '@/lib/api'

interface User {
  id: string
  email: string
  username?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const data = await authAPI.login({ email, password })
      localStorage.setItem('access_token', data.access_token)
      set({
        token: data.access_token,
        user: { id: data.user_id, email },
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (email: string, password: string, username: string) => {
    set({ isLoading: true })
    try {
      const data = await authAPI.register({ email, password, username })
      localStorage.setItem('access_token', data.access_token)
      set({
        token: data.access_token,
        user: { id: data.user_id, email, username },
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('access_token')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      set({ isAuthenticated: false })
      return
    }

    try {
      const user = await authAPI.getCurrentUser()
      set({
        user,
        token,
        isAuthenticated: true,
      })
    } catch (error) {
      localStorage.removeItem('access_token')
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      })
    }
  },
}))

