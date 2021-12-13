import { Text } from "@chakra-ui/react"

export const InfoText = ({label,content}) => {
    return (
        <Text w={'100%'} mb='5px'><strong className="profile-txt">{label}:</strong> {content}</Text>
    )
} 