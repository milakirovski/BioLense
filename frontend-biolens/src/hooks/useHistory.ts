'use client'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { routes } from '@/lib/routes'
import { toCommonName } from '@/lib/plantNames'
import type { Diagnosis } from '@/types'
import type { HistoryItem } from '@/components/history/HistoryTable'

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  if (diffMs < 24 * 60 * 60 * 1000) return `Today, ${time}`
  if (diffMs < 48 * 60 * 60 * 1000) return `Yesterday, ${time}`
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${dateStr}, ${time}`
}

function toHistoryItem(d: Diagnosis): HistoryItem {
  return {
    id: d.id,
    plant: toCommonName(d.plantName),
    field: d.fieldName ?? '—',
    disease: d.diseaseName ?? '-',
    conf: d.confidence ?? 0,
    date: formatDate(d.diagnosedAt),
    rawDate: d.diagnosedAt,
    status: d.isHealthy === true ? 'Healthy' : 'Diseased',
  }
}

interface UseHistoryReturn {
  items: HistoryItem[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useHistory(): UseHistoryReturn {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await axios.get<Diagnosis[]>(routes.crops.diagnoses)
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.diagnosedAt).getTime() - new Date(a.diagnosedAt).getTime(),
      )
      setItems(sorted.map(toHistoryItem))
    } catch {
      setError('Failed to load diagnosis history.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  return { items, isLoading, error, refetch: fetchAll }
}
