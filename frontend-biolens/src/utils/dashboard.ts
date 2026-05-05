export const PLANT_EMOJIS: Record<string, string> = {
  Tomato: '🍅',
  Corn: '🌽',
  Grape: '🍇',
  Wheat: '🌾',
  Soybeans: '🫘',
  Rice: '🌾',
  Potato: '🥔',
  Sunflower: '🌻',
}

export function formatDiagnosisDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  if (diffDays === 0) return `Today, ${time}`
  if (diffDays === 1) return `Yesterday, ${time}`
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${time}`
}

export function getDiagnosisBadgeColor(isHealthy: boolean | null): string {
  if (isHealthy === true) return 'green'
  if (isHealthy === false) return 'orange'
  return 'gray'
}

export function getFieldHealthColor(score: number): string {
  if (score >= 80) return 'green'
  if (score >= 60) return 'orange'
  return 'red'
}

export function getActivityDotColor(type: 'error' | 'success' | 'warning'): string {
  if (type === 'error') return 'red.400'
  if (type === 'success') return 'green.400'
  return 'orange.400'
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}
