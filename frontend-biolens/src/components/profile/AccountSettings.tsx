'use client'
import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { useFields } from '@/hooks/useFields'

export const AccountSettings = () => {
  const { fields } = useFields()

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
      <Heading size="md" mb="2">Account Settings</Heading>
      <Text fontSize="sm" color="gray.400" mb="6" fontStyle="italic">To be implemented</Text>
      <VStack align="stretch" gap="6">
        <Box>
          <Text fontWeight="bold" mb="1">Notifications</Text>
          <Text fontSize="sm" color="gray.500">Manage how you receive alerts about plant diseases.</Text>
        </Box>
        <Box w="full" h="1px" bg="gray.50" />
        <Box>
          <Text fontWeight="bold" mb="1">Security</Text>
          <Text fontSize="sm" color="gray.500">Change your password and manage two-factor authentication.</Text>
        </Box>
        <Box w="full" h="1px" bg="gray.50" />
        <Box>
          <Text fontWeight="bold" mb="1">Connected Fields</Text>
          <Text fontSize="sm" color="gray.500">
            You currently have {fields.length} active {fields.length === 1 ? 'field' : 'fields'} linked to this account.
          </Text>
        </Box>
      </VStack>
    </Box>
  )
}
