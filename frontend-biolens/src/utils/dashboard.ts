export const LATIN_TO_COMMON: Record<string, string> = {
  'Solanum lycopersicum':  'Tomato',
  'Solanum tuberosum':     'Potato',
  'Zea mays':              'Corn',
  'Vitis vinifera':        'Grape',
  'Triticum aestivum':     'Wheat',
  'Glycine max':           'Soybean',
  'Helianthus annuus':     'Sunflower',
  'Capsicum annuum':       'Pepper',
  'Oryza sativa':          'Rice',
  'Hordeum vulgare':       'Barley',
  'Pyrus communis':        'Pear',
  'Malus domestica':       'Apple',
  'Prunus persica':        'Peach',
  'Prunus armeniaca':      'Apricot',
  'Prunus avium':          'Cherry',
  'Citrus sinensis':       'Orange',
  'Citrus limon':          'Lemon',
  'Mangifera indica':      'Mango',
  'Musa acuminata':        'Banana',
  'Fragaria ananassa':     'Strawberry',
  'Cucumis sativus':       'Cucumber',
  'Cucurbita pepo':        'Pumpkin',
  'Phaseolus vulgaris':    'Bean',
  'Pisum sativum':         'Pea',
  'Brassica oleracea':     'Cabbage',
  'Daucus carota':         'Carrot',
  'Beta vulgaris':         'Beet',
  'Allium cepa':           'Onion',
  'Allium sativum':        'Garlic',
  'Nicotiana tabacum':     'Tobacco',
  'Gossypium hirsutum':    'Cotton',
  'Coffea arabica':        'Coffee',
  'Saccharum officinarum': 'Sugarcane',
}

export function toCommonName(name: string): string {
  return LATIN_TO_COMMON[name] ?? name
}

export const PLANT_EMOJIS: Record<string, string> = {
  Tomato: '🍅',
  Corn: '🌽',
  Grape: '🍇',
  Wheat: '🌾',
  Soybean: '🫘',
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
