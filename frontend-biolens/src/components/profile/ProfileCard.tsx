'use client'
import { Badge, Box, Button, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export const ProfileCard = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?'

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <Box
      flex="1"
      bg="white"
      p="8"
      borderRadius="2xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
      w="full"
    >
      <VStack gap="6" align="center">
        <Box
          bg="green.600"
          color="white"
          w="24"
          h="24"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="3xl"
          fontWeight="bold"
          boxShadow="lg"
        >
          {initials}
        </Box>

        <VStack gap="1">
          <Heading size="md">
            {user ? `${user.firstName} ${user.lastName}` : '—'}
          </Heading>
          <Badge colorPalette="green" variant="surface">FARM OWNER</Badge>
        </VStack>

        <Box w="full" h="1px" bg="gray.100" />

        <VStack align="stretch" w="full" gap="4">
          <HStack justify="space-between">
            <Text fontWeight="bold" color="gray.500" fontSize="sm">Email</Text>
            <Text fontSize="sm">{user?.email ?? '—'}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="bold" color="gray.500" fontSize="sm">Farm</Text>
            <Text fontSize="sm">{user?.farmName ?? '—'}</Text>
          </HStack>
        </VStack>

        <Box w="full" h="1px" bg="gray.100" />

        <Stack direction="row" w="full" gap="4" justify="flex-end">
          <Button
            colorPalette="green"
            variant="ghost"
            onClick={() => router.push('/settings')}
          >
            Edit Profile
          </Button>
          <Button colorPalette="red" variant="ghost" onClick={handleLogout}>
            Log Out
          </Button>
        </Stack>
      </VStack>
    </Box>
  )
}
