'use client'
import { Badge, Box, Button, HStack, Image, Text, VStack } from '@chakra-ui/react'
import { FiImage } from 'react-icons/fi'
import type { AnalysisResult } from '@/types/analysis'

interface ResultPanelProps {
  analysis: AnalysisResult | null
  previewUrl: string
  onSaveToHistory?: () => void
  isSaving?: boolean
}

function formatWhen(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <HStack justify="space-between" borderBottom="1px solid" borderColor="gray.100" pb="2">
      <Text color="gray.500">{label}</Text>
      <Text fontWeight="semibold">{value}</Text>
    </HStack>
  )
}

export const ResultPanel = ({ analysis, previewUrl, onSaveToHistory, isSaving }: ResultPanelProps) => (
  <Box border="1px solid" borderColor="gray.200" borderRadius="xl" bg="white" overflow="hidden" h="full" display="flex" flexDirection="column">
    <Box bg="green.700" px="4" py="3">
      <HStack justify="space-between">
        <Text color="white" fontWeight="bold">
          {analysis?.plantName ?? 'Waiting for analysis'}
          {' — '}
          {analysis?.diseaseName ?? 'No result yet'}
        </Text>
        <Badge colorPalette="whiteAlpha" borderRadius="full">
          {analysis?.confidence ? `${Math.round(analysis.confidence * 100)}% confidence` : '—'}
        </Badge>
      </HStack>
    </Box>

    <VStack align="stretch" gap="4" p="4" flex="1">
      <Box borderRadius="md" border="1px solid" borderColor="gray.100" bg="green.50" p="4">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Uploaded crop"
            objectFit="contain"
            w="full"
            h="220px"
            borderRadius="md"
          />
        ) : (
          <VStack h="220px" justify="center" color="gray.500">
            <FiImage size={26} />
            <Text fontSize="sm">Uploaded image will appear here</Text>
          </VStack>
        )}
      </Box>

      <VStack align="stretch" gap="2" fontSize="sm">
        <DataRow label="Plant" value={analysis?.plantName ?? '—'} />
        <DataRow label="Disease" value={`${analysis?.diseaseName ?? '—'} (${analysis?.stage ?? '—'})`} />
        <DataRow label="Severity" value={analysis?.severity ?? '—'} />
        <DataRow label="Field" value={analysis?.fieldLabel ?? '—'} />
        <DataRow label="Scanned" value={formatWhen(analysis?.scannedAt)} />
      </VStack>

      <Box borderRadius="md" border="1px solid" borderColor="orange.100" bg="orange.50" p="3">
        <Text fontWeight="bold" fontSize="sm" color="orange.700" mb="1">
          RECOMMENDED TREATMENT
        </Text>
        <VStack align="stretch" gap="1">
          {(analysis?.treatmentTips.length
            ? analysis.treatmentTips
            : ['Apply copper-based fungicide every 7 days', 'Improve air circulation in plant rows']
          ).map((tip) => (
            <Text key={tip} fontSize="sm" color="orange.800">
              - {tip}
            </Text>
          ))}
        </VStack>
      </Box>

      <Button
        colorPalette="green"
        variant="solid"
        disabled={!analysis}
        loading={isSaving}
        loadingText="Saving…"
        onClick={onSaveToHistory}
      >
        Save to history
      </Button>
    </VStack>
  </Box>
)
