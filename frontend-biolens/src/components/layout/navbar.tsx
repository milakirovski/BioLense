'use client'

import { Box, Flex, Text, HStack, Link, Container } from '@chakra-ui/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

const LinkItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Analysis Lab', href: '/analysis' },
    { name: 'History & Reports', href: '/history' },
    { name: 'Settings', href: '/settings' },
]

export const Navbar = () => {
    const pathname = usePathname()

    return (
        <Box
            as="nav"
            bg="white"
            borderBottom="1px solid"
            borderColor="gray.100"
            py="7"
            boxShadow="sm"
        >
            <Container maxW="full" px="8">
                <Flex align="center" justify="space-between">

                    <HStack gap="4">
                        <Box bg="green.500" w="4" h="4" borderRadius="full" />
                        <Text fontSize="2xl" fontWeight="bold" color="green.800" letterSpacing="tight">
                            BioLens
                        </Text>
                        <Text fontSize="xs" color="gray.400" fontWeight="bold" letterSpacing="wider" ml="2">
                            FARM MANAGEMENT PLATFORM
                        </Text>
                    </HStack>

                    <HStack gap="14">
                        {LinkItems.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.name}
                                    asChild
                                    color={isActive ? "green.600" : "gray.500"}
                                    fontWeight={isActive ? "bold" : "semibold"}
                                    fontSize="lg"
                                    _hover={{ color: "green.500", textDecoration: "none" }}
                                    position="relative"
                                >
                                    <NextLink href={link.href}>
                                        {link.name}
                                        {isActive && (
                                            <Box
                                                position="absolute"
                                                bottom="-35px"
                                                left="0"
                                                w="100%"
                                                h="4px"
                                                bg="green.600"
                                                borderRadius="full"
                                            />
                                        )}
                                    </NextLink>
                                </Link>
                            )
                        })}
                    </HStack>

                    <NextLink href="/profile" passHref>
                        <Box
                            as="button"
                            bg="green.50"
                            color="green.700"
                            w="12"
                            h="12"
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontWeight="bold"
                            border="1px solid"
                            borderColor="green.100"
                            _hover={{ bg: "green.100", transform: "scale(1.05)" }}
                            transition="0.2s"
                        >
                            MS
                        </Box>
                    </NextLink>

                </Flex>
            </Container>
        </Box>
    )
}