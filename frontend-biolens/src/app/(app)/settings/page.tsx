'use client';

import React from 'react';
import {
    Box,
    Flex,
    Heading,
    Text,
    VStack,
    HStack,
    Input,
    Button,
    Avatar,
    Switch,
    Icon,
} from '@chakra-ui/react';
import { FiUser, FiBell, FiShield, FiMap } from 'react-icons/fi';

export default function SettingsPage() {
    const bgColor = 'white';
    const borderColor = '#E2E8F0';

    return (
        <Box maxW="full" mx="auto" py="2" px="8" color="gray.800">
            <Heading size="3xl" color="green.800" ml="auto" mb="6">
                Settings
            </Heading>

            <Flex direction={{ base: 'column', md: 'row' }} gap="8">
                {/* Left Navigation */}
                <VStack
                    w={{ base: 'full', md: '250px' }}
                    alignItems="stretch"
                    gap={1}
                >
                    <NavButton icon={FiUser} label="Profile" active />
                    <NavButton icon={FiMap} label="Farm Locations" />
                    <NavButton icon={FiBell} label="Notifications" />
                    <NavButton icon={FiShield} label="Security" />
                </VStack>

                {/* Right Content */}
                <Box
                    flex="1"
                    bg={bgColor}
                    p="8"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={borderColor}
                >
                    <VStack gap="6" alignItems="stretch">
                        {/* Profile Image */}
                        <HStack gap="6">
                            <Avatar.Root size="xl">
                                <Avatar.Fallback name="Mila" />
                            </Avatar.Root>

                            <VStack alignItems="start" gap="1">
                                <Button
                                    size="sm"
                                    colorPalette="green"
                                    variant="outline"
                                >
                                    Change Photo
                                </Button>

                                <Text fontSize="xs" color="gray.500">
                                    JPG or PNG. Max 5MB.
                                </Text>
                            </VStack>
                        </HStack>

                        {/* Personal Info */}
                        <Box>
                            <Text fontWeight="bold" mb="2">
                                First Name
                            </Text>

                            <Input
                                placeholder="Mila"
                                defaultValue="Mila"
                                _focusVisible={{
                                    borderColor: 'green.500',
                                    boxShadow: '0 0 0 1px var(--chakra-colors-green-500)',
                                }}
                            />
                        </Box>

                        <Box>
                            <Text fontWeight="bold" mb="2">
                                Email Address
                            </Text>

                            <Input
                                placeholder="email@example.com"
                                defaultValue="mila@biolens.com"
                                _focusVisible={{
                                    borderColor: 'green.500',
                                    boxShadow: '0 0 0 1px var(--chakra-colors-green-500)',
                                }}
                            />
                        </Box>

                        <Box>
                            <Text fontWeight="bold" mb="2">
                                Farm Name
                            </Text>

                            <Input
                                placeholder="BioLens Alpha Farm"
                                defaultValue="BioLens Alpha Farm"
                                _focusVisible={{
                                    borderColor: 'green.500',
                                    boxShadow: '0 0 0 1px var(--chakra-colors-green-500)',
                                }}
                            />
                        </Box>

                        {/* Notifications */}
                        <Box pt={4}>
                            <Heading size="sm" mb="4">
                                Notifications
                            </Heading>

                            <VStack alignItems="stretch" gap="4">
                                <Flex justify="space-between" align="center">
                                    <Box>
                                        <Text fontWeight="medium">
                                            Disease Alerts
                                        </Text>

                                        <Text fontSize="sm" color="gray.500">
                                            Get notified when AI detects crop issues.
                                        </Text>
                                    </Box>

                                    <Switch.Root defaultChecked>
                                        <Switch.HiddenInput />
                                        <Switch.Control />
                                    </Switch.Root>
                                </Flex>
                            </VStack>
                        </Box>

                        <HStack justify="end" pt="6">
                            <Button variant="ghost">Cancel</Button>

                            <Button
                                bg="#1A5336"
                                color="white"
                                _hover={{ bg: '#14422b' }}
                                px="8"
                            >
                                Save Changes
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </Flex>
        </Box>
    );
}

// Navigation Button Component
function NavButton({ icon, label, active }: any) {
    return (
        <HStack
            px="4"
            py="3"
            borderRadius="md"
            bg={active ? 'green.50' : 'transparent'}
            color={active ? 'green.700' : 'gray.600'}
            cursor="pointer"
            transition="0.2s"
            _hover={{ bg: 'gray.50' }}
        >
            <Icon as={icon} />
            <Text fontWeight={active ? '600' : '400'}>
                {label}
            </Text>
        </HStack>
    );
}