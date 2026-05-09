'use client'
import { Box, Flex, HStack, Skeleton, Text, VStack } from '@chakra-ui/react'
import type { WeatherData } from '@/types'

interface WeatherWidgetProps {
  weather: WeatherData | null
  isLoading?: boolean
  cropCount?: number
}

function getPrecipIcon(prob: number): string {
  if (prob >= 60) return '🌧️'
  if (prob >= 20) return '⛅'
  return '☀️'
}

function getConditionText(prob: number): string {
  if (prob >= 60) return 'Rainy'
  if (prob >= 20) return 'Partly cloudy'
  return 'Sunny'
}

function getDayLabel(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })
}

export const WeatherWidget = ({ weather, isLoading, cropCount }: WeatherWidgetProps) => {
  if (isLoading || !weather) {
    return <Skeleton h="160px" borderRadius="2xl" startColor="green.600" endColor="green.800" />
  }

  const today = weather.forecast[0]
  const temp = Math.round(today.temperatureMax)
  const icon = getPrecipIcon(today.precipitationProbability)
  const condition = getConditionText(today.precipitationProbability)
  const forecast = weather.forecast.slice(0, 5).map((d) => ({
    day: getDayLabel(d.date),
    icon: getPrecipIcon(d.precipitationProbability),
    temp: Math.round(d.temperatureMax),
  }))

  return (
    <Box bg="green.700" borderRadius="2xl" p="6" color="white">
      <Flex justify="space-between" align="flex-start" gap="6">
        <VStack align="center" gap="3" flex="1">
          <Text fontSize="xs" fontWeight="medium" color="green.200">
            Today — Skopje
          </Text>

          <HStack gap="3" align="center">
            <Text fontSize="5xl" fontWeight="bold" lineHeight="1">{temp}°C</Text>
            <Text fontSize="3xl">{icon}</Text>
          </HStack>

          <Text fontSize="sm" color="green.200">{condition}</Text>

          <HStack mt="3" w="80%" justify="space-evenly">
            {forecast.map((day) => (
              <VStack key={day.day} gap="1" align="center" flex="1">
                <Text fontSize="xs" color="green.300">{day.day}</Text>
                <Text fontSize="xl">{day.icon}</Text>
                <Text fontSize="xs" fontWeight="bold">{day.temp}°</Text>
              </VStack>
            ))}
          </HStack>
        </VStack>

        <Box
          bg="green.600"
          borderRadius="xl"
          p="5"
          flex="1"
          maxW="280px"
          opacity={0.95}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Text fontSize="sm" fontWeight="bold" color="white">
            {weather.wateringRecommendation}
          </Text>
          {cropCount != null && cropCount > 0 && (
            <Text fontSize="xs" color="green.200" mt="2">
              Applies to all {cropCount} fields
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  )
}
