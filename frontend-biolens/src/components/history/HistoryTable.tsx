'use client'
import { useEffect, useState } from 'react'
import { Box, Button, HStack, Input, Table, Text, VStack } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { StatusBadge } from '@/components/history/StatusBadge'

export interface HistoryItem {
  id: number
  plant: string
  field: string
  disease: string
  conf: number
  date: string
  status: string
}

interface HistoryTableProps {
  data: HistoryItem[]
}

type Filter = 'All' | 'Diseased' | 'Healthy'

const PAGE_SIZE = 6
const ROW_HEIGHT = '64px'

export const HistoryTable = ({ data }: HistoryTableProps) => {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = data.filter((item) => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Diseased' && (item.status === 'Diseased' || item.status === 'Moderate')) ||
      (activeFilter === 'Healthy' && item.status === 'Healthy')
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      item.plant.toLowerCase().includes(q) ||
      item.field.toLowerCase().includes(q) ||
      item.disease.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  useEffect(() => { setCurrentPage(1) }, [activeFilter, search])

  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const rows: (HistoryItem | null)[] = [
    ...pageItems,
    ...Array(PAGE_SIZE - pageItems.length).fill(null),
  ]

  const filterBtn = (label: Filter) => (
    <Button
      size="sm"
      borderRadius="full"
      variant={activeFilter === label ? 'surface' : 'ghost'}
      colorPalette={activeFilter === label ? 'green' : 'gray'}
      onClick={() => setActiveFilter(label)}
    >
      {label}
    </Button>
  )

  const pagination = (
    <HStack justify="center" px="6" py="4" borderTop="1px solid" borderColor="gray.50">
      <HStack gap="1">
        <Button
          size="sm" variant="ghost" colorPalette="gray" px="2"
          opacity={currentPage === 1 ? 0.3 : 1}
          pointerEvents={currentPage === 1 ? 'none' : 'auto'}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          <FiChevronLeft />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page} size="sm" minW="8"
            variant={page === currentPage ? 'surface' : 'ghost'}
            colorPalette={page === currentPage ? 'green' : 'gray'}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          size="sm" variant="ghost" colorPalette="gray" px="2"
          opacity={currentPage === totalPages ? 0.3 : 1}
          pointerEvents={currentPage === totalPages ? 'none' : 'auto'}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        >
          <FiChevronRight />
        </Button>
      </HStack>
    </HStack>
  )

  return (
    <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">

      {/* Header — shared */}
      <Box p="6" borderBottom="1px solid" borderColor="gray.50">
        <VStack align="stretch" gap="4">
          <HStack justify="space-between" wrap="wrap" gap="3">
            <Text fontWeight="bold" fontSize="lg" whiteSpace="nowrap">Diagnosis history</Text>
            <HStack gap="2">
              {filterBtn('All')}
              {filterBtn('Diseased')}
              {filterBtn('Healthy')}
            </HStack>
          </HStack>
          <Input
            placeholder="Search diagnoses..."
            variant="subtle"
            bg="gray.50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </VStack>
      </Box>

      {/* ── MOBILE: card list ── */}
      <Box display={{ base: 'block', md: 'none' }}>
        {pageItems.length === 0 ? (
          <Box p="8" textAlign="center">
            <Text color="gray.400" fontSize="sm">No results found.</Text>
          </Box>
        ) : (
          <VStack gap="0" align="stretch" divideY="1px">
            {pageItems.map((item) => (
              <Box key={item.id} px="5" py="4" _hover={{ bg: 'gray.50/40' }} transition="background 0.2s">
                <HStack justify="space-between" mb="2">
                  <VStack align="flex-start" gap="0">
                    <Text fontWeight="bold" fontSize="sm">{item.plant}</Text>
                    <Text fontSize="xs" color="gray.400">{item.field}</Text>
                  </VStack>
                  <StatusBadge status={item.status} />
                </HStack>

                {item.disease !== '-' && (
                  <Text fontSize="sm" color="gray.600" mb="2">{item.disease}</Text>
                )}

                <HStack gap="3" mb="2">
                  <Box flex="1" h="1.5" bg="gray.100" borderRadius="full" overflow="hidden">
                    <Box w={`${item.conf}%`} h="full" bg="green.600" />
                  </Box>
                  <Text fontSize="xs" fontWeight="bold" w="32px">{item.conf}%</Text>
                </HStack>

                <Text fontSize="xs" color="gray.400">{item.date}</Text>
              </Box>
            ))}
          </VStack>
        )}
        {pagination}
      </Box>

      {/* ── DESKTOP: table ── */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Box overflowX="auto">
          <Table.Root variant="line" size="md" style={{ tableLayout: 'fixed', minWidth: '600px' }}>
            <Table.Header bg="gray.50/50">
              <Table.Row>
                <Table.ColumnHeader px="6" py="4" fontSize="xs" color="gray.500" w="18%">PLANT / FIELD</Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="xs" color="gray.500" w="18%">DISEASE</Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="xs" color="gray.500" w="26%">CONFIDENCE</Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="xs" color="gray.500" w="22%">DATE</Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="xs" color="gray.500" textAlign="right" w="16%">STATUS</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map((item, i) =>
                item ? (
                  <Table.Row key={item.id} style={{ height: ROW_HEIGHT }} _hover={{ bg: 'gray.50/30' }} transition="background 0.2s">
                    <Table.Cell px="6" py="3">
                      <VStack align="flex-start" gap="0">
                        <Text fontWeight="bold" fontSize="sm">{item.plant}</Text>
                        <Text fontSize="xs" color="gray.400">{item.field}</Text>
                      </VStack>
                    </Table.Cell>
                    <Table.Cell px="6" py="3" fontSize="sm">{item.disease}</Table.Cell>
                    <Table.Cell px="6" py="3">
                      <HStack gap="3" minW="140px">
                        <Box flex="1" h="1.5" bg="gray.100" borderRadius="full" overflow="hidden">
                          <Box w={`${item.conf}%`} h="full" bg="green.600" />
                        </Box>
                        <Text fontSize="xs" fontWeight="bold" w="35px">{item.conf}%</Text>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell px="6" py="3" fontSize="sm" color="gray.600" whiteSpace="nowrap">{item.date}</Table.Cell>
                    <Table.Cell px="6" py="3" textAlign="right">
                      <StatusBadge status={item.status} />
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  <Table.Row key={`empty-${i}`}>
                    <Table.Cell colSpan={5} p="0" border="none">
                      <Box h={ROW_HEIGHT} />
                    </Table.Cell>
                  </Table.Row>
                )
              )}
            </Table.Body>
          </Table.Root>
        </Box>
        {pagination}
      </Box>

    </Box>
  )
}
