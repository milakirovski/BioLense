"use client";
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";

const FORECAST = [
  { day: "Thu", icon: "☀️", temp: 24 },
  { day: "Fri", icon: "⛅", temp: 21 },
  { day: "Sat", icon: "☀️", temp: 17 },
  { day: "Sun", icon: "🌧️", temp: 15 },
  { day: "Mon", icon: "☀️", temp: 23 },
];

export const WeatherWidget = () => (
  <Box bg="green.700" borderRadius="2xl" p="6" color="white">
    <Flex justify="space-between" align="flex-start" gap="6">
      {/* LEFT SIDE */}
      <VStack align="center" gap="3" flex="1">
        <Text fontSize="xs" fontWeight="medium" color="green.200">
          Today — Skopje
        </Text>

        <HStack gap="3" align="center">
          <Text fontSize="5xl" fontWeight="bold" lineHeight="1">
            22°C
          </Text>
          <Text fontSize="3xl">⛅</Text>
        </HStack>

        <Text fontSize="sm" color="green.200">
          Partly cloudy · Rain expected Sunday
        </Text>

        {/* FORECAST */}
        <HStack mt="3" w="80%" justify="space-evenly">
          {FORECAST.map((day) => (
            <VStack key={day.day} gap="1" align="center" flex="1">
              <Text fontSize="xs" color="green.300">
                {day.day}
              </Text>
              <Text fontSize="xl">{day.icon}</Text>
              <Text fontSize="xs" fontWeight="bold">
                {day.temp}°
              </Text>
            </VStack>
          ))}
        </HStack>
      </VStack>

      {/* RIGHT SIDE */}
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
        <Text fontSize="sm" fontWeight="bold" color="white" whiteSpace="nowrap">
          Don't water today — rain coming
        </Text>

        <Text fontSize="xs" color="green.200" mt="2">
          Applies to all 5 fields
        </Text>
      </Box>
    </Flex>
  </Box>
);
