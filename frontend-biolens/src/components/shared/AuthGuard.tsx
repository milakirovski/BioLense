'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/login')
    }
  }, [isLoading, token, router])

  if (isLoading || !token) return null

  return <>{children}</>
}