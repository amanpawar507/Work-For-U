import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    VStack,
    Text,
    Progress,
    Box
  } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import client from "../../utils/client";
import { getStatus } from "../../utils/helper";
import { UserContext } from "../contexts/userContext";

  export const ProjectDetailsModal = ({isOpen,onClose,projectDetails}) => {

    const {user} = useContext(UserContext);

    const [createdBy, setCreatedBy] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        if(!isOpen) return;
        setTimeout(() => {
            setLoading(false);
        },3000);
        return setLoading(true);
    },[isOpen])

    useEffect(() => {
        if(!projectDetails) return;
        const getEmployer= async() => {
            try {
                const {data} = await client.get(`http://localhost:5000/employer/${projectDetails.createdBy}`);
                setCreatedBy(data.fullName); 
            } catch (error) {
                console.log(error);
            }
        }
        const getFreelancer = async() => {
            try {
                const {data} = await client.get(`http://localhost:5000/freelancer/${projectDetails.assignedTo}`);
                 setAssignedTo(data.fullName); 
            } catch (error) {
                console.log(error);
            }
        }
        if(projectDetails.assignedTo) {
            getFreelancer();
        }
            getEmployer();

    },[projectDetails])

      return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>{projectDetails && projectDetails.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {loading && <Box p={"50px 0"}>
                    <Progress size="xs" isIndeterminate />
                </Box>}
                {!loading && projectDetails && <Box textAlign={'left'}>
                    <Text mb='5px'><strong>Name:</strong> {projectDetails.name}</Text>
                    <Text mb='5px'><strong>Description:</strong> {projectDetails.description}</Text>
                    <Text mb='5px'><strong>Tenure:</strong> {projectDetails.tenureMonths} months</Text>
                    <Text mb='5px'><strong>Skills Required:</strong> {projectDetails.skillsRequired.map((i,idx) => idx !== projectDetails.skillsRequired.length - 1 ?`${i.name}, `: i.name)}</Text>
                    <Text mb='5px'><strong>Pay /hour:</strong> ${projectDetails.hourlyPay}</Text>
                    <Text mb='5px'><strong>Hours /day:</strong> {projectDetails.hrsPerDay} hours</Text>
                    <Text mb='5px'><strong>Days /week:</strong> {projectDetails.daysPerWeek} days</Text>
                    <Text mb='5px'><strong>Status:</strong> {getStatus(projectDetails.status)}</Text>
                    <Text mb='5px'><strong>createdBy:</strong> {createdBy}</Text>
                    {projectDetails.status !== 0 && <Text><strong>Assigned to:</strong> {assignedTo}</Text>}
                    <Text mb='5px'><strong>Created on:</strong> {projectDetails.createdAt}</Text>
                </Box>}
            </ModalBody>
            </ModalContent>
        </Modal>
      )
  }