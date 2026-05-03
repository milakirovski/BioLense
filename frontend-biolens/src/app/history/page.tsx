'use client'

import {
    Box,
    Heading,
    VStack,
    HStack,
    Text,
    Input,
    Button,
    Table,
    Icon,
    Container,
    Flex,
    SimpleGrid
} from '@chakra-ui/react'
import { FiDownload, FiFileText, FiTable, FiMapPin } from 'react-icons/fi'
import { StatusBadge } from '@/components/history/StatusBadge'
import {DiseaseStatsCard} from "@/components/history/DiseaseStatsCard";
import {HealthOverviewCharts} from "@/components/history/HealthOverviewCharts";
import {StatCard} from "@/components/history/StatCard";

// --- ПОДАТОЦИ ---
const historyData = [
    { id: 1, plant: "Tomato", field: "Field A", disease: "Early Blight", conf: 94, date: "Today, 09:14", status: "Diseased" },
    { id: 2, plant: "Corn", field: "Field B", disease: "—", conf: 98, date: "Yesterday, 14:30", status: "Healthy" },
    { id: 3, plant: "Grape", field: "Field C", disease: "Powdery Mildew", conf: 89, date: "Mar 17, 11:00", status: "Diseased" },
    { id: 4, plant: "Wheat", field: "Field B", disease: "Brown Rust", conf: 91, date: "Mar 15, 08:45", status: "Moderate" },
    { id: 5, plant: "Soybeans", field: "Field D", disease: "—", conf: 97, date: "Mar 14, 15:20", status: "Healthy" },
    { id: 6, plant: "Tomato", field: "Field A", disease: "Late Blight", conf: 86, date: "Mar 12, 10:30", status: "Diseased" },
]

