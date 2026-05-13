'use client'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { routes } from '@/lib/routes'
import type { FieldEntity, CreateFieldPayload, UpdateFieldPayload } from '@/types'

interface UseFieldsReturn {
  fields: FieldEntity[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  createField: (payload: CreateFieldPayload) => Promise<FieldEntity>
  updateField: (id: number, payload: UpdateFieldPayload) => Promise<FieldEntity>
  deleteField: (id: number) => Promise<void>
}

export function useFields(): UseFieldsReturn {
  const [fields, setFields] = useState<FieldEntity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await axios.get<FieldEntity[]>(routes.fields.all)
      setFields(res.data)
    } catch {
      setError('Failed to load fields.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  const createField = useCallback(
    async (payload: CreateFieldPayload): Promise<FieldEntity> => {
      const res = await axios.post<FieldEntity>(routes.fields.create, payload)
      await fetchAll()
      return res.data
    },
    [fetchAll],
  )

  const updateField = useCallback(
    async (id: number, payload: UpdateFieldPayload): Promise<FieldEntity> => {
      const res = await axios.put<FieldEntity>(routes.fields.update(id), payload)
      await fetchAll()
      return res.data
    },
    [fetchAll],
  )

  const deleteField = useCallback(
    async (id: number): Promise<void> => {
      await axios.delete(routes.fields.delete(id))
      await fetchAll()
    },
    [fetchAll],
  )

  return {
    fields,
    isLoading,
    error,
    refetch: fetchAll,
    createField,
    updateField,
    deleteField,
  }
}