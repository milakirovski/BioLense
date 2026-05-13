'use client'
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiEdit2, FiLayers, FiPlus, FiTrash2 } from 'react-icons/fi'
import type { FieldEntity } from '@/types'

interface FieldCardProps {
  field: FieldEntity
  onEdit: () => void
  onDelete: () => void
  onAssignCrop: () => void
}

export function FieldCard({ field, onEdit, onDelete, onAssignCrop }: FieldCardProps) {
  return (
    <Box
      bg="white"
      borderRadius="2xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
      p="6"
      _hover={{ boxShadow: 'md', borderColor: 'green.100' }}
      transition="all 0.15s"
    >
      <VStack align="stretch" gap="4" h="full">
        <HStack justify="space-between" align="start">
          <VStack align="start" gap="1" flex="1" minW="0">
            <Heading size="md" color="gray.800">{field.name}</Heading>
            {field.description && (
              <Text fontSize="sm" color="gray.500" lineClamp={2}>{field.description}</Text>
            )}
          </VStack>
          <Box bg="green.50" color="green.700" p="2" borderRadius="lg" flexShrink={0}>
            <Icon as={FiLayers} boxSize="4" />
          </Box>
        </HStack>

        {field.plantedCrop ? (
          <HStack bg="green.50" borderRadius="lg" px="3" py="2" gap="2">
            <Box w="2" h="2" borderRadius="full" bg="green.500" flexShrink={0} />
            <Text fontSize="sm" color="green.700" fontWeight="medium">
              {field.plantedCrop.plantType}
            </Text>
            <Text fontSize="xs" color="green.500">· {field.plantedCrop.areaHectares} ha</Text>
          </HStack>
        ) : (
          <HStack bg="gray.50" borderRadius="lg" px="3" py="2" gap="2">
            <Box w="2" h="2" borderRadius="full" bg="gray.300" flexShrink={0} />
            <Text fontSize="sm" color="gray.400">No crop assigned</Text>
          </HStack>
        )}

        <Box flex="1" />

        <Stack
          direction="row"
          gap="2"
          justify="flex-end"
          pt="2"
          borderTop="1px solid"
          borderColor="gray.50"
        >
          <Button size="sm" variant="ghost" colorPalette="green" onClick={onAssignCrop} gap="1" display="flex" alignItems="center">
            <Icon as={FiPlus} boxSize="3.5" />
            <span>Crop</span>
          </Button>
          <Button size="sm" variant="ghost" colorPalette="blue" onClick={onEdit}>
            <Icon as={FiEdit2} boxSize="3.5" />
          </Button>
          <Button size="sm" variant="ghost" colorPalette="red" onClick={onDelete}>
            <Icon as={FiTrash2} boxSize="3.5" />
          </Button>
        </Stack>
      </VStack>
    </Box>
  )
}