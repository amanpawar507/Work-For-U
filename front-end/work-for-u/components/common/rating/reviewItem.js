import { Box, Heading, HStack, Text } from "@chakra-ui/react"
import { Avatar, CustomAvatar } from "../Avatar"
import { Rating } from "./rateModal"

export const ReviewItem = ({reviewer, date, title, review, rating}) => {
    return(
        <Box boxShadow={'md'} p="10px" w={'100%'} borderRadius={'10px'}>
            <HStack spacing={'20px'}>
                <CustomAvatar size={'md'} name={reviewer.fullName} isFreelancer={false} id={reviewer._id}/>
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