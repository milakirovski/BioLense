'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { routes } from '@/lib/routes'
import type { WeatherData } from '@/types'

interface UseWeatherReturn {
  weather: WeatherData | null
  isLoading: boolean
  error: string | null
}

export function useWeather(): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get<WeatherData>(routes.weather.current, {
          params: { lat: 41.9981, lon: 21.4254 },
        })
        setWeather(res.data)
      } catch {
        setError('Failed to load weather.')
      } finally {
        setIsLoading(false)
      }
    }
    void fetchWeather()
  }, [])

  return { weather, isLoading, error }
}
