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
  Text,
  VStack,
} from '@chakra-ui/react'
import { useCrops } from '@/hooks/useCrops'
import type { FieldEntity } from '@/types'

interface AssignCropModalProps {
  open: boolean
  onClose: () => void
  field: FieldEntity | null
  onAssign: (cropId: number | null) => Promise<void>
}

export function AssignCropModal({ open, onClose, field, onAssign }: AssignCropModalProps) {
  const { crops } = useCrops()
  const [selectedCropId, setSelectedCropId] = useState<number | null>(field?.plantedCrop?.id ?? null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const hasExistingCrop = !!field?.plantedCrop?.id

  useEffect(() => {
    if (open) {
      setSelectedCropId(field?.plantedCrop?.id ?? null)
      setError('')
    }
  }, [open, field])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (hasExistingCrop && selectedCropId !== null) {
      setError('Remove the current crop assignment first.')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await onAssign(selectedCropId)
      onClose()
    } catch {
      setError('Failed to assign crop. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={(d) => { if (!d.open) onClose() }}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Crop — {field?.name}</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <DialogBody>
              <VStack gap="4" align="stretch">
                {hasExistingCrop && (
                  <Box bg="amber.50" border="1px solid" borderColor="amber.200" borderRadius="md" p="3">
                    <Text fontSize="sm" color="amber.800" fontWeight="medium">
                      This field already has a crop assigned. Remove it first to assign a new one.
                    </Text>
                  </Box>
                )}
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="3" color="gray.700">Select a crop</Text>
                  <VStack align="stretch" gap="2">
                    <Box
                      as="label"
                      display="flex"
                      alignItems="center"
                      gap="3"
                      p="3"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor={selectedCropId === null ? 'green.400' : 'gray.200'}
                      bg={selectedCropId === null ? 'green.50' : 'white'}
                      cursor="pointer"
                    >
                      <input
                        type="radio"
                        name="crop"
                        checked={selectedCropId === null}
                        onChange={() => setSelectedCropId(null)}
                      />
                      <Text fontSize="sm" color="gray.600">None (clear assignment)</Text>
                    </Box>
                    {crops.map((crop) => (
                      <Box
                        key={crop.id}
                        as="label"
                        display="flex"
                        alignItems="center"
                        gap="3"
                        p="3"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor={selectedCropId === crop.id ? 'green.400' : 'gray.200'}
                        bg={selectedCropId === crop.id ? 'green.50' : hasExistingCrop ? 'gray.50' : 'white'}
                        cursor={hasExistingCrop ? 'not-allowed' : 'pointer'}
                        opacity={hasExistingCrop ? 0.5 : 1}
                      >
                        <input
                          type="radio"
                          name="crop"
                          checked={selectedCropId === crop.id}
                          onChange={() => { if (!hasExistingCrop) setSelectedCropId(crop.id) }}
                          disabled={hasExistingCrop}
                        />
                        <VStack align="start" gap="0">
                          <Text fontSize="sm" fontWeight="medium">{crop.plantType}</Text>
                          <Text fontSize="xs" color="gray.500">
                            {crop.areaHectares} ha · {crop.status}
                          </Text>
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                </Box>
                {error && (
                  <Box bg="red.50" border="1px solid" borderColor="red.100" borderRadius="md" p="3">
                    <Text fontSize="sm" color="red.700">{error}</Text>
                  </Box>
                )}
              </VStack>
            </DialogBody>
            <DialogFooter gap="3">
              <Button variant="ghost" colorPalette="gray" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button colorPalette="green" type="submit" loading={isLoading} loadingText="Saving…">
                Assign
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
}