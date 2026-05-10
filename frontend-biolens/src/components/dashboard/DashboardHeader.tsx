"use client";
import { Box, Heading, Text } from "@chakra-ui/react";
import { getGreeting } from "@/utils/dashboard";

interface DashboardHeaderProps {
  userName?: string;
}

export const DashboardHeader = ({
  userName = "User",
}: DashboardHeaderProps) => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box marginBottom={4}>
      <Heading size="2xl" color="green.800" fontWeight="bold">
        {getGreeting()}, {userName}
      </Heading>
      <Text color="gray.500" fontSize="sm" mt="1">
        Here's what's happening on your farm today - {today}
      </Text>
    </Box>
  );
};
