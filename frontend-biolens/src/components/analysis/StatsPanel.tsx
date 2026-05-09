'use client'
import { Badge, Box, Button, Flex, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { useMemo } from 'react'
import type { DiagnosisEntry } from '@/types/analysis'

interface StatsPanelProps {
  diagnoses: DiagnosisEntry[]
  loadingMeta: boolean
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

export const StatsPanel = ({ diagnoses, loadingMeta }: StatsPanelProps) => {
  const recentDiagnoses = useMemo(
    () =>
      [...diagnoses]
        .sort((a, b) => new Date(b.diagnosedAt).getTime() - new Date(a.diagnosedAt).getTime())
        .slice(0, 5),
    [diagnoses]
  )

  const diseaseCount = useMemo(
    () =>
      diagnoses.filter((item) => {
        const disease = item.diseaseName?.trim().toLowerCase()
        if (!disease) return false
        return disease !== 'no disease detected' && disease !== 'healthy'
      }).length,
    [diagnoses]
  )

  return (
    <VStack align="stretch" gap="4" h="full">
      <SimpleGrid columns={2} gap="3">
        <Box border="1px solid" borderColor="gray.200" borderRadius="lg" bg="white" p="4" textAlign="center">
          <Text fontWeight="bold" fontSize="2xl" color="green.700">
            {loadingMeta ? <Spinner size="sm" /> : diagnoses.length}
          </Text>
          <Text fontSize="xs" color="gray.500">Total scans</Text>
        </Box>
        <Box border="1px solid" borderColor="gray.200" borderRadius="lg" bg="white" p="4" textAlign="center">
          <Text fontWeight="bold" fontSize="2xl" color="green.700">
            {loadingMeta ? <Spinner size="sm" /> : diseaseCount}
          </Text>
          <Text fontSize="xs" color="gray.500">Diseases found</Text>
        </Box>
      </SimpleGrid>

      <Box flex="1" border="1px solid" borderColor="gray.200" borderRadius="xl" bg="white" p="4" display="flex" flexDirection="column">
        <Text fontWeight="bold" mb="3">Recent analyses</Text>
        <VStack align="stretch" gap="2">
          {recentDiagnoses.map((item) => (
            <Flex
              key={`${item.id}-${item.diagnosedAt}`}
              justify="space-between"
              align="center"
              border="1px solid"
              borderColor="gray.100"
              borderRadius="md"
              p="2"
            >
              <Box>
                <Text fontSize="sm" fontWeight="semibold">
                  {item.plantName} - Field {item.cropId}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {item.diseaseName ?? 'No disease'} · {formatWhen(item.diagnosedAt)}
                </Text>
              </Box>
              <Badge colorPalette={item.isHealthy ? 'green' : 'red'}>
                {item.isHealthy ? 'Healthy' : 'Diseased'}
              </Badge>
            </Flex>
          ))}
          {!loadingMeta && recentDiagnoses.length === 0 ? (
            <Text fontSize="sm" color="gray.500">No analyses yet.</Text>
          ) : null}
        </VStack>
        <Button asChild mt="4" variant="ghost" colorPalette="green" w="full">
          <Link href="/history">View all past analyses</Link>
        </Button>
      </Box>
    </VStack>
  )
}
