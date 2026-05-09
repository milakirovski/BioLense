// ─── Diagnosis ───────────────────────────────────────────────────────────────

export interface Diagnosis {
  id: number
  cropId: number
  plantName: string
  fieldName?: string
  diseaseName: string | null
  confidence: number | null
  isHealthy: boolean | null
  treatment: string | null
  diagnosedAt: string
}

export interface DiagnosisStats {
  activeFields: number
  totalScans: number
  issuesFound: number
  treated: number
}

// ─── Field ────────────────────────────────────────────────────────────────────

export interface Field {
  name: string
  score: number
}

// ─── Activity ────────────────────────────────────────────────────────────────

export type ActivityType = 'error' | 'success' | 'warning'

export interface Activity {
  id: number
  text: string
  time: string
  type: ActivityType
}

// ─── Task ─────────────────────────────────────────────────────────────────────

export interface Task {
  id: number
  label: string
  due: string
  completed: boolean
}

// ─── Crop ─────────────────────────────────────────────────────────────────────

export type CropStatus = 'ACTIVE' | 'HARVESTED'

export interface CreateCropPayload {
  plantType: string
  fieldName: string
  areaHectares: number
  plantedAt: string
  expectedHarvestAt?: string
  notes?: string
}

export interface UpdateCropPayload {
  plantType?: string
  fieldName?: string
  areaHectares?: number
  plantedAt?: string
  expectedHarvestAt?: string
  notes?: string
  status?: CropStatus
}

export interface LogHarvestPayload {
  yieldKgPerHa?: number
}

export interface CropFilterParams {
  plantType?: string
  fieldName?: string
  status?: CropStatus
  plantedAfter?: string
  plantedBefore?: string
  harvestAfter?: string
  harvestBefore?: string
}

export interface Crop {
  id: number
  userId: number
  plantType: string
  fieldName: string
  areaHectares: number
  plantedAt: string
  expectedHarvestAt: string | null
  harvestedAt: string | null
  yieldKgPerHa: number | null
  status: string
  notes: string | null
  createdAt: string
  daysToHarvest: number | null
  daysSincePlanting: number
  daysUntilHarvest: number | null
}

// ─── Weather ─────────────────────────────────────────────────────────────────

export interface ForecastDay {
  day: string
  icon: string
  temp: number
}

export interface DailyForecast {
  date: string
  temperatureMax: number
  temperatureMin: number
  precipitationMm: number
  precipitationProbability: number
  humidityMax: number
  windSpeedMax: number
}

export interface WeatherData {
  forecast: DailyForecast[]
  wateringRecommendation: string
}
