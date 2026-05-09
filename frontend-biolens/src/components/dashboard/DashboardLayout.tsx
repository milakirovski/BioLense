"use client";
import { VStack, Box, Flex } from "@chakra-ui/react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentDiagnoses } from "@/components/dashboard/RecentDiagnoses";
import { CropHealthScore } from "@/components/dashboard/CropHealthScore";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TaskManager } from "@/components/dashboard/TaskManager";
import { useDiagnosis } from "@/hooks/useDiagnosis";
import { useWeather } from "@/hooks/useWeather";
import { useAuth } from "@/context/AuthContext";

export function DashboardLayout() {
  const { recentDiagnoses, diagnoses, crops, stats } = useDiagnosis();
  const { weather, isLoading: weatherLoading } = useWeather();
  const { user } = useAuth();

  return (
    <Box px={{ base: 4, md: 6, lg: 10 }} pb={10}>
      <Box pt={6}>
        <DashboardHeader userName={user?.firstName} />
      </Box>
      <Flex
        gap={10}
        direction={{ base: "column", lg: "row" }}
        alignItems="flex-start"
      >
        <VStack flex="1" gap="4" align="stretch" minW="0" w="full">
          <DashboardStats stats={stats} />
          <WeatherWidget
            weather={weather}
            isLoading={weatherLoading}
            cropCount={crops.length}
          />
          <QuickActions />
          <RecentDiagnoses diagnoses={recentDiagnoses} />
        </VStack>
        <VStack
          w={{ base: "full", lg: "360px" }}
          align="stretch"
          flexShrink={0}
          gap="4"
          padding={0}
        >
          <CropHealthScore crops={crops} diagnoses={diagnoses} />
          <RecentActivity />
          <TaskManager />
        </VStack>
      </Flex>
    </Box>
  );
}
