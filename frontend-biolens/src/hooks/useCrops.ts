'use client'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { routes } from '@/lib/routes'
import type {
  Crop,
  CropStatus,
  CreateCropPayload,
  UpdateCropPayload,
  LogHarvestPayload,
  CropFilterParams,
} from '@/types'

interface UseCropsReturn {
  crops: Crop[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  createCrop: (payload: CreateCropPayload) => Promise<Crop>
  updateCrop: (id: number, payload: UpdateCropPayload) => Promise<Crop>
  deleteCrop: (id: number) => Promise<void>
  getCropById: (id: number) => Promise<Crop>
  filterCrops: (params: CropFilterParams) => Promise<Crop[]>
  findByStatus: (status: CropStatus) => Promise<Crop[]>
  logHarvest: (id: number, payload?: LogHarvestPayload) => Promise<Crop>
}

export function useCrops(): UseCropsReturn {
  const [crops, setCrops] = useState<Crop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await axios.get<Crop[]>(routes.crops.all)
      setCrops(res.data)
    } catch {
      setError('Failed to load crops.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  const createCrop = useCallback(
    async (payload: CreateCropPayload): Promise<Crop> => {
      const res = await axios.post<Crop>(routes.crops.create, payload)
      await fetchAll()
      return res.data
    },
    [fetchAll],
  )

  const updateCrop = useCallback(
    async (id: number, payload: UpdateCropPayload): Promise<Crop> => {
      const res = await axios.put<Crop>(routes.crops.update(id), payload)
      await fetchAll()
      return res.data
    },
    [fetchAll],
  )

  const deleteCrop = useCallback(
    async (id: number): Promise<void> => {
      await axios.delete(routes.crops.delete(id))
      await fetchAll()
    },
    [fetchAll],
  )

  const getCropById = useCallback(async (id: number): Promise<Crop> => {
    const res = await axios.get<Crop>(routes.crops.byId(id))
    return res.data
  }, [])

  const filterCrops = useCallback(async (params: CropFilterParams): Promise<Crop[]> => {
    const res = await axios.get<Crop[]>(routes.crops.filter, { params })
    return res.data
  }, [])

  const findByStatus = useCallback(async (status: CropStatus): Promise<Crop[]> => {
    const res = await axios.get<Crop[]>(routes.crops.findByStatus, { params: { status } })
    return res.data
  }, [])

  const logHarvest = useCallback(
    async (id: number, payload: LogHarvestPayload = {}): Promise<Crop> => {
      const res = await axios.put<Crop>(routes.crops.logHarvest(id), payload)
      await fetchAll()
      return res.data
    },
    [fetchAll],
  )

  return {
    crops,
    isLoading,
    error,
    refetch: fetchAll,
    createCrop,
    updateCrop,
    deleteCrop,
    getCropById,
    filterCrops,
    findByStatus,
    logHarvest,
  }
}
