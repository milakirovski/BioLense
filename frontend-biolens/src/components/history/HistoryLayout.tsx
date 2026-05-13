'use client'
import { Box, Flex, Heading, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react'
import { StatCard } from '@/components/shared/StatCard'
import { HealthOverviewCharts } from '@/components/history/HealthOverviewCharts'
import { DiseaseStatsCard } from '@/components/history/DiseaseStatsCard'
import { HistoryTable } from '@/components/history/HistoryTable'
import { ExportReports } from '@/components/history/ExportReports'
import { useHistory } from '@/hooks/useHistory'

export function HistoryLayout() {
  const { items, isLoading, error } = useHistory()

  const diseased = items.filter((d) => d.status === 'Diseased').length
  const healthy = items.filter((d) => d.status === 'Healthy').length
  const healthyPct = items.length > 0 ? Math.round((healthy / items.length) * 100) : 0

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner color="green.500" size="lg" />
      </Flex>
    )
  }

  if (error) {
    return (
      <Box px={{ base: 4, md: 6, lg: 10 }} pt={6}>
        <Box bg="red.50" border="1px solid" borderColor="red.100" borderRadius="xl" p="6" textAlign="center">
          <Text color="red.700" fontWeight="medium">{error}</Text>
        </Box>
      </Box>
    )
  }

  return (
    <Box px={{ base: 4, md: 6, lg: 10 }} pb={10}>
      <Box pt={6} mb={6}>
        <Heading size="2xl" color="green.800" fontWeight="bold">History & Reports</Heading>
        <Text color="gray.500" fontSize="sm" mt="1">View your complete diagnosis history and export reports</Text>
      </Box>

      <VStack gap="6" align="stretch" w="full">
        <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="6">
          <StatCard label="Total scans" value={items.length} helpText="All time" />
          <StatCard label="Diseases detected" value={diseased} helpText={`${items.length > 0 ? Math.round((diseased / items.length) * 100) : 0}% of scans`} trend="down" />
          <StatCard label="Healthy plants" value={`${healthyPct}%`} helpText={`${healthy} of ${items.length} scans`} trend="up" />
          <StatCard label="Treatments applied" value={items.filter((d) => d.status === 'Diseased').length} helpText="Based on diagnoses" />
        </SimpleGrid>

        <HealthOverviewCharts data={items} />

        <Flex gap="6" direction={{ base: 'column', lg: 'row' }} align="stretch">
          <VStack gap="6" flex="2" align="stretch">
            <HistoryTable data={items} />
          </VStack>
          <VStack gap="6" flex="1" align="stretch" h="full">
            <DiseaseStatsCard data={items} />
            <ExportReports />
          </VStack>
        </Flex>
      </VStack>
    </Box>
  )
}
