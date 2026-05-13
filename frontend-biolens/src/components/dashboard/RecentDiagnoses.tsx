'use client'
import { Box, Text, VStack } from '@chakra-ui/react'
import { DiagnosisCard } from '@/components/shared/DiagnosisCard'
import type { Diagnosis } from '@/types/diagnosis'

interface RecentDiagnosesProps {
  diagnoses: Diagnosis[]
}

export const RecentDiagnoses = ({ diagnoses }: RecentDiagnosesProps) => (
  <Box>
    <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="0.08em" mb="3">
      RECENT DIAGNOSES
    </Text>
    {diagnoses.length === 0 ? (
      <Box
        border="1px solid"
        borderColor="gray.100"
        borderRadius="xl"
        bg="white"
        p="6"
        textAlign="center"
      >
        <Text fontSize="sm" color="gray.400">No diagnoses yet. Upload a plant image to get started.</Text>
      </Box>
    ) : (
      <VStack gap="3" align="stretch">
        {diagnoses.map((d) => (
          <DiagnosisCard key={d.id} diagnosis={d} />
        ))}
      </VStack>
    )}
  </Box>
)
