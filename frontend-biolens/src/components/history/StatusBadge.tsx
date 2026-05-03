import { Badge } from '@chakra-ui/react'

interface StatusBadgeProps {
    status: string
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const getColorPalette = () => {
        switch (status.toLowerCase()) {
            case 'healthy':
                return 'green'
            case 'diseased':
                return 'red'
            case 'moderate':
            case 'risk':
                return 'orange'
            default:
                return 'gray'
        }
    }

    return (
        <Badge
            variant="subtle"
            colorPalette={getColorPalette()}
            borderRadius="full"
            px="3"
            py="0.5"
            textTransform="capitalize"
        >
            {status}
        </Badge>
    )
}