import { Badge, Box, Button, Heading, HStack, IconButton, Text, useToast, VStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Tooltip,
} from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router";
import { useContext, useState } from "react"
import {MdInfo,MdEdit,MdDelete, MdMenu,MdPerson,MdGrade} from "react-icons/md"
import client from "../../utils/client";
import { getColorScheme, getStatus } from "../../utils/helper";
import { UserContext } from "../contexts/userContext";

export const ProjectCard = (
    {id, 
    name, 
    status,
    assignedTo,
    assignedBy,
    reviewed,
    onDetailsClick,
    onEditClick,
    onDeleteClick,
    onUpdateClick,
    onRateClick,
    setUpdatedRequest}
    ) => {

    const [deleteOpen, setDeleteOpen] = useState(false);

    const {isFreelancer,user} = useContext(UserContext);

    const [accepting, setAccepting] = useState(false);
    const [rejecting, setRejecting] = useState(false);

    const toast = useToast();
    const router = useRouter();



    const handleAcceptReject = async status => {
        try {
            if(status === "accept") {
                setAccepting(true);
            }else{
                setRejecting(true);
            }
            const {data} = await client.patch("http://localhost:5000/project/requests/update",{
                freelancerId: user._id,
                projectId: id,
                status: status
            });
            setUpdatedRequest(data);
            setAccepting(false);
            setRejecting(false);
        } catch (error) {
            toast({
                title: error.response ? error.response.data.error : error,
                status: "error",
                duration: 2000
            })
            setAccepting(false);
            setRejecting(false);
        }
    }

    return(
        <Box minW={'256px'} boxShadow={"md"} p="10px" borderRadius={'10px'} background={'brand.700'} h={'155px'} position={"relative"}>
            <VStack h={'100%'} textAlign={'left'} justifyContent={'space-between'}>
                <Heading w='100%' maxHeight={'87px'} overflowY={'hidden'}>{name}</Heading>
                <HStack textAlign={'left'} w={'100%'} justifyContent={'space-between'}>
                    {<Badge colorScheme={getColorScheme(status)} borderRadius={'2px'}>{getStatus(status)}</Badge>}
                    <HStack ml={'auto'}>
                        {status !== 0 && isFreelancer && <Button colorScheme={"gray"} size={'sm'} onClick={() => onUpdateClick()}>Update</Button>}
                        {!isFreelancer &&  status !== 3 &&  status !== 4 && 
                        <Tooltip label="update">
                            <IconButton color={'brand.900'} icon={<MdEdit/>} onClick={() => onEditClick()}/>
                        </Tooltip>
                        }
                        {!isFreelancer &&  status !== 3 &&  status !== 4 && 
                        <Tooltip label="Delete">
                            <IconButton color={'brand.900'} icon={<MdDelete/>} onClick={() => setDeleteOpen(true)}/>
                        </Tooltip>
                        }
                        {!isFreelancer &&  (status === 3 ||  status === 4) && <Button color={'black'} bg={"yellow.400"} leftIcon={<MdGrade/>} disabled={reviewed} onClick={() => onRateClick()}>{reviewed ? "Rated" : "Rate"}</Button> }
                        {isFreelancer && status === 0 && <Button isLoading={accepting} isDisabled={rejecting} size={'sm'} variant={"solid"} colorScheme={'green'} onClick={() => handleAcceptReject("accept")}>Accept</Button>}
                        {isFreelancer && status === 0 && <Button isLoading={rejecting} isDisabled={accepting}  size={'sm'} variant={"solid"} colorScheme={'red'}  onClick={() => handleAcceptReject("reject")}>Reject</Button>}
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                aria-label='Options'
                                icon={<MdMenu />}
                                color={'brand.900'} 
                                closeOnSelect
                            />
                            <MenuList>
                                <MenuItem icon={<MdInfo />} onClick={() => onDetailsClick()}>
                                    Project Info
                                </MenuItem>
                                {!isFreelancer && assignedTo && 
                                <MenuItem icon={<MdPerson />} onClick={() => router.push(`/freelancer/${assignedTo}`)}>
                                    Freelancer
                                </MenuItem>}
                                {isFreelancer && <MenuItem icon={<MdPerson />} onClick={() => router.push(`/employer/${assignedBy}`)}>
                                    Employer
                                </MenuItem>}
                            </MenuList>
                        </Menu>            
                        {/* <IconButton color={'brand.900'} icon={<MdInfo/>} onClick={() => onDetailsClick()}/> */}
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