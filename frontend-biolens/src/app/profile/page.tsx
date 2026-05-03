'use client'

import {
    Box,
    Container,
    Heading,
    VStack,
    HStack,
    Text,
    Button,
    Flex,
    Stack
} from '@chakra-ui/react'

export default function ProfilePage() {
    return (
        <Container maxW="full" py="8" px="8">
            <VStack align="stretch" gap="6">

                <Heading size="lg" color="green.800" mb="2">User Profile</Heading>

                <Flex gap="8" direction={{ base: "column", lg: "row" }} align="flex-start">

                    {/* ЛЕВА СТРАНА: Основна Картичка */}
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
                                MS
                            </Box>

                            <VStack gap="1">
                                <Heading size="md">Mila Savatikj</Heading>
                                <Badge colorPalette="green" variant="surface">FARM OWNER</Badge>
                            </VStack>

                            <Box w="full" h="1px" bg="gray.100" />

                            <VStack align="stretch" w="full" gap="4">
                                <HStack justify="space-between">
                                    <Text fontWeight="bold" color="gray.500" fontSize="sm">Email</Text>
                                    <Text fontSize="sm">mila@biolens.com</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text fontWeight="bold" color="gray.500" fontSize="sm">Location</Text>
                                    <Text fontSize="sm">Skopje, North Macedonia</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text fontWeight="bold" color="gray.500" fontSize="sm">Member Since</Text>
                                    <Text fontSize="sm">March 2024</Text>
                                </HStack>
                            </VStack>

                            <Box w="full" h="1px" bg="gray.100" />

                            <Stack direction="row" w="full" gap="4">
                                <Button colorPalette="green" variant="outline" flex="1">
                                    Edit Profile
                                </Button>
                                <Button colorPalette="red" variant="ghost">
                                    Log Out
                                </Button>
                            </Stack>
                        </VStack>
                    </Box>

                    {/* ДЕСНА СТРАНА*/}
                    <Box
                        flex="2"
                        bg="white"
                        p="8"
                        borderRadius="2xl"
                        boxShadow="sm"
                        border="1px solid"
                        borderColor="gray.100"
                        w="full"
                    >
                        <Heading size="md" mb="6">Account Settings</Heading>
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
                                <Text fontSize="sm" color="gray.500">You currently have 4 active fields linked to this account.</Text>
                            </Box>
                        </VStack>
                    </Box>

                </Flex>
            </VStack>
        </Container>
    )
}

import { Badge } from '@chakra-ui/react'