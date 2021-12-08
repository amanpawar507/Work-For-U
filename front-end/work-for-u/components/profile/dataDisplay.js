import { Box, Heading, Text } from "@chakra-ui/react"

export const DataDisplay = ({content,label}) => {
    return(
        <Box textAlign={'center'}>
            <Heading>{content}</Heading>
            <Text>{label}</Text>
        </Box>
    )
}