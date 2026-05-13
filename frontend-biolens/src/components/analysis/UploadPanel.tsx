'use client'
import { Box, Button, Image, Input, NativeSelectField, NativeSelectIndicator, NativeSelectRoot, Text, VStack } from '@chakra-ui/react'
import { FiImage } from 'react-icons/fi'
import type { ChangeEvent } from 'react'
import type { FieldEntity } from '@/types'

interface UploadPanelProps {
  previewUrl: string
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onAnalyze: () => void
  isAnalyzing: boolean
  fields: FieldEntity[]
  selectedFieldId: number | null
  onFieldChange: (id: number | null) => void
}

export const UploadPanel = ({ previewUrl, onFileChange, onAnalyze, isAnalyzing, fields, selectedFieldId, onFieldChange }: UploadPanelProps) => (
  <VStack align="stretch" gap="5" h="full">
    <Box
      flex="1"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      overflow="hidden"
      bg="white"
      display="flex"
      flexDirection="column"
    >
      <Box bg="green.700" px="4" py="3">
        <Text color="white" fontWeight="bold" fontSize="sm" letterSpacing="0.08em">
          UPLOAD PLANT IMAGE
        </Text>
      </Box>

      <VStack p="4" align="stretch" gap="4" flex="1">
        <Box
          flex="1"
          border="2px dashed"
          borderColor={previewUrl ? 'green.200' : 'gray.200'}
          borderRadius="md"
          bg={previewUrl ? 'white' : 'gray.50'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          position="relative"
          minH="160px"
        >
          {previewUrl ? (
            <>
              <Image
                src={previewUrl}
                alt="Selected plant"
                objectFit="contain"
                w="full"
                h="full"
                position="absolute"
                inset="0"
              />
              <Box
                position="absolute"
                inset="0"
                opacity={0}
                _hover={{ opacity: 1 }}
                bg="blackAlpha.600"
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="opacity 0.2s"
                borderRadius="md"
              >
                <Text color="white" fontWeight="semibold" fontSize="sm">Click to change</Text>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  position="absolute"
                  inset="0"
                  opacity={0}
                  cursor="pointer"
                  w="full"
                  h="full"
                  p="0"
                  border="none"
                />
              </Box>
            </>
          ) : (
            <VStack color="gray.500" gap="3" align="center" p="6">
              <FiImage size={26} />
              <Text fontSize="sm">Drag & drop or click to upload</Text>
              <Text fontSize="xs" color="gray.400">JPG, PNG - max 10MB</Text>
              <Input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                p="1"
                border="none"
                bg="transparent"
                maxW="220px"
                cursor="pointer"
              />
            </VStack>
          )}
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.600">Field</Text>
          <NativeSelectRoot>
            <NativeSelectField
              value={selectedFieldId ?? ''}
              onChange={(e) => onFieldChange(e.target.value ? Number(e.target.value) : null)}
              borderColor="gray.200"
              bg="white"
            >
              <option value=""></option>
              {fields.filter((f) => !f.plantedCrop).map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </NativeSelectField>
            <NativeSelectIndicator />
          </NativeSelectRoot>
        </Box>

        <Button
          colorPalette="green"
          onClick={onAnalyze}
          loading={isAnalyzing}
          disabled={!previewUrl || !selectedFieldId}
        >
          Analyze
        </Button>
      </VStack>
    </Box>

    <Box border="1px solid" borderColor="gray.200" borderRadius="xl" p="5" bg="white">
      <Text fontWeight="bold" color="gray.600" letterSpacing="0.08em" fontSize="xs">
        TIPS FOR BETTER RESULTS
      </Text>
      <VStack align="stretch" gap="2" mt="3" fontSize="sm" color="gray.700">
        <Text>Take photos in natural daylight for best accuracy</Text>
        <Text>Focus on the affected part of the plant</Text>
        <Text>Keep the plant filling most of the frame</Text>
        <Text>Avoid blurry or dark images for accurate diagnosis</Text>
      </VStack>
    </Box>
  </VStack>
)
