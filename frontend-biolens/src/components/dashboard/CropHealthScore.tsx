"use client";
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { getFieldHealthColor } from "@/utils/dashboard";

const FIELDS = [
  { name: "Field A", score: 45 },
  { name: "Field B", score: 90 },
  { name: "Field C", score: 60 },
  { name: "Field D", score: 88 },
  { name: "Field E", score: 35 },
];

const overallHealth = Math.round(
  FIELDS.reduce((sum, f) => sum + f.score, 0) / FIELDS.length,
);
const healthyFields = FIELDS.filter((f) => f.score >= 80).length;

export const CropHealthScore = () => (
  <Box
    bg="white"
    p="6"
    borderRadius="xl"
    boxShadow="sm"
    border="1px solid"
    borderColor="gray.100"
  >
    <Text
      fontSize="xs"
      fontWeight="bold"
      color="gray.500"
      letterSpacing="0.08em"
      mb="5"
    >
      CROP HEALTH SCORE
    </Text>
    <VStack gap="4">
      {/* Donut chart */}
      <Box position="relative" w="120px" h="120px" mx="auto">
        <Box
          w="full"
          h="full"
          borderRadius="full"
          style={{
            background: `conic-gradient(#276749 0% ${overallHealth}%, #e2e8f0 ${overallHealth}% 100%)`,
          }}
        />
        <Flex
          position="absolute"
          top="16px"
          left="16px"
          right="16px"
          bottom="16px"
          bg="white"
          borderRadius="full"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontWeight="bold" fontSize="xl" color="green.800">
            {overallHealth}%
          </Text>
        </Flex>
      </Box>

      <VStack gap="0.5" textAlign="center">
        <Text fontWeight="bold" fontSize="sm">
          Farm Health
        </Text>
        <Text fontSize="xs" color="gray.500">
          {healthyFields} of {FIELDS.length} fields in good condition
        </Text>
      </VStack>

      {/* Field health bars */}
      <VStack gap="2.5" align="stretch" w="full">
        {FIELDS.map((f) => {
          const color = getFieldHealthColor(f.score);
          return (
            <HStack key={f.name} gap="2">
              <Box
                w="2"
                h="2"
                borderRadius="full"
                bg={`${color}.400`}
                flexShrink={0}
              />
              <Text fontSize="xs" color="gray.600" w="14">
                {f.name}
              </Text>
              <Box
                flex="1"
                h="1.5"
                bg="gray.100"
                borderRadius="full"
                overflow="hidden"
              >
                <Box
                  w={`${f.score}%`}
                  h="full"
                  bg={`${color}.500`}
                  borderRadius="full"
                />
              </Box>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="gray.600"
                w="8"
                textAlign="right"
              >
                {f.score}%
              </Text>
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  </Box>
);
