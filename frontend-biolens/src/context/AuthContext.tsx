'use client'
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import axios from 'axios'
import { routes } from '@/lib/routes'

export interface User {
  id?: number
  email: string
  firstName: string
  lastName: string
  farmName: string
}

export interface RegisterPayload {
  email: string
  password: string
  repeatPassword: string
  firstName: string
  lastName: string
  farmName: string
}

export interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
  farmName?: string
  email?: string
  password?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function applyToken(token: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

function clearToken() {
  delete axios.defaults.headers.common['Authorization']
}

// Runs synchronously at module-import time on the client — before any
// React effect fires — so the token is present on the very first request.
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('token')
  if (stored) applyToken(stored)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Keep the interceptor as a belt-and-suspenders for edge cases
    // (e.g. token written to localStorage by another tab).
    // No cleanup/eject so it survives StrictMode unmount/remount.
    axios.interceptors.request.use((config) => {
      const stored = localStorage.getItem('token')
      if (stored) config.headers.set('Authorization', `Bearer ${stored}`)
      return config
    })

    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser) as User)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await axios.post<{ token: string }>(routes.users.login, { email, password })
    localStorage.setItem('token', data.token)
    applyToken(data.token)
    const { data: userData } = await axios.get<User>(routes.users.findByEmail, { params: { email } })
    setToken(data.token)
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    await axios.post(routes.users.register, payload)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [])

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      const { password: _pw, ...userFields } = payload
      await axios.put(routes.users.profile, payload)
      setUser((prev) => {
        if (!prev) return prev
        const updated = { ...prev, ...userFields }
        localStorage.setItem('user', JSON.stringify(updated))
        return updated
      })
    },
    [],
  )

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
