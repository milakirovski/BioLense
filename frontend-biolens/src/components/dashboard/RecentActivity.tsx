'use client'
import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import { getActivityDotColor } from '@/utils/dashboard'
import type { Activity } from '@/types'

const ACTIVITIES: Activity[] = [
  { id: 1, text: 'Early Blight detected on Tomato — Field A',     time: 'Today, 09:14',     type: 'error'   },
  { id: 2, text: 'Fungicide applied on Field A',                   time: 'Today, 08:00',     type: 'success' },
  { id: 3, text: 'Corn scan - Healthy on Field B',                 time: 'Yesterday, 14:30', type: 'success' },
  { id: 4, text: 'Powdery Mildew — treatment pending on Field C',  time: 'Mar 17, 11:00',    type: 'warning' },
]

export const RecentActivity = () => (
  <Box bg="white" p="6" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
    <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="0.08em" mb="5">
      RECENT ACTIVITY
    </Text>
    <VStack gap="4" align="stretch">
      {ACTIVITIES.map((activity) => (
        <HStack key={activity.id} gap="3" align="flex-start">
          <Box
            w="2"
            h="2"
            borderRadius="full"
            bg={getActivityDotColor(activity.type)}
            mt="1.5"
            flexShrink={0}
          />
          <VStack align="flex-start" gap="0" flex="1">
            <Text fontSize="xs" color="gray.700">{activity.text}</Text>
            <Text fontSize="xs" color="gray.400">{activity.time}</Text>
          </VStack>
        </HStack>
      ))}
    </VStack>
  </Box>
)
