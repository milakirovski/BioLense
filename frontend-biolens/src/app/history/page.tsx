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
    Badge,
    Icon,
    Container,
    Flex,
    SimpleGrid,
    Stack
} from '@chakra-ui/react'
import { FiDownload, FiFileText, FiTable, FiMapPin } from 'react-icons/fi'

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

                {/* ГОРЕН ДЕЛ: ГРАФИКОНИ */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
                    {/* Scans over time */}
                    <Box bg="white" p="6" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                        <HStack justify="space-between" mb="6">
                            <Text fontWeight="bold">Scans over time</Text>
                            <HStack gap="2">
                                <Button size="xs" variant="ghost">Week</Button>
                                <Button size="xs" variant="surface" colorPalette="green">Month</Button>
                                <Button size="xs" variant="ghost">Year</Button>
                            </HStack>
                        </HStack>
                        <HStack align="flex-end" height="150px" gap="4" justify="space-between" px="2">
                            <BarPair h1="40%" h2="20%" label="W1" />
                            <BarPair h1="70%" h2="25%" label="W2" />
                            <BarPair h1="85%" h2="30%" label="W3" />
                            <BarPair h1="100%" h2="40%" label="W4" />
                        </HStack>
                        <HStack mt="4" gap="4" fontSize="xs" color="gray.500">
                            <HStack gap="1"><Box w="3" h="3" bg="green.700" borderRadius="sm" /> <Text>Healthy</Text></HStack>
                            <HStack gap="1"><Box w="3" h="3" bg="red.300" borderRadius="sm" /> <Text>Diseased</Text></HStack>
                        </HStack>
                    </Box>

                    {/* Health Distribution */}
                    <Box bg="white" p="6" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                        <Text fontWeight="bold" mb="6">Health distribution</Text>
                        <Flex align="center" justify="space-around" h="150px">
                            <Box
                                w="130px" h="130px" borderRadius="full"
                                bg="conic-gradient(#2D6A4F 0% 75%, #F87171 75% 92%, #FBBF24 92% 100%)"
                            />
                            <VStack align="flex-start" gap="2">
                                <LegendItem color="green.700" label="Healthy" value="75%" />
                                <LegendItem color="red.300" label="Diseased" value="17%" />
                                <LegendItem color="yellow.400" label="Moderate" value="8%" />
                            </VStack>
                        </Flex>
                    </Box>
                </SimpleGrid>

                {/* ДОЛЕН ДЕЛ: ТАБЕЛА И СТАТИСТИКИ */}
                <Flex gap="8" direction={{ base: "column", lg: "row" }} align="flex-start">

                    {/* ТАБЕЛА И ФИЛТРИ */}
                    <VStack gap="6" flex="2" align="stretch">
                        <HStack gap="4" bg="white" p="2" borderRadius="xl" boxShadow="xs" border="1px solid" borderColor="gray.100">
                            <Input placeholder="Search diagnoses..." variant="subtle" bg="gray.50" flex="1" />
                            <HStack gap="2" px="2">
                                <Button size="sm" variant="surface" colorPalette="green">All</Button>
                                <Button size="sm" variant="ghost">Diseased</Button>
                                <Button size="sm" variant="ghost">Healthy</Button>
                                <Button size="sm" variant="ghost">Field A</Button>
                            </HStack>
                        </HStack>

                        <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
                            <Table.Root size="lg" variant="line">
                                <Table.Header bg="gray.50">
                                    <Table.Row>
                                        <Table.ColumnHeader fontSize="xs">PLANT / FIELD</Table.ColumnHeader>
                                        <Table.ColumnHeader fontSize="xs">DISEASE</Table.ColumnHeader>
                                        <Table.ColumnHeader fontSize="xs">CONFIDENCE</Table.ColumnHeader>
                                        <Table.ColumnHeader fontSize="xs">DATE</Table.ColumnHeader>
                                        <Table.ColumnHeader fontSize="xs">STATUS</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {historyData.map((item) => (
                                        <Table.Row key={item.id} _hover={{ bg: "gray.50" }}>
                                            <Table.Cell>
                                                <VStack align="flex-start" gap="0">
                                                    <Text fontWeight="bold" fontSize="sm">{item.plant}</Text>
                                                    <Text fontSize="xs" color="gray.400">{item.field}</Text>
                                                </VStack>
                                            </Table.Cell>
                                            <Table.Cell fontSize="sm">{item.disease}</Table.Cell>
                                            <Table.Cell>
                                                <HStack gap="3">
                                                    <Box flex="1" h="6px" bg="gray.100" borderRadius="full" overflow="hidden" minW="70px">
                                                        <Box w={`${item.conf}%`} h="full" bg="green.600" />
                                                    </Box>
                                                    <Text fontSize="xs" fontWeight="bold">{item.conf}%</Text>
                                                </HStack>
                                            </Table.Cell>
                                            <Table.Cell fontSize="sm" color="gray.600">{item.date}</Table.Cell>
                                            <Table.Cell>
                                                <Badge variant="subtle" colorPalette={item.status === 'Diseased' ? 'red' : item.status === 'Moderate' ? 'orange' : 'green'} borderRadius="full" px="3">
                                                    {item.status}
                                                </Badge>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    </VStack>

                    {/* ДЕСНИ СТАТИСТИКИ */}
                    <VStack gap="6" flex="1" align="stretch">
                        <Box bg="white" p="6" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                            <Heading size="md" mb="4">Top diseases</Heading>
                            <Stack gap="4">
                                <DiseaseStat name="Early Blight" count={8} />
                                <DiseaseStat name="Powdery Mildew" count={5} />
                                <DiseaseStat name="Brown Rust" count={3} />
                                <DiseaseStat name="Late Blight" count={2} />
                            </Stack>
                        </Box>

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
        <HStack gap="3" w="140px" justify="space-between">
            <HStack gap="2">
                <Box w="3" h="3" bg={color} borderRadius="sm" />
                <Text fontSize="xs" color="gray.600">{label}</Text>
            </HStack>
            <Text fontSize="xs" fontWeight="bold">{value}</Text>
        </HStack>
    )
}

function DiseaseStat({ name, count }: any) {
    return (
        <HStack justify="space-between">
            <Text fontSize="sm" fontWeight="medium" w="100px">{name}</Text>
            <Box h="4px" bg="gray.100" borderRadius="full" flex="1" overflow="hidden" mx="2">
                <Box w={`${(count/10)*100}%`} h="full" bg="green.600" />
            </Box>
            <Text fontSize="sm" fontWeight="bold">{count}</Text>
        </HStack>
    )
}

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