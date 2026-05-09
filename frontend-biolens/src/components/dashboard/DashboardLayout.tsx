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

export function DashboardLayout() {
  const { recentDiagnoses, stats } = useDiagnosis();

  return (
    <Box px={{ base: 4, md: 6, lg: 10 }} pb={10}>
      <Box pt={6}>
        <DashboardHeader />
      </Box>
      <Flex
        gap={10}
        direction={{ base: "column", lg: "row" }}
        alignItems="flex-start"
      >
        <VStack flex="1" gap="5" align="stretch" minW="0" w="full">
          <DashboardStats stats={stats} />
          <WeatherWidget />
          <QuickActions />
          <RecentDiagnoses diagnoses={recentDiagnoses} />
        </VStack>
        <VStack
          w={{ base: "full", lg: "400px" }}
          align="stretch"
          flexShrink={0}
          gap="14"
          padding={0}
        >
          <CropHealthScore />
          <RecentActivity />
          <TaskManager />
        </VStack>
      </Flex>
    </Box>
  );
}
