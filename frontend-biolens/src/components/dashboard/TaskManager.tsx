'use client'
import { useState } from 'react'
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import type { Task } from '@/types'

const INITIAL_TASKS: Task[] = [
  { id: 1, label: 'Apply fungicide on Field A',  due: 'Done',   completed: true  },
  { id: 2, label: 'Scan grapes - Field C',        due: 'Today',  completed: false },
  { id: 3, label: 'Water Field D (if no rain)',   due: 'Sat',    completed: false },
  { id: 4, label: 'Export monthly report',        due: 'Mar 31', completed: false },
]

export const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)

  const toggle = (id: number) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))

  return (
    <Box bg="white" p="6" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
      <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="0.08em" mb="5">
        TASK MANAGER
      </Text>
      <VStack gap="3" align="stretch">
        {tasks.map((task) => (
          <HStack key={task.id} gap="3" cursor="pointer" onClick={() => toggle(task.id)}>
            <Flex
              w="4"
              h="4"
              borderRadius="sm"
              border={task.completed ? 'none' : '1.5px solid'}
              borderColor="gray.300"
              bg={task.completed ? 'green.500' : 'white'}
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
              transition="all 0.15s"
            >
              {task.completed && (
                <Text color="white" fontSize="9px" lineHeight="1" fontWeight="bold">✓</Text>
              )}
            </Flex>
            <Text
              fontSize="xs"
              flex="1"
              color={task.completed ? 'gray.400' : 'gray.700'}
              textDecoration={task.completed ? 'line-through' : 'none'}
            >
              {task.label}
            </Text>
            <Text fontSize="xs" color="gray.400" flexShrink={0}>{task.due}</Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  )
}
