import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Textarea,
    HStack,
    FormControl,
    FormLabel,
    Box,
    Progress,
    Select,
    useToast
  } from "@chakra-ui/react"

import { useContext, useEffect,useState } from "react"
import client from "../../utils/client";
import { UserContext } from "../contexts/userContext";


  export const RequestModal = ({isOpen, onClose, selectedFreelancer}) => {

    const [availableProjects, setAvailableProjects] = useState([]);
    const [sending, setSending] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null)
    const [loading, setLoading] = useState(false);

    const {user} = useContext(UserContext);

    const toast = useToast();
    const errorAlert = error => {
        toast({
            title: error.response? 
                    error.response.data.error : 
                    error.message ? 
                    error.message : 
                    error,
            status: "error",
            duration: 2000
        });
    }

    useEffect(() => {
        if(!user || !selectedFreelancer || !isOpen) return;
        const getUserProjects = async() => {
            try {
                setLoading(true);
                const {data} = await client.get(`http://localhost:5000/project/all/employer/${user._id}`);
                //console.log("data: ",data);
                if(data.length > 0) {
                    let available = [];
                    data.forEach(el => {
                        if(!el.requested.includes(selectedFreelancer._id) && !el.assignedTo) available.push(el);
                    });
                    //console.log(available);
                    setAvailableProjects(available);
                }else{
                    setAvailableProjects([]);
                }
                setLoading(false);
            } catch (error) {
                errorAlert(error);
            }
        }
        getUserProjects();
    },[user,selectedFreelancer,isOpen])

    const warn = text => {
        toast({
            title: text,
            status: "warning",
            duration: 2000
        });
    }

    const handleAddRequest = async projectId => {
        try {
            if(!selectedProject || selectedProject.trim().length === 0) {
                warn("Please select a project");
                return;
            }
            setSending(true);
            const {data} = await client.post("http://localhost:5000/project/requests/add",{freelancerId: selectedFreelancer._id, projectId: projectId});
            if(data.addedRequest) toast({
                title: "Request sent successfully",
                status:"success",
                duration: 2000
            });
            setSending(false);
            onClose(); 
        } catch (error) {
            //console.log(error);
            toast({
                title: "Request could not be sent",
                status:"error",
                duration: 2000
            });
            onClose();
        }
    }


      return(
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Send Request</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            {loading && <Box p={"50px 0"}>
                        <Progress size="xs" isIndeterminate />
                    </Box>}
                {!loading && <form onSubmit={e => {e.preventDefault(); handleAddRequest(selectedProject)}}>
                    <FormControl isRequired>
                        <FormLabel htmlFor="name">Select project</FormLabel>
                        <Select placeholder="Select option" onChange={e => setSelectedProject(e.target.value)} value={selectedProject}> 
                            {availableProjects.map((i,idx) => <option key={idx} value={i._id}>{i.name}</option>)}
                        </Select>
                        <Button
                            mt={4}
                            ml="80%"
                            colorScheme="teal"
                            type="submit"
                            isLoading={sending}
                        >
                            Submit
                        </Button>
                    </FormControl>
                </form>}
            </ModalBody>
            </ModalContent>
        </Modal>
      )
  }