'use client'

import { useMemo, useState } from 'react'
import { Box, SimpleGrid, HStack, Text, Button, Flex, VStack } from '@chakra-ui/react'
import type { HistoryItem } from '@/components/history/HistoryTable'

type TimeFilter = 'Week' | 'Month' | 'Year'

interface HealthOverviewChartsProps {
    data: HistoryItem[]
}

type ScanBucket = { label: string; healthy: number; diseased: number }

function computeScanData(data: HistoryItem[], filter: TimeFilter): ScanBucket[] {
    const now = new Date()
    const DAY_MS = 24 * 60 * 60 * 1000

    if (filter === 'Week') {
        const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(now)
            d.setDate(d.getDate() - (6 - i))
            const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
            const end = start + DAY_MS
            const bucket = data.filter((item) => {
                const t = new Date(item.rawDate).getTime()
                return t >= start && t < end
            })
            return {
                label: DAY_LABELS[d.getDay()],
                healthy: bucket.filter((x) => x.status === 'Healthy').length,
                diseased: bucket.filter((x) => x.status === 'Diseased').length,
            }
        })
    }

    if (filter === 'Month') {
        return Array.from({ length: 4 }, (_, i) => {
            const weekEnd = new Date(now.getTime() - (3 - i) * 7 * DAY_MS)
            const weekStart = new Date(weekEnd.getTime() - 7 * DAY_MS)
            const bucket = data.filter((item) => {
                const t = new Date(item.rawDate).getTime()
                return t >= weekStart.getTime() && t < weekEnd.getTime()
            })
            return {
                label: `W${i + 1}`,
                healthy: bucket.filter((x) => x.status === 'Healthy').length,
                diseased: bucket.filter((x) => x.status === 'Diseased').length,
            }
        })
    }

    // Year
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const year = now.getFullYear()
    return MONTHS.map((label, month) => {
        const bucket = data.filter((item) => {
            const d = new Date(item.rawDate)
            return d.getFullYear() === year && d.getMonth() === month
        })
        return {
            label,
            healthy: bucket.filter((x) => x.status === 'Healthy').length,
            diseased: bucket.filter((x) => x.status === 'Diseased').length,
        }
    })
}

export const HealthOverviewCharts = ({ data }: HealthOverviewChartsProps) => {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('Month')

    const total = data.length
    const healthyCount = data.filter(d => d.status === 'Healthy').length
    const diseasedCount = data.filter(d => d.status === 'Diseased').length
    const healthyPct = total === 0 ? 0 : Math.round((healthyCount / total) * 100)
    const diseasedPct = total === 0 ? 0 : Math.round((diseasedCount / total) * 100)

    const gradient = data.length === 0
        ? '#E5E7EB'
        : `conic-gradient(#2D6A4F 0% ${healthyPct}%, #F87171 ${healthyPct}% 100%)`

    const scanStats = useMemo(() => computeScanData(data, timeFilter), [data, timeFilter])
    const maxCount = useMemo(
        () => Math.max(...scanStats.flatMap((s) => [s.healthy, s.diseased]), 1),
        [scanStats],
    )

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
                <HStack align="flex-end" height="150px" gap="2" justify="space-between" px="2" overflow="visible">
                    {scanStats.map((stat, index) => (
                        <BarPair
                            key={index}
                            h1={`${Math.round((stat.healthy / maxCount) * 100)}%`}
                            h2={`${Math.round((stat.diseased / maxCount) * 100)}%`}
                            label={stat.label}
                            healthy={stat.healthy}
                            diseased={stat.diseased}
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
                        <LegendItem color="green.700" label="Healthy" value={`${healthyPct}%`} count={healthyCount} />
                        <LegendItem color="red.400" label="Diseased" value={`${diseasedPct}%`} count={diseasedCount} />
                    </VStack>
                </Flex>
            </Box>

        </SimpleGrid>
    )
}

function BarPair({ h1, h2, label, healthy, diseased }: { h1: string; h2: string; label: string; healthy: number; diseased: number }) {
    const [hovered, setHovered] = useState(false)
    const total = healthy + diseased

    return (
        <VStack
            flex="1" gap="2" h="full" justify="flex-end"
            position="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {hovered && total > 0 && (
                <Box
                    position="absolute"
                    bottom="calc(100% + 6px)"
                    left="50%"
                    transform="translateX(-50%)"
                    bg="gray.800"
                    color="white"
                    px="2.5"
                    py="1.5"
                    borderRadius="md"
                    fontSize="xs"
                    whiteSpace="nowrap"
                    zIndex={20}
                    boxShadow="md"
                    pointerEvents="none"
                >
                    <Text fontWeight="bold" color="white">{total} scan{total !== 1 ? 's' : ''}</Text>
                    <HStack gap="1.5"><Box w="2" h="2" borderRadius="full" bg="green.400" /><Text color="gray.300">{healthy} healthy</Text></HStack>
                    <HStack gap="1.5"><Box w="2" h="2" borderRadius="full" bg="red.400" /><Text color="gray.300">{diseased} diseased</Text></HStack>
                </Box>
            )}
            <HStack align="flex-end" w="full" h="full" gap="1">
                <Box w="full" h={h1} bg="green.700" borderRadius="sm" />
                <Box w="full" h={h2} bg="red.200" borderRadius="sm" />
            </HStack>
            <Text fontSize="xs" color="gray.400">{label}</Text>
        </VStack>
    )
}

function LegendItem({ color, label, value, count }: { color: string; label: string; value: string; count: number }) {
    return (
        <HStack gap="4" w="full" minW="160px" justify="space-between">
            <HStack gap="3">
                <Box w="4" h="4" bg={color} borderRadius="md" />
                <Text fontSize="sm" fontWeight="medium" color="gray.600">{label}</Text>
            </HStack>
            <VStack gap="0" align="flex-end">
                <Text fontSize="sm" fontWeight="bold" color="gray.900">{count}</Text>
                <Text fontSize="xs" color="gray.400">({value})</Text>
            </VStack>
        </HStack>
    )
}