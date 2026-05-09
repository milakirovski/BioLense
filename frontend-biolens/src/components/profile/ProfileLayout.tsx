'use client'
import { Container, Flex, Heading, VStack } from '@chakra-ui/react'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { AccountSettings } from '@/components/profile/AccountSettings'

export function ProfileLayout() {
  return (
    <Container maxW="full" py="2" px="8">
      <VStack align="stretch" gap="6">
        <Heading size="3xl" color="green.800" mb="2">User Profile</Heading>
        <Flex gap="8" direction={{ base: 'column', lg: 'row' }} align="stretch">
          <ProfileCard />
          <AccountSettings />
        </Flex>
      </VStack>
    </Container>
  )
}
