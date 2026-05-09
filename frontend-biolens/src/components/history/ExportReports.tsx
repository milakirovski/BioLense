'use client'
import { useState, type ElementType } from 'react'
import { Box, Heading, HStack, Icon, Spinner, Text, VStack } from '@chakra-ui/react'
import { FiDownload, FiFileText, FiMapPin, FiTable } from 'react-icons/fi'
import axios from 'axios'
import { routes } from '@/lib/routes'

async function triggerDownload(url: string, filename: string) {
  const res = await axios.get(url, { responseType: 'blob' })
  const href = URL.createObjectURL(res.data as Blob)
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  a.click()
  URL.revokeObjectURL(href)
}

type ExportKey = 'pdf' | 'excel' | 'geojson'

const EXPORTS: { key: ExportKey; icon: ElementType; title: string; desc: string; color: string; filename: string }[] = [
  { key: 'pdf',     icon: FiFileText, title: 'PDF Report',   desc: 'Full monthly summary',   color: 'red',   filename: 'report.pdf'     },
  { key: 'excel',   icon: FiTable,    title: 'Excel Export', desc: 'Raw data & statistics',  color: 'green', filename: 'report.xlsx'    },
  { key: 'geojson', icon: FiMapPin,   title: 'GeoJSON Map',  desc: 'Infected zones map',     color: 'blue',  filename: 'zones.geojson'  },
]

export const ExportReports = () => {
  const [loading, setLoading] = useState<ExportKey | null>(null)
  const [error, setError] = useState<ExportKey | null>(null)

  const handleExport = async (key: ExportKey, filename: string) => {
    if (loading) return
    setLoading(key)
    setError(null)
    try {
      await triggerDownload(routes.export[key], filename)
    } catch {
      setError(key)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Box bg="white" p="6" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100" flex="1">
      <Heading size="md" mb="4">Export reports</Heading>
      <VStack gap="3">
        {EXPORTS.map(({ key, icon, title, desc, color, filename }) => (
          <HStack
            key={key}
            w="full"
            p="3"
            border="1px solid"
            borderColor={error === key ? 'red.100' : 'gray.50'}
            borderRadius="lg"
            _hover={{ bg: 'gray.50', cursor: loading ? 'not-allowed' : 'pointer' }}
            transition="0.2s"
            opacity={loading && loading !== key ? 0.5 : 1}
            onClick={() => void handleExport(key, filename)}
          >
            <Box p="2" bg={`${color}.50`} borderRadius="md" color={`${color}.500`}>
              <Icon as={icon} />
            </Box>
            <VStack align="flex-start" gap="0" flex="1">
              <Text fontSize="sm" fontWeight="bold">{title}</Text>
              <Text fontSize="xs" color={error === key ? 'red.500' : 'gray.500'}>
                {error === key ? 'Export failed — try again' : desc}
              </Text>
            </VStack>
            {loading === key
              ? <Spinner size="xs" color="gray.400" />
              : <Icon as={FiDownload} color="gray.300" fontSize="xs" />
            }
          </HStack>
        ))}
      </VStack>
    </Box>
  )
}
