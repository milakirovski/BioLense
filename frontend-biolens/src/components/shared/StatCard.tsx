'use client'
import { Box, Flex, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi'
import type { ElementType } from 'react'

type StatVariantProps = {
  variant?: 'stat'
  label: string
  value: string | number
  helpText: string
  trend?: 'up' | 'down'
  valueColor?: string
}

type ActionVariantProps = {
  variant: 'action'
  icon: ElementType
  title: string
  description: string
  onClick?: () => void
}

export type StatCardProps = StatVariantProps | ActionVariantProps

export const StatCard = (props: StatCardProps) => {
  if (props.variant === 'action') {
    const { icon, title, description, onClick } = props
    return (
      <Box
        bg="white"
        p="5"
        borderRadius="xl"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.100"
        cursor="pointer"
        onClick={onClick}
        _hover={{ boxShadow: 'md', borderColor: 'green.200' }}
        transition="all 0.2s"
      >
        <VStack align="flex-start" gap="3">
          <Flex p="2" bg="gray.50" borderRadius="lg" alignItems="center" justifyContent="center">
            <Icon as={icon} boxSize="5" color="gray.600" />
          </Flex>
          <VStack align="flex-start" gap="0.5">
            <Text fontWeight="bold" fontSize="sm">{title}</Text>
            <Text fontSize="xs" color="gray.500">{description}</Text>
          </VStack>
        </VStack>
      </Box>
    )
  }

  const { label, value, helpText, trend, valueColor = 'green.700' } = props as StatVariantProps
  return (
    <Box
      bg="white"
      p="6"
      borderRadius="xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
    >
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
          <Text
            fontSize="xs"
            fontWeight="bold"
            color={trend === 'up' ? 'green.600' : trend === 'down' ? 'red.600' : 'gray.400'}
          >
            {helpText}
          </Text>
        </HStack>
      </VStack>
    </Box>
  )
}
