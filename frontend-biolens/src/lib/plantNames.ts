const LATIN_TO_COMMON: Record<string, string> = {
  'Solanum lycopersicum': 'Tomato',
  'Lycopersicon esculentum': 'Tomato',
  'Zea mays': 'Corn',
  'Triticum aestivum': 'Wheat',
  'Solanum tuberosum': 'Potato',
  'Capsicum annuum': 'Pepper',
  'Cucumis sativus': 'Cucumber',
  'Glycine max': 'Soybean',
  'Oryza sativa': 'Rice',
  'Helianthus annuus': 'Sunflower',
  'Vitis vinifera': 'Grape',
  'Malus domestica': 'Apple',
  'Malus pumila': 'Apple',
  'Prunus persica': 'Peach',
  'Fragaria ananassa': 'Strawberry',
  'Phaseolus vulgaris': 'Bean',
  'Lactuca sativa': 'Lettuce',
  'Daucus carota': 'Carrot',
  'Beta vulgaris': 'Sugar Beet',
  'Gossypium hirsutum': 'Cotton',
  'Nicotiana tabacum': 'Tobacco',
  'Mangifera indica': 'Mango',
  'Citrus sinensis': 'Orange',
  'Citrus limon': 'Lemon',
  'Coffea arabica': 'Coffee',
  'Camellia sinensis': 'Tea',
  'Allium sativum': 'Garlic',
  'Allium cepa': 'Onion',
  'Brassica oleracea': 'Cabbage',
  'Spinacia oleracea': 'Spinach',
  'Cucurbita pepo': 'Pumpkin',
  'Citrullus lanatus': 'Watermelon',
  'Arachis hypogaea': 'Peanut',
  'Saccharum officinarum': 'Sugarcane',
  'Musa paradisiaca': 'Banana',
  'Musa acuminata': 'Banana',
  'Prunus domestica': 'Plum',
  'Prunus avium': 'Cherry',
  'Pyrus communis': 'Pear',
  'Cucumis melo': 'Melon',
  'Petroselinum crispum': 'Parsley',
  'Solanum melongena': 'Eggplant',
}

export function toCommonName(name: string | null | undefined): string {
  if (!name) return name ?? ''
  const exact = LATIN_TO_COMMON[name]
  if (exact) return exact
  // Try genus-only match
  const genus = name.split(' ')[0]
  for (const [latin, common] of Object.entries(LATIN_TO_COMMON)) {
    if (latin.split(' ')[0].toLowerCase() === genus.toLowerCase()) return common
  }
  return name
}
