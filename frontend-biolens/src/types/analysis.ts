export type CropOption = {
  id: number
  plantType: string
  fieldName: string
}

export type DiagnosisEntry = {
  id: number
  cropId: number
  plantName: string
  diseaseName: string | null
  confidence: number | null
  isHealthy: boolean | null
  treatment: string | null
  diagnosedAt: string
}

export type PlantIdResponse = {
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

export type AnalysisResult = {
  plantName: string
  diseaseName: string
  confidence: number | null
  severity: string
  stage: string
  fieldLabel: string
  scannedAt: string
  treatmentTips: string[]
}
