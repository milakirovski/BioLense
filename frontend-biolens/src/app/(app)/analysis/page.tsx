'use client'

import {
    Badge,
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    Image,
    Input,
    SimpleGrid,
    Spinner,
    Text,
    VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { FiImage, FiUploadCloud } from 'react-icons/fi'
import type { ChangeEvent } from 'react'

type CropOption = {
    id: number
    plantType: string
    fieldName: string
}

type DiagnosisEntry = {
    id: number
    cropId: number
    plantName: string
    diseaseName: string | null
    confidence: number | null
    isHealthy: boolean | null
    treatment: string | null
    diagnosedAt: string
}

type PlantIdResponse = {
    result?: {
        is_healthy?: { binary?: boolean; probability?: number }
        classification?: { suggestions?: Array<{ name?: string; probability?: number }> }
        disease?: {
            suggestions?: Array<{
                name?: string
                probability?: number
                details?: {
                    treatment?: {
                        biological?: string[]
                        chemical?: string[]
                        prevention?: string[]
                    }
                }
            }>
        }
    }
}

function formatWhen(value?: string) {
    if (!value) return '—'
    const date = new Date(value)
    return Number.isNaN(date.getTime())
        ? '—'
        : date.toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
}

function parseTreatment(result?: PlantIdResponse['result']) {
    const treatment = result?.disease?.suggestions?.[0]?.details?.treatment
    const items = [
        ...(treatment?.biological ?? []),
        ...(treatment?.chemical ?? []),
        ...(treatment?.prevention ?? []),
    ]
    return items.slice(0, 4)
}

export default function AnalysisPage() {
    const [crops, setCrops] = useState<CropOption[]>([])
    const [diagnoses, setDiagnoses] = useState<DiagnosisEntry[]>([])
    const [selectedCropId, setSelectedCropId] = useState<string>('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>('')
    const [loadingMeta, setLoadingMeta] = useState(true)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [analysis, setAnalysis] = useState<{
        plantName: string
        diseaseName: string
        confidence: number | null
        severity: string
        stage: string
        fieldLabel: string
        scannedAt: string
        treatmentTips: string[]
    } | null>(null)

    const selectedCrop = useMemo(
        () => crops.find((crop) => String(crop.id) === selectedCropId),
        [crops, selectedCropId]
    )

    const recentDiagnoses = useMemo(
        () =>
            [...diagnoses]
                .sort((a, b) => new Date(b.diagnosedAt).getTime() - new Date(a.diagnosedAt).getTime())
                .slice(0, 5),
        [diagnoses]
    )

    const diseaseCount = useMemo(
        () =>
            diagnoses.filter((item) => {
                const disease = item.diseaseName?.trim().toLowerCase()
                if (!disease) return false
                return disease !== 'no disease detected' && disease !== 'healthy'
            }).length,
        [diagnoses]
    )

    useEffect(() => {
        const loadMeta = async () => {
            try {
                setLoadingMeta(true)
                const response = await fetch('/api/analysis/meta')
                if (!response.ok) {
                    throw new Error('Failed to load data.')
                }

                const data = await response.json()
                const nextCrops: CropOption[] = (data.crops ?? []).slice(0, 5)
                setCrops(nextCrops)
                if (nextCrops.length > 0) {
                    setSelectedCropId((current) => current || String(nextCrops[0].id))
                }
                setDiagnoses(data.diagnoses ?? [])
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : 'Failed to load data.')
            } finally {
                setLoadingMeta(false)
            }
        }

        void loadMeta()
    }, [])

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }
        setSelectedFile(file)
        setPreviewUrl(file ? URL.createObjectURL(file) : '')
    }

    const onAnalyze = async () => {
        if (!selectedFile || !selectedCropId) {
            setErrorMessage('Please select one field and upload one image first.')
            return
        }

        setErrorMessage('')
        setIsAnalyzing(true)

        try {
            const formData = new FormData()
            formData.append('image', selectedFile)
            formData.append('cropId', selectedCropId)

            const response = await fetch('/api/analysis/diagnose', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Diagnosis request failed.')
            }

            const data: PlantIdResponse = await response.json()
            const topPlant = data.result?.classification?.suggestions?.[0]
            const topDisease = data.result?.disease?.suggestions?.[0]
            const healthy = data.result?.is_healthy?.binary
            const confidence = topDisease?.probability ?? topPlant?.probability ?? null

            let severity = 'Low'
            if ((confidence ?? 0) >= 0.8) severity = 'High'
            else if ((confidence ?? 0) >= 0.55) severity = 'Moderate'

            const treatmentTips = parseTreatment(data.result)
            const nowIso = new Date().toISOString()

            setAnalysis({
                plantName: topPlant?.name ?? 'Unknown plant',
                diseaseName: healthy ? 'No disease detected' : topDisease?.name ?? 'Potential disease',
                confidence,
                severity,
                stage: healthy ? 'Healthy' : 'Early',
                fieldLabel: `${selectedCrop?.fieldName ?? 'Field'} - ${selectedCrop?.plantType ?? ''}`,
                scannedAt: nowIso,
                treatmentTips,
            })

            const diagnosisRecord: DiagnosisEntry = {
                id: Date.now(),
                cropId: Number(selectedCropId),
                plantName: topPlant?.name ?? 'Unknown plant',
                diseaseName: healthy ? null : topDisease?.name ?? null,
                confidence: confidence !== null ? confidence * 100 : null,
                isHealthy: healthy ?? null,
                treatment: treatmentTips.join('\n'),
                diagnosedAt: nowIso,
            }

            setDiagnoses((prev) => [diagnosisRecord, ...prev])
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Diagnosis request failed.')
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <Container maxW="full" py="2" px="8">
            <VStack align="stretch" gap="6">
                <Box>
                    <Heading size="3xl" color="green.800">
                        Analysis Lab
                    </Heading>
                    <Text color="gray.500">Upload and analyze plant health using AI</Text>
                </Box>

                {errorMessage ? (
                    <Box borderRadius="md" bg="red.50" border="1px solid" borderColor="red.100" p="3">
                        <Text fontSize="sm" color="red.700">
                            {errorMessage}
                        </Text>
                    </Box>
                ) : null}

                <SimpleGrid columns={{ base: 1, xl: 3 }} gap="6" alignItems="start">
                    <VStack align="stretch" gap="5">
                        <Box border="1px solid" borderColor="gray.200" borderRadius="xl" overflow="hidden" bg="white">
                            <Box bg="green.700" px="4" py="3">
                                <Text color="white" fontWeight="bold" fontSize="sm" letterSpacing="0.08em">
                                    UPLOAD PLANT IMAGE
                                </Text>
                            </Box>

                            <VStack p="4" align="stretch" gap="4">
                                <Box
                                    border="2px dashed"
                                    borderColor="gray.200"
                                    borderRadius="md"
                                    p="6"
                                    bg="gray.50"
                                >
                                    <VStack justify="center" color="gray.500" minH="160px" gap="3">
                                        <FiImage size={26} />
                                        <Text fontSize="sm">Drag & drop or click to upload</Text>
                                        <Text fontSize="xs" color="gray.400">
                                            JPG, PNG - max 10MB
                                        </Text>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={onFileChange}
                                            p="1"
                                            border="none"
                                            bg="transparent"
                                            maxW="220px"
                                            cursor="pointer"
                                        />
                                    </VStack>
                                </Box>

                                <Box>
                                    <Text fontSize="sm" mb="2">
                                        Select field
                                    </Text>
                                    <select
                                        value={selectedCropId}
                                        onChange={(event) => setSelectedCropId(event.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            background: 'white',
                                        }}
                                    >
                                        <option value="">Choose one field</option>
                                        {crops.map((crop) => (
                                            <option key={crop.id} value={String(crop.id)}>
                                                {crop.fieldName} - {crop.plantType}
                                            </option>
                                        ))}
                                    </select>
                                </Box>

                                <Button colorPalette="green" onClick={onAnalyze} loading={isAnalyzing}>
                                    Choose Image & Analyze
                                </Button>
                            </VStack>
                        </Box>

                        <Box border="1px solid" borderColor="gray.200" borderRadius="xl" p="5" bg="white">
                            <Text fontWeight="bold" color="gray.600" letterSpacing="0.08em" fontSize="xs">
                                TIPS FOR BETTER RESULTS
                            </Text>
                            <VStack align="stretch" gap="2" mt="3" fontSize="sm" color="gray.700">
                                <Text>Take photos in natural daylight for best accuracy</Text>
                                <Text>Focus on the affected part of the plant</Text>
                                <Text>Keep the plant filling most of the frame</Text>
                                <Text>Avoid blurry or dark images for accurate diagnosis</Text>
                            </VStack>
                        </Box>
                    </VStack>

                    <Box border="1px solid" borderColor="gray.200" borderRadius="xl" bg="white" overflow="hidden">
                        <Box bg="green.700" px="4" py="3">
                            <HStack justify="space-between">
                                <Text color="white" fontWeight="bold">
                                    {analysis?.plantName ?? 'Waiting for analysis'}
                                    {' — '}
                                    {analysis?.diseaseName ?? 'No result yet'}
                                </Text>
                                <Badge colorPalette="whiteAlpha" borderRadius="full">
                                    {analysis?.confidence ? `${Math.round(analysis.confidence * 100)}% confidence` : '—'}
                                </Badge>
                            </HStack>
                        </Box>

                        <VStack align="stretch" gap="4" p="4">
                            <Box borderRadius="md" border="1px solid" borderColor="gray.100" bg="green.50" p="4">
                                {previewUrl ? (
                                    <Image
                                        src={previewUrl}
                                        alt="Uploaded crop"
                                        objectFit="cover"
                                        w="full"
                                        h="220px"
                                        borderRadius="md"
                                    />
                                ) : (
                                    <VStack h="220px" justify="center" color="gray.500">
                                        <FiImage size={26} />
                                        <Text fontSize="sm">Uploaded image will appear here</Text>
                                    </VStack>
                                )}
                            </Box>

                            <VStack align="stretch" gap="2" fontSize="sm">
                                <DataRow label="Plant" value={analysis?.plantName ?? '—'} />
                                <DataRow label="Disease" value={`${analysis?.diseaseName ?? '—'} (${analysis?.stage ?? '—'})`} />
                                <DataRow label="Severity" value={analysis?.severity ?? '—'} />
                                <DataRow label="Field" value={analysis?.fieldLabel ?? '—'} />
                                <DataRow label="Scanned" value={formatWhen(analysis?.scannedAt)} />
                            </VStack>

                            <Box borderRadius="md" border="1px solid" borderColor="orange.100" bg="orange.50" p="3">
                                <Text fontWeight="bold" fontSize="sm" color="orange.700" mb="1">
                                    RECOMMENDED TREATMENT
                                </Text>
                                <VStack align="stretch" gap="1">
                                    {(analysis?.treatmentTips.length
                                        ? analysis.treatmentTips
                                        : ['Apply copper-based fungicide every 7 days', 'Improve air circulation in plant rows']
                                    ).map((tip) => (
                                        <Text key={tip} fontSize="sm" color="orange.800">
                                            - {tip}
                                        </Text>
                                    ))}
                                </VStack>
                            </Box>

                            <Button colorPalette="green" variant="solid">
                                Save to treatment history
                            </Button>
                        </VStack>
                    </Box>

                    <VStack align="stretch" gap="4">
                        <SimpleGrid columns={2} gap="3">
                            <Box border="1px solid" borderColor="gray.200" borderRadius="lg" bg="white" p="4" textAlign="center">
                                <Text fontWeight="bold" fontSize="2xl" color="green.700">
                                    {loadingMeta ? <Spinner size="sm" /> : diagnoses.length}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    Total scans
                                </Text>
                            </Box>
                            <Box border="1px solid" borderColor="gray.200" borderRadius="lg" bg="white" p="4" textAlign="center">
                                <Text fontWeight="bold" fontSize="2xl" color="green.700">
                                    {loadingMeta ? <Spinner size="sm" /> : diseaseCount}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    Diseases found
                                </Text>
                            </Box>
                        </SimpleGrid>

                        <Box border="1px solid" borderColor="gray.200" borderRadius="xl" bg="white" p="4">
                            <Text fontWeight="bold" mb="3">
                                Recent analyses
                            </Text>
                            <VStack align="stretch" gap="2">
                                {recentDiagnoses.map((item) => (
                                    <Flex
                                        key={`${item.id}-${item.diagnosedAt}`}
                                        justify="space-between"
                                        align="center"
                                        border="1px solid"
                                        borderColor="gray.100"
                                        borderRadius="md"
                                        p="2"
                                    >
                                        <Box>
                                            <Text fontSize="sm" fontWeight="semibold">
                                                {item.plantName} - Field {item.cropId}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                                {item.diseaseName ?? 'No disease'} · {formatWhen(item.diagnosedAt)}
                                            </Text>
                                        </Box>
                                        <Badge colorPalette={item.isHealthy ? 'green' : 'red'}>
                                            {item.isHealthy ? 'Healthy' : 'Diseased'}
                                        </Badge>
                                    </Flex>
                                ))}
                                {!loadingMeta && recentDiagnoses.length === 0 ? (
                                    <Text fontSize="sm" color="gray.500">
                                        No analyses yet.
                                    </Text>
                                ) : null}
                            </VStack>
                            <Button asChild mt="4" variant="ghost" colorPalette="green" w="full">
                                <Link href="/history">View all past analyses</Link>
                            </Button>
                        </Box>
                    </VStack>
                </SimpleGrid>
            </VStack>
        </Container>
    )
}

function DataRow({ label, value }: { label: string; value: string }) {
    return (
        <HStack justify="space-between" borderBottom="1px solid" borderColor="gray.100" pb="2">
            <Text color="gray.500">{label}</Text>
            <Text fontWeight="semibold">{value}</Text>
        </HStack>
    )
}