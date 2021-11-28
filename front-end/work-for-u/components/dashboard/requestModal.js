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
    toast
  } from "@chakra-ui/react"
import axios from "axios";
import { useContext, useEffect,useState } from "react"
import { UserContext } from "../contexts/userContext";


  export const RequestModal = ({isOpen, onClose, selectedFreelancer,handleSubmit, submitting,onSubmit}) => {

    const [availableProjects, setAvailableProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null)
    const [loading, setLoading] = useState(false);

    const {user} = useContext(UserContext);

    useEffect(() => {
        if(!user || !selectedFreelancer || !isOpen) return;
        const getUserProjects = async() => {
            try {
                setLoading(true);
                const {data} = await axios.get(`http://localhost:5000/project/all/employer/${user._id}`);
                console.log("data: ",data);
                if(data.length > 0) {
                    let available = [];
                    data.forEach(el => {
                        if(!el.requested.includes(selectedFreelancer._id)) available.push(el);
                    });
                    console.log(available);
                    setAvailableProjects(available);
                }else{
                    setAvailableProjects([]);
                }
                setLoading(false);
            } catch (error) {
                toast({
                    title: error.message? error.message : error,
                    status: "error",
                    duration: 2000
                });
            }
        }
        getUserProjects();
    },[user,selectedFreelancer,isOpen])


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
                {!loading && <form onSubmit={e => {e.preventDefault(); onSubmit(selectedProject)}}>
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
                            isLoading={submitting}
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