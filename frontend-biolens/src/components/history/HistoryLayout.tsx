'use client'
import { Box, Flex, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { StatCard } from '@/components/shared/StatCard'
import { HealthOverviewCharts } from '@/components/history/HealthOverviewCharts'
import { DiseaseStatsCard } from '@/components/history/DiseaseStatsCard'
import { HistoryTable } from '@/components/history/HistoryTable'
import { ExportReports } from '@/components/history/ExportReports'
import type { HistoryItem } from '@/components/history/HistoryTable'

const HISTORY_DATA: HistoryItem[] = [
  { id:  1, plant: 'Tomato',    field: 'Field A', disease: 'Early Blight',    conf: 94, date: 'Today, 09:14',     status: 'Diseased' },
  { id:  2, plant: 'Corn',      field: 'Field B', disease: '-',               conf: 98, date: 'Yesterday, 14:30', status: 'Healthy'  },
  { id:  3, plant: 'Grape',     field: 'Field C', disease: 'Powdery Mildew',  conf: 89, date: 'Mar 17, 11:00',    status: 'Diseased' },
  { id:  4, plant: 'Wheat',     field: 'Field B', disease: 'Brown Rust',      conf: 91, date: 'Mar 15, 08:45',    status: 'Moderate' },
  { id:  5, plant: 'Soybeans',  field: 'Field D', disease: '-',               conf: 97, date: 'Mar 14, 15:20',    status: 'Healthy'  },
  { id:  6, plant: 'Tomato',    field: 'Field A', disease: 'Late Blight',     conf: 86, date: 'Mar 12, 10:30',    status: 'Diseased' },
  { id:  7, plant: 'Sunflower', field: 'Field E', disease: 'Downy Mildew',    conf: 78, date: 'Mar 11, 08:00',    status: 'Diseased' },
  { id:  8, plant: 'Pepper',    field: 'Field C', disease: '-',               conf: 95, date: 'Mar 10, 13:45',    status: 'Healthy'  },
  { id:  9, plant: 'Potato',    field: 'Field A', disease: 'Black Scurf',     conf: 83, date: 'Mar 9, 10:20',     status: 'Diseased' },
  { id: 10, plant: 'Barley',    field: 'Field B', disease: 'Leaf Stripe',     conf: 76, date: 'Mar 8, 09:00',     status: 'Moderate' },
  { id: 11, plant: 'Soybean',   field: 'Field D', disease: '-',               conf: 99, date: 'Mar 7, 15:30',     status: 'Healthy'  },
  { id: 12, plant: 'Maize',     field: 'Field E', disease: 'Northern Blight', conf: 88, date: 'Mar 6, 11:10',     status: 'Diseased' },
]

export function HistoryLayout() {
  const diseased = HISTORY_DATA.filter((d) => d.status === 'Diseased').length
  const healthyPct = Math.round(
    (HISTORY_DATA.filter((d) => d.status === 'Healthy').length / HISTORY_DATA.length) * 100
  )

  return (
    <Box px={{ base: 4, md: 6, lg: 10 }} pb={10}>
      <Box pt={6} mb={6}>
        <Heading size="2xl" color="green.800" fontWeight="bold">History & Reports</Heading>
        <Text color="gray.500" fontSize="sm" mt="1">View your complete diagnosis history and export reports</Text>
      </Box>

      <VStack gap="6" align="stretch" w="full">
        <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="6">
          <StatCard label="Total scans" value={HISTORY_DATA.length} helpText="12% this month" trend="up" />
          <StatCard label="Diseases detected" value={diseased} helpText="3 this week" trend="down" />
          <StatCard label="Healthy plants" value={`${healthyPct}%`} helpText="5% vs last month" trend="up" />
          <StatCard label="Treatments applied" value="8" helpText="Last: 2 days ago" />
        </SimpleGrid>

        <HealthOverviewCharts data={HISTORY_DATA} />

        <Flex gap="6" direction={{ base: 'column', lg: 'row' }} align="stretch">
          <VStack gap="6" flex="2" align="stretch">
            <HistoryTable data={HISTORY_DATA} />
          </VStack>
          <VStack gap="6" flex="1" align="stretch" h="full">
            <DiseaseStatsCard data={HISTORY_DATA} />
            <ExportReports />
          </VStack>
        </Flex>
      </VStack>
    </Box>
  )
}
