'use client'
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { AccountSettings } from '@/components/profile/AccountSettings'

export function ProfileLayout() {
  return (
    <Box px={{ base: 4, md: 6, lg: 10 }} pb={10}>
      <Box pt={6} mb={6}>
        <Heading size="2xl" color="green.800" fontWeight="bold">User Profile</Heading>
        <Text color="gray.500" fontSize="sm" mt="1">Manage your account and preferences</Text>
      </Box>
      <VStack align="stretch" gap="6">
        <Flex gap="8" direction={{ base: 'column', lg: 'row' }} align="stretch">
          <ProfileCard />
          <AccountSettings />
        </Flex>
      </VStack>
    </Box>
  )
}