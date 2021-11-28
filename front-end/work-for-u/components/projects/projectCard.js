import { Box, Button, Heading, HStack, IconButton, Text, VStack } from "@chakra-ui/react"
import { useState } from "react"
import {MdInfo,MdEdit,MdDelete} from "react-icons/md"

export const ProjectCard = ({name, status,onDetailsClick,onEditClick,onDeleteClick}) => {

    const [deleteOpen, setDeleteOpen] = useState(false);

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
        <Box p="10px" borderRadius={'10px'} background={'brand.500'} h={'155px'} position={"relative"}>
            <VStack h={'100%'} textAlign={'left'} justifyContent={'space-between'}>
                <Heading w='100%' maxHeight={'87px'} overflowY={'hidden'}>{name}</Heading>
                <HStack textAlign={'left'} w={'100%'} justifyContent={'space-between'}>
                    <Text>Status: {getStatus(status)}</Text>
                    <HStack>
                        <IconButton color={'brand.900'} icon={<MdInfo/>} onClick={() => onDetailsClick()}/>
                        <IconButton color={'brand.900'} icon={<MdEdit/>} onClick={() => onEditClick()}/>
                        <IconButton color={'brand.900'} icon={<MdDelete/>} onClick={() => setDeleteOpen(true)}/>
                    </HStack>
                </HStack>
            </VStack>
           { deleteOpen &&  
           <Box 
            minH={'80px'} 
            p={"10px"} 
            minW={"250px"} 
            borderRadius={"0 5px 5px 5px"} 
            position={"absolute"}
            bottom={"-80px"} 
            right={"-220px"}  
            zIndex={"999"} 
            background={"white"}
            boxShadow="md"
            >
                <Text>Are you sure?</Text>
                <br/>
                <HStack w={"100%"} justifyContent={"right"}>
                    <Button size={"sm"} colorScheme="green" onClick={() => setDeleteOpen(false)}>cancel</Button>
                    <Button size={"sm"} colorScheme="red" onClick={() =>{ onDeleteClick(); setDeleteOpen(false);}}>delete</Button>
                </HStack>     
            </Box>}
        </Box>
    )
}