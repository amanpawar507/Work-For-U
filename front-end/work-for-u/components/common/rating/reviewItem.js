import { Avatar, Box, Heading, HStack, Text } from "@chakra-ui/react"
import { Rating } from "./rateModal"

export const ReviewItem = ({reviewer, date, title, review, rating}) => {
    return(
        <Box boxShadow={'md'} p="10px" w={'48%'} borderRadius={'10px'}>
            <HStack spacing={'20px'}>
                <Avatar size={'md'} name={reviewer.fullName}/>
                <Box>
                    <Heading fontSize={'xl'}>{reviewer.fullName}</Heading>
                    <Rating disabled={true} rating={rating}/>
                </Box>
            </HStack>
            <Text m="10px 0" fontSize='lg' fontWeight={'bold'}>{title}</Text>
            <Text m="10px 0" fontSize='lg' fontStyle={'italic'} maxWidth={'100%'} isTruncated>"{review}"</Text>
        </Box>
    )
}