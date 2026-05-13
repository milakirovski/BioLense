import { Badge, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import {
  PLANT_EMOJIS,
  formatDiagnosisDate,
  getDiagnosisBadgeColor,
  toCommonName,
} from "@/utils/dashboard";
import type { Diagnosis } from "@/types/diagnosis";

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
}

export const DiagnosisCard = ({ diagnosis }: DiagnosisCardProps) => {
  const commonName = toCommonName(diagnosis.plantName)
  const emoji = PLANT_EMOJIS[commonName] ?? "🌿";
  const badgeColor = getDiagnosisBadgeColor(diagnosis.isHealthy);
  const badgeLabel = diagnosis.isHealthy
    ? "Healthy"
    : (diagnosis.diseaseName ?? "Diseased");
  const fieldLabel = diagnosis.fieldName ?? '—';

  return (
    <HStack
      bg="white"
      p="4"
      borderRadius="xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
      gap="4"
      _hover={{ bg: "gray.50" }}
      transition="background 0.2s"
    >
      <Flex
        w="10"
        h="10"
        borderRadius="full"
        bg="green.50"
        alignItems="center"
        justifyContent="center"
        fontSize="xl"
        flexShrink={0}
      >
        {emoji}
      </Flex>

      <VStack align="flex-start" gap="0" flex="1" minW="0">
        <Text fontWeight="bold" fontSize="sm" truncate>{commonName}</Text>
        <Text fontSize="xs" color="gray.500" truncate>{fieldLabel}</Text>
        <Text fontSize="xs" color="gray.400" suppressHydrationWarning>
          {formatDiagnosisDate(diagnosis.diagnosedAt)}
          {diagnosis.confidence !== null
            ? ` · ${Math.round(diagnosis.confidence)}% confidence`
            : ""}
        </Text>
      </VStack>

      <Badge
        variant="subtle"
        colorPalette={badgeColor}
        borderRadius="full"
        px="3"
        py="0.5"
        flexShrink={0}
        whiteSpace="nowrap"
      >
        {badgeLabel}
      </Badge>
    </HStack>
  );
};
