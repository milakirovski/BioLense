'use client'
import { Box, Text, VStack, HStack, Icon } from '@chakra-ui/react'
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi'

interface StatCardProps {
    label: string
    value: string | number
    helpText: string
    trend?: 'up' | 'down'
    valueColor?: string
}

export const StatCard = ({ label, value, helpText, trend, valueColor = "green.700" }: StatCardProps) => {
    return (
        <Box bg="white" p="6" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100" flex="1">
            <VStack align="flex-start" gap="1">
                <Text fontSize="4xl" fontWeight="bold" color={valueColor}>{value}</Text>
                <Text fontSize="sm" color="gray.500" fontWeight="medium">{label}</Text>

                <HStack gap="1" mt="2">
                    {trend && (
                        <Icon
                            as={trend === 'up' ? FiArrowUpRight : FiArrowDownRight}
                            color={trend === 'up' ? 'green.500' : 'red.500'}
                        />
                    )}
                    <Text fontSize="xs" fontWeight="bold" color={trend === 'up' ? 'green.600' : trend === 'down' ? 'red.600' : 'gray.400'}>
                        {helpText}
                    </Text>
                </HStack>
            </VStack>
        </Box>
    )
}