import {
    Box,
    HStack,
    VStack,
    Text,
    Icon,
} from '@chakra-ui/react';

import { FiDownload } from 'react-icons/fi';
import { IconType } from 'react-icons';

interface ExportOptionProps {
    icon: IconType;
    title: string;
    desc: string;
    color: string;
}

export default function ExportOption({
    icon,
    title,
    desc,
    color,
}: ExportOptionProps) {
    return (
        <HStack
            w="full"
            p="3"
            border="1px solid"
            borderColor="gray.50"
            borderRadius="lg"
            _hover={{
                bg: 'gray.50',
                cursor: 'pointer',
            }}
            transition="0.2s"
        >
            <Box
                p="2"
                bg={`${color}.50`}
                borderRadius="md"
                color={`${color}.500`}
            >
                <Icon as={icon} />
            </Box>

            <VStack
                align="flex-start"
                gap="0"
                flex="1"
            >
                <Text
                    fontSize="sm"
                    fontWeight="bold"
                >
                    {title}
                </Text>

                <Text
                    fontSize="xs"
                    color="gray.500"
                >
                    {desc}
                </Text>
            </VStack>

            <Icon
                as={FiDownload}
                color="gray.300"
                fontSize="xs"
            />
        </HStack>
    );
}