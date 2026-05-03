'use client'

import { Box, Heading, VStack, Stack, Text, HStack } from '@chakra-ui/react'

interface DiseaseStatsCardProps {
    data: any[]
}

export const DiseaseStatsCard = ({ data }: DiseaseStatsCardProps) => {
    const allDiseases = data
        .map(item => item.disease)
        .filter(d => d !== "—")

    const diseaseCounts = allDiseases.reduce((acc: Record<string, number>, disease) => {
        acc[disease] = (acc[disease] || 0) + 1
        return acc
    }, {})

    const topDiseases = Object.entries(diseaseCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4)

    const maxCount = Math.max(...topDiseases.map(d => d.count), 1)

    return (
        <Box bg="white" p="6" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
            <Heading size="md" mb="4">Top diseases</Heading>
            <Stack gap="4">
                {topDiseases.length > 0 ? (
                    topDiseases.map((disease, index) => (
                        <HStack key={index} justify="space-between">
                            <Text fontSize="sm" fontWeight="medium" w="120px" truncate>{disease.name}</Text>
                            <Box h="4px" bg="gray.100" borderRadius="full" flex="1" overflow="hidden" mx="2">
                                <Box w={`${(disease.count / maxCount) * 100}%`} h="full" bg="green.600" />
                            </Box>
                            <Text fontSize="sm" fontWeight="bold" w="20px" textAlign="right">{disease.count}</Text>
                        </HStack>
                    ))
                ) : (
                    <Text fontSize="sm" color="gray.500">No diseases detected yet.</Text>
                )}
            </Stack>
        </Box>
    )
}