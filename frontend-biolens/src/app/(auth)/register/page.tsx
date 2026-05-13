'use client'
import { useState } from 'react'
import { Box, Button, Container, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    farmName: '',
    email: '',
    password: '',
    repeatPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (form.password !== form.repeatPassword) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await register(form)
      router.push('/login')
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" py="10">
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
              <Text color="gray.500">Create your farm account</Text>
            </VStack>

            <form onSubmit={onSubmit}>
              <VStack gap="4" align="stretch">
                <HStack gap="4">
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">First Name</Text>
                    <Input
                      value={form.firstName}
                      onChange={set('firstName')}
                      placeholder="Jane"
                      required
                      borderColor="gray.200"
                    />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">Last Name</Text>
                    <Input
                      value={form.lastName}
                      onChange={set('lastName')}
                      placeholder="Doe"
                      required
                      borderColor="gray.200"
                    />
                  </Box>
                </HStack>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">Farm Name</Text>
                  <Input
                    value={form.farmName}
                    onChange={set('farmName')}
                    placeholder="Green Valley Farm"
                    required
                    borderColor="gray.200"
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">Email</Text>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="you@example.com"
                    required
                    borderColor="gray.200"
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">Password</Text>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={set('password')}
                    placeholder="••••••••"
                    required
                    borderColor="gray.200"
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">Confirm Password</Text>
                  <Input
                    type="password"
                    value={form.repeatPassword}
                    onChange={set('repeatPassword')}
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
                  loadingText="Creating account…"
                  w="full"
                  mt="2"
                >
                  Create Account
                </Button>
              </VStack>
            </form>

            <Text fontSize="sm" color="gray.500" textAlign="center">
              Already have an account?{' '}
              <NextLink
                href="/login"
                style={{ color: 'var(--chakra-colors-green-600)', fontWeight: '600' }}
              >
                Sign in
              </NextLink>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}
