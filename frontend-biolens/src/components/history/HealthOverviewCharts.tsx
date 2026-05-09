'use client'

import { useState } from 'react'
import { Box, SimpleGrid, HStack, Text, Button, Flex, VStack } from '@chakra-ui/react'

type TimeFilter = 'Week' | 'Month' | 'Year'

interface HealthOverviewChartsProps {
    data: any[]
}

const SCAN_DATA: Record<TimeFilter, { label: string; healthy: number; diseased: number }[]> = {
    Week: [
        { label: 'Mon', healthy: 20, diseased: 10 },
        { label: 'Tue', healthy: 35, diseased: 15 },
        { label: 'Wed', healthy: 50, diseased: 20 },
        { label: 'Thu', healthy: 30, diseased: 25 },
        { label: 'Fri', healthy: 65, diseased: 18 },
        { label: 'Sat', healthy: 45, diseased: 12 },
        { label: 'Sun', healthy: 25, diseased: 8 },
    ],
    Month: [
        { label: 'W1', healthy: 40, diseased: 20 },
        { label: 'W2', healthy: 70, diseased: 25 },
        { label: 'W3', healthy: 85, diseased: 30 },
        { label: 'W4', healthy: 100, diseased: 40 },
    ],
    Year: [
        { label: 'Jan', healthy: 30, diseased: 15 },
        { label: 'Feb', healthy: 45, diseased: 20 },
        { label: 'Mar', healthy: 60, diseased: 25 },
        { label: 'Apr', healthy: 80, diseased: 30 },
        { label: 'May', healthy: 95, diseased: 35 },
        { label: 'Jun', healthy: 100, diseased: 40 },
        { label: 'Jul', healthy: 90, diseased: 38 },
        { label: 'Aug', healthy: 75, diseased: 30 },
        { label: 'Sep', healthy: 65, diseased: 25 },
        { label: 'Oct', healthy: 55, diseased: 20 },
        { label: 'Nov', healthy: 40, diseased: 15 },
        { label: 'Dec', healthy: 30, diseased: 10 },
    ],
}

export const HealthOverviewCharts = ({ data }: HealthOverviewChartsProps) => {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('Month')

    const total = data.length || 1
    const healthyPct = Math.round((data.filter(d => d.status === 'Healthy').length / total) * 100)
    const diseasedPct = Math.round((data.filter(d => d.status === 'Diseased').length / total) * 100)
    const moderatePct = 100 - healthyPct - diseasedPct

    const gradient = `conic-gradient(
    #2D6A4F 0% ${healthyPct}%,
    #F87171 ${healthyPct}% ${healthyPct + diseasedPct}%,
    #FBBF24 ${healthyPct + diseasedPct}% 100%
  )`

    const scanStats = SCAN_DATA[timeFilter]

    return (
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">

            <Box bg="white" p="6" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                <HStack justify="space-between" mb="6">
                    <Text fontWeight="bold">Scans over time</Text>
                    <HStack gap="2">
                        {(['Week', 'Month', 'Year'] as TimeFilter[]).map((f) => (
                            <Button
                                key={f}
                                size="xs"
                                variant={timeFilter === f ? 'surface' : 'ghost'}
                                colorPalette={timeFilter === f ? 'green' : 'gray'}
                                onClick={() => setTimeFilter(f)}
                            >
                                {f}
                            </Button>
                        ))}
                    </HStack>
                </HStack>
                <HStack align="flex-end" height="150px" gap="2" justify="space-between" px="2">
                    {scanStats.map((stat, index) => (
                        <BarPair
                            key={index}
                            h1={`${stat.healthy}%`}
                            h2={`${stat.diseased}%`}
                            label={stat.label}
                        />
                    ))}
                </HStack>
                <HStack mt="4" gap="4" fontSize="xs" color="gray.500">
                    <HStack gap="1"><Box w="3" h="3" bg="green.700" borderRadius="sm" /> <Text>Healthy</Text></HStack>
                    <HStack gap="1"><Box w="3" h="3" bg="red.300" borderRadius="sm" /> <Text>Diseased</Text></HStack>
                </HStack>
            </Box>

            {/* Health Distribution (Динамички Pie Chart) */}
            <Box bg="white" p="6" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                <Text fontWeight="bold" mb="6">Health distribution</Text>
                <Flex
                    align="center"
                    justify="center"
                    direction={{ base: 'column', sm: 'row' }}
                    gap={{ base: "6", sm: "10" }}
                >
                    <Box
                        w={{ base: '120px', sm: '160px' }}
                        h={{ base: '120px', sm: '160px' }}
                        flexShrink={0}
                        borderRadius="full"
                        bg={gradient}
                        boxShadow="inner"
                    />

                    <VStack align="flex-start" gap="4">
                        <LegendItem color="green.700" label="Healthy" value={`${healthyPct}%`} />
                        <LegendItem color="red.300" label="Diseased" value={`${diseasedPct}%`} />
                        <LegendItem color="yellow.400" label="Moderate" value={`${moderatePct}%`} />
                    </VStack>
                </Flex>
            </Box>

        </SimpleGrid>
    )
}

function BarPair({ h1, h2, label }: any) {
    return (
        <VStack flex="1" gap="2" h="full" justify="flex-end">
            <HStack align="flex-end" w="full" h="full" gap="1">
                <Box w="full" h={h1} bg="green.700" borderRadius="sm" />
                <Box w="full" h={h2} bg="red.200" borderRadius="sm" />
            </HStack>
            <Text fontSize="xs" color="gray.400">{label}</Text>
        </VStack>
    )
}

function LegendItem({ color, label, value }: any) {
    return (
        <HStack gap="4" w="full" minW="140px" justify="space-between">
            <HStack gap="3">
                <Box w="4" h="4" bg={color} borderRadius="md" /> {/* Малку поголеми квадратчиња */}
                <Text fontSize="sm" fontWeight="medium" color="gray.600">{label}</Text>
            </HStack>
            <Text fontSize="sm" fontWeight="bold" color="gray.900">{value}</Text>
        </HStack>
    )
}