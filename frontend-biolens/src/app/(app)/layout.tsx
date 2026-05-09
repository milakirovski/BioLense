'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box } from '@chakra-ui/react'
import { Navbar } from '@/components/layout/navbar'
import { useAuth } from '@/context/AuthContext'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/login')
    }
  }, [isLoading, token, router])

  if (isLoading || !token) return null

  return (
    <>
      <Navbar />
      <Box as="main" bg="gray.50" minHeight="100vh">
        {children}
      </Box>
    </>
  )
}
