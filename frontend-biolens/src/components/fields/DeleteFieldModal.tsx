'use client'
import { useState } from 'react'
import {
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
} from '@chakra-ui/react'
import type { FieldEntity } from '@/types'

interface DeleteFieldModalProps {
  open: boolean
  onClose: () => void
  field: FieldEntity | null
  onConfirm: () => Promise<void>
}

export function DeleteFieldModal({ open, onClose, field, onConfirm }: DeleteFieldModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      onClose()
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
            <DialogTitle>Delete Field</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody>
            <Text color="gray.600">
              Are you sure you want to delete <strong>{field?.name}</strong>? This action cannot be undone.
            </Text>
          </DialogBody>
          <DialogFooter gap="3">
            <Button variant="ghost" colorPalette="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button colorPalette="red" onClick={handleDelete} loading={isLoading} loadingText="Deleting…">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
}