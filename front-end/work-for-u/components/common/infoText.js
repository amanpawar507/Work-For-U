import { Text } from "@chakra-ui/react"

export const InfoText = ({label,content}) => {
    return (
        <Text mb='5px'><strong>{label}:</strong> {content}</Text>
    )
} 