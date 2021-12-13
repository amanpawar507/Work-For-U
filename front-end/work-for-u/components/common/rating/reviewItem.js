import { Box, Flex, Heading, HStack, IconButton, Text } from "@chakra-ui/react"
import { MdDelete } from "react-icons/md"
import { getDateFormat } from "../../../utils/helper"
import { Avatar, CustomAvatar } from "../Avatar"
import { Rating } from "./rateModal"

export const ReviewItem = ({reviewer, date, title, review, rating, canDelete , handleDelete}) => {
    return(
        <Box boxShadow={'md'} p="10px" w={'100%'} borderRadius={'10px'}>
            <Flex justifyContent={'space-between'}>
                <HStack spacing={'20px'}>
                    <CustomAvatar size={'md'} name={reviewer.fullName} isFreelancer={false} id={reviewer._id}/>
                    <Box>
                        <Heading fontSize={'xl'}>{reviewer.fullName}</Heading>
                        <Rating disabled={true} rating={rating}/>
                    </Box>
                </HStack>
                <HStack spacing={'20px'}>
                    {canDelete && <IconButton cursor={'pointer'} variant={'ghost'} color={'black'} icon={<MdDelete/>} onClick={() => handleDelete()}/>}
                    <Text fontSize={'sm'}>{getDateFormat(date)}</Text>
                </HStack>
            </Flex>
            <Text m="10px 0" fontSize='lg' fontWeight={'bold'}>{title}</Text>
            <Text m="10px 0" fontSize='lg' fontStyle={'italic'} maxWidth={'100%'} isTruncated>"{review}"</Text>
        </Box>
    )
}