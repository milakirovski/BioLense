import { HStack, Icon, Text } from '@chakra-ui/react';

interface NavButtonProps {
    icon: any;
    label: string;
    active?: boolean;
}

export default function NavButton({
                                      icon,
                                      label,
                                      active = false,
                                  }: NavButtonProps) {
    return (
        <HStack
            px="4"
            py="3"
            borderRadius="md"
            bg={active ? 'green.50' : 'transparent'}
            color={active ? 'green.700' : 'gray.600'}
            cursor="pointer"
            transition="0.2s"
            _hover={{ bg: 'gray.50' }}
        >
            <Icon as={icon} />

            <Text fontWeight={active ? '600' : '400'}>
                {label}
            </Text>
        </HStack>
    );
}