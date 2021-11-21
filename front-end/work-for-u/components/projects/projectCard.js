import { Box, Button, Heading, HStack, IconButton, Text, VStack } from "@chakra-ui/react"
import {MdInfo,MdEdit} from "react-icons/md"

export const ProjectCard = ({name, status}) => {

    const getStatus = status => {
        switch (status) {
            case 0:
                return "created"
            case 1:
                return "accepted"
            case 2:
                return "progress"
            case 3: 
                return "completed"
            default:
                break;
        }
    }

    return(
        <Box p="10px" borderRadius={'10px'} background={'brand.500'} h={'155px'}>
            <VStack h={'100%'} textAlign={'left'} justifyContent={'space-between'}>
                <Heading w='100%' maxHeight={'87px'} overflowY={'hidden'}>{name}</Heading>
                <HStack textAlign={'left'} w={'100%'} justifyContent={'space-between'}>
                    <Text>Status: {getStatus(status)}</Text>
                    <HStack>
                        <IconButton color={'brand.900'} icon={<MdInfo/>}/>
                        <IconButton color={'brand.900'} icon={<MdEdit/>}/>
                    </HStack>
                </HStack>
            </VStack>
        </Box>
    )
}