// --- ГЛАВНА КОМПОНЕНТА ---
export default function HistoryPage() {
    return (
        <Container maxW="full" py="8" px="8">
            <VStack gap="8" align="stretch" w="full">

                {/* НАСЛОВ И ГЛАВНО КОПЧЕ */}
                <HStack justify="space-between">
                    <Heading size="lg" color="green.800">History & Reports</Heading>
                    <Button colorPalette="green" variant="solid" gap="2" size="lg">
                        <FiDownload />
                        <Text>Export All Data</Text>
                    </Button>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="6">
                    <StatCard
                        label="Total scans"
                        value={historyData.length}
                        helpText="12% this month"
                        trend="up"
                    />
                    <StatCard
                        label="Diseases detected"
                        value={historyData.filter(d => d.status === 'Diseased').length}
                        helpText="3 this week"
                        trend="down"
                    />
                    <StatCard
                        label="Healthy plants"
                        value={`${Math.round((historyData.filter(d => d.status === 'Healthy').length / historyData.length) * 100)}%`}
                        helpText="5% vs last month"
                        trend="up"
                    />
                    <StatCard
                        label="Treatments applied"
                        value="8"
                        helpText="Last: 2 days ago"
                    />
                </SimpleGrid>

                {/* ГОРЕН ДЕЛ: ГРАФИКОНИ */}
                <HealthOverviewCharts data={historyData} />

                {/* ДОЛЕН ДЕЛ: ТАБЕЛА И СТАТИСТИКИ */}
                <Flex gap="8" direction={{ base: "column", lg: "row" }} align="flex-start">

                    {/* ТАБЕЛА И ФИЛТРИ */}
                    <VStack gap="6" flex="2" align="stretch">
                        <Box
                            bg="white"
                            borderRadius="xl"
                            boxShadow="sm"
                            border="1px solid"
                            borderColor="gray.100"
                            overflow="hidden"
                        >
                            {/* ГОРЕН ДЕЛ: Наслов, Филтри и Search */}
                            <Box p="6" borderBottom="1px solid" borderColor="gray.50">
                                <VStack align="stretch" gap="6">

                                    {/* Наслов и Филтри */}
                                    <HStack justify="space-between">
                                        <Text fontWeight="bold" fontSize="lg">Diagnosis history</Text>
                                        <HStack gap="2">
                                            <Button size="sm" variant="surface" colorPalette="green" borderRadius="full">All</Button>
                                            <Button size="sm" variant="ghost" borderRadius="full">Diseased</Button>
                                            <Button size="sm" variant="ghost" borderRadius="full">Healthy</Button>
                                        </HStack>
                                    </HStack>

                                    {/* Search + Export */}
                                    <HStack gap="4">
                                        <Input
                                            placeholder="Search diagnoses..."
                                            variant="subtle"
                                            bg="gray.50"
                                            flex="1"
                                        />
                                        <Button colorPalette="green" px="8" gap="2">
                                            <FiDownload /> Export
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Box>

                            {/* ДОЛЕН ДЕЛ: Табелата */}
                            <Table.Root variant="line" size="md" width="full">
                                <Table.Header bg="gray.50/50">
                                    <Table.Row>
                                        <Table.ColumnHeader px="6" py="4" fontSize="xs" color="gray.500">PLANT / FIELD</Table.ColumnHeader>
                                        <Table.ColumnHeader px="6" py="4" fontSize="xs" color="gray.500">DISEASE</Table.ColumnHeader>
                                        <Table.ColumnHeader px="6" py="4" fontSize="xs" color="gray.500">CONFIDENCE</Table.ColumnHeader>
                                        <Table.ColumnHeader px="6" py="4" fontSize="xs" color="gray.500">DATE</Table.ColumnHeader>
                                        <Table.ColumnHeader px="6" py="4" fontSize="xs" color="gray.500" textAlign="right">STATUS</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {historyData.map((item) => (
                                        <Table.Row key={item.id} _hover={{ bg: "gray.50/30" }} transition="background 0.2s">
                                            <Table.Cell px="6" py="4">
                                                <VStack align="flex-start" gap="0">
                                                    <Text fontWeight="bold" fontSize="sm">{item.plant}</Text>
                                                    <Text fontSize="xs" color="gray.400">{item.field}</Text>
                                                </VStack>
                                            </Table.Cell>

                                            <Table.Cell px="6" py="4" fontSize="sm">{item.disease}</Table.Cell>

                                            <Table.Cell px="6" py="4">
                                                <HStack gap="3" minW="140px">
                                                    <Box flex="1" h="1.5" bg="gray.100" borderRadius="full" overflow="hidden">
                                                        <Box w={`${item.conf}%`} h="full" bg="green.600" />
                                                    </Box>
                                                    <Text fontSize="xs" fontWeight="bold" w="35px">{item.conf}%</Text>
                                                </HStack>
                                            </Table.Cell>

                                            <Table.Cell px="6" py="4" fontSize="sm" color="gray.600">{item.date}</Table.Cell>

                                            <Table.Cell px="6" py="4" textAlign="right">
                                                <StatusBadge status={item.status} />
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    </VStack>

                    {/* ДЕСНИ СТАТИСТИКИ */}
                    <VStack gap="6" flex="1" align="stretch">
                        <DiseaseStatsCard data={historyData} />

                        <Box bg="white" p="6" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                            <Heading size="md" mb="4">Export reports</Heading>
                            <VStack gap="3">
                                <ExportOption icon={FiFileText} title="PDF Report" desc="Full monthly summary" color="red" />
                                <ExportOption icon={FiTable} title="Excel Export" desc="Raw data & statistics" color="green" />
                                <ExportOption icon={FiMapPin} title="GeoJSON Map" desc="Infected zones map" color="blue" />
                            </VStack>
                        </Box>
                    </VStack>

                </Flex>
            </VStack>
        </Container>
    )
}

// --- ПОМОШНИ КОМПОНЕНТИ ---

function ExportOption({ icon, title, desc, color }: any) {
    return (
        <HStack w="full" p="3" border="1px solid" borderColor="gray.50" borderRadius="lg" _hover={{ bg: "gray.50", cursor: "pointer" }} transition="0.2s">
            <Box p="2" bg={`${color}.50`} borderRadius="md" color={`${color}.500`}>
                <Icon as={icon} />
            </Box>
            <VStack align="flex-start" gap="0" flex="1">
                <Text fontSize="sm" fontWeight="bold">{title}</Text>
                <Text fontSize="xs" color="gray.500">{desc}</Text>
            </VStack>
            <Icon as={FiDownload} color="gray.300" fontSize="xs" />
        </HStack>
    )
}