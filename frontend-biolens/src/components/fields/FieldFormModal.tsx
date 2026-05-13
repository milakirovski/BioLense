'use client'
import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  Input,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import type { FieldEntity, CreateFieldPayload, UpdateFieldPayload } from '@/types'

interface FieldFormModalProps {
  open: boolean
  onClose: () => void
  field?: FieldEntity | null
  onSave: (payload: CreateFieldPayload | UpdateFieldPayload) => Promise<void>
}

export function FieldFormModal({ open, onClose, field, onSave }: FieldFormModalProps) {
  const [name, setName] = useState(field?.name ?? '')
  const [description, setDescription] = useState(field?.description ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const isEdit = !!field

  useEffect(() => {
    if (open) {
      setName(field?.name ?? '')
      setDescription(field?.description ?? '')
      setError('')
    }
  }, [open, field])

  const resetAndClose = () => {
    setName(field?.name ?? '')
    setDescription(field?.description ?? '')
    setError('')
    onClose()
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await onSave({ name, description })
      onClose()
    } catch {
      setError('Failed to save field. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={(d) => { if (!d.open) resetAndClose() }}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Field' : 'New Field'}</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <DialogBody>
              <VStack gap="4" align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">Field Name</Text>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. North Field"
                    borderColor="gray.200"
                    required
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">Description</Text>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Location, soil type, notes…"
                    borderColor="gray.200"
                    rows={3}
                  />
                </Box>
                {error && (
                  <Box bg="red.50" border="1px solid" borderColor="red.100" borderRadius="md" p="3">
                    <Text fontSize="sm" color="red.700">{error}</Text>
                  </Box>
                )}
              </VStack>
            </DialogBody>
            <DialogFooter gap="3">
              <Button variant="ghost" colorPalette="gray" type="button" onClick={resetAndClose}>
                Cancel
              </Button>
              <Button colorPalette="green" type="submit" loading={isLoading} loadingText="Saving…">
                {isEdit ? 'Save Changes' : 'Create Field'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
}
