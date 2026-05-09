'use client'
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import { getFieldHealthColor } from '@/utils/dashboard'
import type { Crop, Diagnosis } from '@/types'

interface CropHealthScoreProps {
  crops: Crop[]
  diagnoses: Diagnosis[]
}

function computeHealthScore(crop: Crop, diagnoses: Diagnosis[]): number {
  const latest = diagnoses
    .filter((d) => d.cropId === crop.id)
    .sort((a, b) => new Date(b.diagnosedAt).getTime() - new Date(a.diagnosedAt).getTime())[0]

  if (!latest) return 100
  const conf = latest.confidence ?? 80
  return latest.isHealthy ? Math.round(conf) : Math.round(100 - conf)
}

export const CropHealthScore = ({ crops, diagnoses }: CropHealthScoreProps) => {
  const fields = crops.map((c) => ({
    name: c.fieldName,
    score: computeHealthScore(c, diagnoses),
  }))

  if (fields.length === 0) return null

  const overallHealth = Math.round(fields.reduce((sum, f) => sum + f.score, 0) / fields.length)
  const healthyFields = fields.filter((f) => f.score >= 80).length

  return (
    <Box
      bg="white"
      p="6"
      borderRadius="xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
    >
      <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="0.08em" mb="5">
        CROP HEALTH SCORE
      </Text>
      <VStack gap="4">
        <Box position="relative" w="120px" h="120px" mx="auto">
          <Box
            w="full"
            h="full"
            borderRadius="full"
            style={{
              background: `conic-gradient(#276749 0% ${overallHealth}%, #e2e8f0 ${overallHealth}% 100%)`,
            }}
          />
          <Flex
            position="absolute"
            top="16px"
            left="16px"
            right="16px"
            bottom="16px"
            bg="white"
            borderRadius="full"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontWeight="bold" fontSize="xl" color="green.800">{overallHealth}%</Text>
          </Flex>
        </Box>

        <VStack gap="0.5" textAlign="center">
          <Text fontWeight="bold" fontSize="sm">Farm Health</Text>
          <Text fontSize="xs" color="gray.500">
            {healthyFields} of {fields.length} fields in good condition
          </Text>
        </VStack>

        <VStack gap="2.5" align="stretch" w="full">
          {fields.map((f) => {
            const color = getFieldHealthColor(f.score)
            return (
              <HStack key={f.name} gap="2">
                <Box w="2" h="2" borderRadius="full" bg={`${color}.400`} flexShrink={0} />
                <Text fontSize="xs" color="gray.600" flexShrink={0} w="24">{f.name}</Text>
                <Box flex="1" minW="8" h="1.5" bg="gray.100" borderRadius="full" overflow="hidden">
                  <Box w={`${f.score}%`} h="full" bg={`${color}.500`} borderRadius="full" />
                </Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.600" w="8" textAlign="right" flexShrink={0}>
                  {f.score}%
                </Text>
              </HStack>
            )
          })}
        </VStack>
      </VStack>
    </Box>
  )
}
