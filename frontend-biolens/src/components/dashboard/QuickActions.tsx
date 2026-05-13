"use client";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { FiBarChart2, FiCamera, FiClock, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/shared/StatCard";

const ACTIONS = [
  {
    icon: FiCamera,
    title: "Scan plant",
    description: "Upload a new image",
    href: "/analysis",
  },
  {
    icon: FiPlus,
    title: "Add field",
    description: "Manage your fields",
    href: "/fields",
  },
  {
    icon: FiBarChart2,
    title: "Export report",
    description: "PDF or Excel",
    href: "/history",
  },
  {
    icon: FiClock,
    title: "View history",
    description: "Past diagnoses",
    href: "/history",
  },
];

export const QuickActions = () => {
  const router = useRouter();

  return (
    <Box>
      <Text
        fontSize="xs"
        fontWeight="bold"
        color="gray.500"
        letterSpacing="0.08em"
        mb="3"
      >
        QUICK ACTIONS
      </Text>
      <SimpleGrid columns={{ base: 2, xl: 4 }} gap="4">
        {ACTIONS.map((action) => (
          <StatCard
            key={action.title}
            variant="action"
            icon={action.icon}
            title={action.title}
            description={action.description}
            onClick={() => router.push(action.href)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};
