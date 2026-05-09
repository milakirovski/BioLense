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

// ─── Weather ─────────────────────────────────────────────────────────────────

export interface ForecastDay {
  day: string
  icon: string
  temp: number
}
