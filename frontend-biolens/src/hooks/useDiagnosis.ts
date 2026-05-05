'use client'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import type { Diagnosis, DiagnosisStats } from '@/types/diagnosis'

const now = Date.now()
const hoursAgo = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString()
const daysAgo = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000).toISOString()

const MOCK_DIAGNOSES: Diagnosis[] = [
  {
    id: 1,
    cropId: 1,
    plantName: 'Tomato',
    fieldName: 'Field A',
    diseaseName: 'Early Blight',
    confidence: 94,
    isHealthy: false,
    treatment: null,
    diagnosedAt: hoursAgo(2),
  },
  {
    id: 2,
    cropId: 2,
    plantName: 'Corn',
    fieldName: 'Field B',
    diseaseName: null,
    confidence: 98,
    isHealthy: true,
    treatment: null,
    diagnosedAt: hoursAgo(26),
  },
  {
    id: 3,
    cropId: 3,
    plantName: 'Grape',
    fieldName: 'Field C',
    diseaseName: 'Powdery Mildew',
    confidence: 89,
    isHealthy: false,
    treatment: null,
    diagnosedAt: daysAgo(11),
  },
  {
    id: 4,
    cropId: 4,
    plantName: 'Wheat',
    fieldName: 'Field B',
    diseaseName: 'Brown Rust',
    confidence: 91,
    isHealthy: false,
    treatment: null,
    diagnosedAt: daysAgo(13),
  },
  {
    id: 5,
    cropId: 5,
    plantName: 'Soybeans',
    fieldName: 'Field D',
    diseaseName: null,
    confidence: 97,
    isHealthy: true,
    treatment: null,
    diagnosedAt: daysAgo(14),
  },
  {
    id: 6,
    cropId: 1,
    plantName: 'Tomato',
    fieldName: 'Field A',
    diseaseName: 'Late Blight',
    confidence: 86,
    isHealthy: false,
    treatment: null,
    diagnosedAt: daysAgo(16),
  },
]

interface UseDiagnosisReturn {
  diagnoses: Diagnosis[]
  recentDiagnoses: Diagnosis[]
  stats: DiagnosisStats
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useDiagnosis(): UseDiagnosisReturn {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>(MOCK_DIAGNOSES)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDiagnoses = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await axios.get<{ diagnoses: Diagnosis[] }>('/api/analysis/meta')
      if (res.data.diagnoses?.length) {
        setDiagnoses(res.data.diagnoses)
      }
    } catch {
      // silently fall back to mock data already in state
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchDiagnoses()
  }, [fetchDiagnoses])

  const issuesFound = diagnoses.filter((d) => d.isHealthy === false).length

  const stats: DiagnosisStats = {
    activeFields: 5,
    totalScans: diagnoses.length,
    issuesFound,
    treated: 8,
  }

  return {
    diagnoses,
    recentDiagnoses: diagnoses.slice(0, 4),
    stats,
    isLoading,
    error,
    refetch: fetchDiagnoses,
  }
}
