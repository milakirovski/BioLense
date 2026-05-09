'use client'

import { Box, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import axios from 'axios'
import { UploadPanel } from '@/components/analysis/UploadPanel'
import { ResultPanel } from '@/components/analysis/ResultPanel'
import { StatsPanel } from '@/components/analysis/StatsPanel'
import { routes } from '@/lib/routes'
import type { AnalysisResult, DiagnosisEntry, PlantIdResponse } from '@/types/analysis'

function parseTreatment(result?: PlantIdResponse['result']) {
  const treatment = result?.disease?.suggestions?.[0]?.details?.treatment
  const items = [
    ...(treatment?.biological ?? []),
    ...(treatment?.chemical ?? []),
    ...(treatment?.prevention ?? []),
  ]
  return items.slice(0, 4)
}

function parseResult(data: PlantIdResponse, fallbackPlant: string) {
  const topPlant   = data.result?.classification?.suggestions?.[0]
  const topDisease = data.result?.disease?.suggestions?.[0]
  const healthy    = data.result?.is_healthy?.binary
  const confidence = topDisease?.probability ?? topPlant?.probability ?? null
  let severity = 'Low'
  if ((confidence ?? 0) >= 0.8) severity = 'High'
  else if ((confidence ?? 0) >= 0.55) severity = 'Moderate'
  return {
    plantName: topPlant?.name ?? fallbackPlant,
    diseaseName: healthy ? 'No disease detected' : topDisease?.name ?? 'Potential disease',
    confidence,
    severity,
    stage: healthy ? 'Healthy' : 'Early',
    treatmentTips: parseTreatment(data.result),
    isHealthy: healthy ?? null,
    topDiseaseName: topDisease?.name ?? null,
  }
}

export function AnalysisLayout() {
  const [diagnoses, setDiagnoses]       = useState<DiagnosisEntry[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl]     = useState<string>('')
  const [imageInResult, setImageInResult] = useState(false)
  const [loadingMeta, setLoadingMeta]   = useState(true)
  const [isAnalyzing, setIsAnalyzing]   = useState(false)
  const [isSaving, setIsSaving]         = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [analysis, setAnalysis]         = useState<AnalysisResult | null>(null)

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const res = await fetch(routes.crops.diagnoses)
        if (!res.ok) throw new Error('Failed to load data.')
        setDiagnoses((await res.json()) ?? [])
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load data.')
      } finally {
        setLoadingMeta(false)
      }
    }
    void loadMeta()
  }, [])

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [previewUrl])

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : '')
    setImageInResult(false)
    setAnalysis(null)
  }

  const onAnalyze = async () => {
    if (!selectedFile) {
      setErrorMessage('Please upload an image first.')
      return
    }
    setErrorMessage('')
    setImageInResult(true)
    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      const res = await fetch(routes.crops.diagnose, { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Analysis request failed.')
      const data: PlantIdResponse = await res.json()

      const parsed = parseResult(data, 'Unknown plant')
      const nowIso = new Date().toISOString()

      setAnalysis({
        plantName:     parsed.plantName,
        diseaseName:   parsed.diseaseName,
        confidence:    parsed.confidence,
        severity:      parsed.severity,
        stage:         parsed.stage,
        fieldLabel:    '—',
        scannedAt:     nowIso,
        treatmentTips: parsed.treatmentTips,
      })
    } catch (error) {
      setImageInResult(false)
      setErrorMessage(error instanceof Error ? error.message : 'Analysis request failed.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const onSaveToHistory = async () => {
    if (!selectedFile || !analysis) return
    setIsSaving(true)
    setErrorMessage('')
    try {
      // Create the crop from the AI-identified plant
      const today = new Date().toISOString().split('T')[0]
      const cropRes = await axios.post<{ id: number }>(routes.crops.create, {
        plantType:    analysis.plantName,
        fieldName:    `${analysis.plantName} Field`,
        areaHectares: 1.0,
        plantedAt:    today,
      })
      const cropId = cropRes.data.id

      // Diagnose the crop (saves the diagnosis)
      const formData = new FormData()
      formData.append('image', selectedFile)
      const diagRes = await fetch(routes.crops.diagnoseForCrop(cropId), { method: 'POST', body: formData })
      if (!diagRes.ok) throw new Error('Failed to save diagnosis.')
      const data: PlantIdResponse = await diagRes.json()

      const parsed = parseResult(data, analysis.plantName)
      const nowIso = new Date().toISOString()
      setDiagnoses((prev) => [{
        id:          Date.now(),
        cropId,
        plantName:   parsed.plantName,
        diseaseName: parsed.topDiseaseName,
        confidence:  parsed.confidence !== null ? parsed.confidence * 100 : null,
        isHealthy:   parsed.isHealthy,
        treatment:   parsed.treatmentTips.join('\n'),
        diagnosedAt: nowIso,
      }, ...prev])

    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save to history.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Box px={{ base: 4, md: 6, lg: 10 }} pb={10}>
      <Box pt={6} mb={6}>
        <Heading size="2xl" color="green.800" fontWeight="bold">Analysis Lab</Heading>
        <Text color="gray.500" fontSize="sm" mt="1">Upload and analyze plant health using AI</Text>
      </Box>

      <VStack align="stretch" gap="6">
        {errorMessage && (
          <Box borderRadius="md" bg="red.50" border="1px solid" borderColor="red.100" p="3">
            <Text fontSize="sm" color="red.700">{errorMessage}</Text>
          </Box>
        )}
        <SimpleGrid columns={{ base: 1, xl: 3 }} gap="6" alignItems="stretch">
          <UploadPanel
            onFileChange={onFileChange}
            onAnalyze={() => void onAnalyze()}
            isAnalyzing={isAnalyzing}
            previewUrl={imageInResult ? '' : previewUrl}
          />
          <ResultPanel
            analysis={analysis}
            previewUrl={imageInResult ? previewUrl : ''}
            onSaveToHistory={() => { void onSaveToHistory() }}
            isSaving={isSaving}
          />
          <StatsPanel diagnoses={diagnoses} loadingMeta={loadingMeta} />
        </SimpleGrid>
      </VStack>
    </Box>
  )
}
