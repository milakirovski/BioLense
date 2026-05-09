'use client'

import { useEffect, useState } from 'react'
import { Box, Container, Flex, HStack, Icon, Link, Text, Button, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FiMenu, FiX } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'

const LinkItems = [
  { name: 'Dashboard',        href: '/dashboard' },
  { name: 'Analysis Lab',     href: '/analysis'  },
  { name: 'History & Reports',href: '/history'   },
  { name: 'Settings',         href: '/settings'  },
]

export const Navbar = () => {
  const pathname = usePathname()
  const { user } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false) }, [pathname])

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?'

  return (
    <Box as="nav" bg="white" position="relative" zIndex="banner">
      <Container maxW="full" px="8">
        <Flex align="center" justify="space-between" py="7">

          {/* LEFT — logo */}
          <HStack gap="4" align="baseline" paddingLeft={2}>
            <Text fontSize="2xl" fontWeight="bold" color="green.800">
              BioLens
            </Text>
            <Text
              display={{ base: 'none', lg: 'block' }}
              fontSize="sm"
              color="gray.400"
              fontWeight="semibold"
              letterSpacing="wider"
            >
              Farm Management Platform
            </Text>
          </HStack>

          {/* CENTER — desktop links */}
          <HStack gap="14" display={{ base: 'none', lg: 'flex' }}>
            {LinkItems.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  asChild
                  color={isActive ? 'green.600' : 'gray.500'}
                  fontWeight={isActive ? 'bold' : 'semibold'}
                  fontSize="lg"
                  _hover={{ color: 'green.500', textDecoration: 'none' }}
                  outline="none"
                >
                  <NextLink href={link.href}>{link.name}</NextLink>
                </Link>
              )
            })}
          </HStack>

          {/* RIGHT — avatar + hamburger */}
          <HStack gap="2">
            <Button
              bg="green.50"
              color="green.700"
              w="12"
              h="12"
              fontWeight="bold"
              _hover={{ bg: 'green.100', transform: 'scale(1.05)' }}
              transition="0.2s"
              borderRadius="full"
              onClick={() => router.push('/profile')}
            >
              {initials}
            </Button>

            {/* Hamburger — only visible below lg */}
            <Button
              display={{ base: 'flex', lg: 'none' }}
              variant="ghost"
              color="gray.600"
              w="10"
              h="10"
              borderRadius="md"
              p="0"
              _hover={{ bg: 'gray.100' }}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsOpen((o) => !o)}
            >
              <Icon as={isOpen ? FiX : FiMenu} boxSize="5" />
            </Button>
          </HStack>

        </Flex>
      </Container>

      {/* Mobile dropdown */}
      {isOpen && (
        <Box
          display={{ base: 'block', lg: 'none' }}
          bg="white"
          borderTop="1px solid"
          borderColor="gray.100"
          boxShadow="md"
          px="8"
          pt={{ base: '4', md: '8' }}
          pb="4"
        >
          <VStack align="stretch" gap="0">
            {LinkItems.map((link) => {
              const isActive = pathname === link.href
              return (
                <Box
                  key={link.name}
                  py="3"
                  borderBottom="1px solid"
                  borderColor="gray.50"
                  textAlign="center"
                >
                  <Link
                    asChild
                    display="block"
                    color={isActive ? 'green.600' : 'gray.600'}
                    fontWeight={isActive ? 'bold' : 'medium'}
                    fontSize="md"
                    textDecoration="none"
                    _hover={{ color: 'green.500', textDecoration: 'none' }}
                    outline="none"
                  >
                    <NextLink href={link.href}>{link.name}</NextLink>
                  </Link>
                </Box>
              )
            })}
          </VStack>
        </Box>
      )}
    </Box>
  )
}
