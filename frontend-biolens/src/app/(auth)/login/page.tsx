'use client'
import { useState } from 'react'
import { Box, Button, Container, Heading, Input, Text, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="md">
        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.100"
          p="10"
        >
          <VStack gap="8" align="stretch">
            <VStack gap="1">
              <Heading size="2xl" color="green.800">BioLens</Heading>
              <Text color="gray.500">Sign in to your farm account</Text>
            </VStack>

            <form onSubmit={onSubmit}>
              <VStack gap="4" align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">Email</Text>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    borderColor="gray.200"
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">Password</Text>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    borderColor="gray.200"
                  />
                </Box>

                {error && (
                  <Box bg="red.50" border="1px solid" borderColor="red.100" borderRadius="md" p="3">
                    <Text fontSize="sm" color="red.700">{error}</Text>
                  </Box>
                )}

                <Button
                  type="submit"
                  colorPalette="green"
                  size="lg"
                  loading={isLoading}
                  loadingText="Signing in…"
                  w="full"
                  mt="2"
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            <Text fontSize="sm" color="gray.500" textAlign="center">
              Don't have an account?{' '}
              <NextLink
                href="/register"
                style={{ color: 'var(--chakra-colors-green-600)', fontWeight: '600' }}
              >
                Create one
              </NextLink>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}
