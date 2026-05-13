'use client'
import { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { FiLayers, FiPlus } from 'react-icons/fi'
import { useFields } from '@/hooks/useFields'
import { FieldCard } from '@/components/fields/FieldCard'
import { FieldFormModal } from '@/components/fields/FieldFormModal'
import { DeleteFieldModal } from '@/components/fields/DeleteFieldModal'
import { AssignCropModal } from '@/components/fields/AssignCropModal'
import type { FieldEntity, CreateFieldPayload } from '@/types'

export function FieldsLayout() {
  const { fields, isLoading, error, createField, updateField, deleteField } = useFields()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<FieldEntity | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<FieldEntity | null>(null)
  const [assignTarget, setAssignTarget] = useState<FieldEntity | null>(null)

  const totalWithCrop = fields.filter((f) => f.plantedCrop).length

  return (
    <Box px={{ base: 4, md: 6, lg: 10 }} pb={10}>
      <Box pt={6} mb={6}>
        <Flex justify="space-between" align="flex-start" gap="4" wrap="wrap">
          <Box>
            <Heading size="2xl" color="green.800" fontWeight="bold">Fields</Heading>
            <Text color="gray.500" fontSize="sm" mt="1">
              Manage your farm fields and crop assignments
            </Text>
          </Box>
          <Button colorPalette="green" onClick={() => setCreateOpen(true)} gap="2">
            <Icon as={FiPlus} boxSize="4" />
            New Field
          </Button>
        </Flex>
      </Box>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap="4" mb="6">
        <Box bg="white" borderRadius="xl" p="4" boxShadow="sm" border="1px solid" borderColor="gray.100">
          <Text fontSize="sm" color="gray.500" fontWeight="medium">Total Fields</Text>
          <Text fontSize="2xl" fontWeight="bold" color="green.700" mt="1">{fields.length}</Text>
        </Box>
        <Box bg="white" borderRadius="xl" p="4" boxShadow="sm" border="1px solid" borderColor="gray.100">
          <Text fontSize="sm" color="gray.500" fontWeight="medium">With Crop</Text>
          <Text fontSize="2xl" fontWeight="bold" color="green.700" mt="1">{totalWithCrop}</Text>
        </Box>
        <Box bg="white" borderRadius="xl" p="4" boxShadow="sm" border="1px solid" borderColor="gray.100">
          <Text fontSize="sm" color="gray.500" fontWeight="medium">Unassigned</Text>
          <Text fontSize="2xl" fontWeight="bold" color="gray.500" mt="1">{fields.length - totalWithCrop}</Text>
        </Box>
      </SimpleGrid>

      {isLoading && (
        <Flex justify="center" py="16">
          <Spinner color="green.500" size="lg" />
        </Flex>
      )}

      {!isLoading && error && (
        <Box bg="red.50" border="1px solid" borderColor="red.100" borderRadius="xl" p="6" textAlign="center">
          <Text color="red.700" fontWeight="medium">{error}</Text>
          <Text fontSize="sm" color="red.500" mt="1">Check your connection or try again later.</Text>
        </Box>
      )}

      {!isLoading && !error && fields.length === 0 && (
        <Box
          bg="white"
          border="2px dashed"
          borderColor="gray.200"
          borderRadius="2xl"
          p="12"
          textAlign="center"
        >
          <Icon as={FiLayers} boxSize="10" color="gray.300" mb="4" />
          <Text fontWeight="medium" color="gray.500" mb="1">No fields yet</Text>
          <Text fontSize="sm" color="gray.400" mb="4">
            Create your first field to start managing your farm.
          </Text>
          <Button colorPalette="green" onClick={() => setCreateOpen(true)}>
            Create Field
          </Button>
        </Box>
      )}

      {!isLoading && !error && fields.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6">
          {fields.map((field) => (
            <FieldCard
              key={field.id}
              field={field}
              onEdit={() => setEditTarget(field)}
              onDelete={() => setDeleteTarget(field)}
              onAssignCrop={() => setAssignTarget(field)}
            />
          ))}
        </SimpleGrid>
      )}

      <FieldFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={async (payload) => { await createField(payload as CreateFieldPayload) }}
      />

      <FieldFormModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        field={editTarget}
        onSave={async (payload) => { if (editTarget) await updateField(editTarget.id, payload) }}
      />

      <DeleteFieldModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        field={deleteTarget}
        onConfirm={() => deleteTarget ? deleteField(deleteTarget.id) : Promise.resolve()}
      />

      <AssignCropModal
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        field={assignTarget}
        onAssign={async (cropId) => {
          if (assignTarget) await updateField(assignTarget.id, {
            name: assignTarget.name,
            description: assignTarget.description,
            plantedCrop: cropId !== null ? { id: cropId } : null,
          })
        }}
      />
    </Box>
  )
}