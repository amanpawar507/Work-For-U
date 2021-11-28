import { useState, useEffect } from "react";
import { HStack, toast, useDisclosure, useToast } from "@chakra-ui/react"
import { FreelancerCard } from "./freelancerCard"
import axios from 'axios';
import { RequestModal } from "./requestModal";

export const Dashboard = () => {

    const [listofFreelancers, setListOfFreelancers] = useState([]);
    const [selectedFreelancer, setSelectedFreelancer] = useState(null);
    const [sending, setSending] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure();

    const toast = useToast();

    useEffect(() => {
        const getFreelancers = async() => {
            const {data} = await axios.get("http://localhost:5000/freelancer/all");
            setListOfFreelancers(data);
        }
        getFreelancers();
    },[])

    const handleRequestOpen = freelancer => {
        setSelectedFreelancer(freelancer);
        onOpen();
    }

    const handleAddRequest = async projectId => {
        try {
            setSending(true);
            const {data} = await axios.post("http://localhost:5000/project/requests/add",{freelancerId: selectedFreelancer._id, projectId: projectId});
            if(data.addedRequest) toast({
                title: "Request sent successfully",
                status:"success",
                duration: 2000
            });
            setSending(false);
            onClose(); 
        } catch (error) {
            console.log(error);
            toast({
                title: "Request could not be sent",
                status:"error",
                duration: 2000
            });
            onClose();
        }
    }

    return (
        <>
            <HStack spacing={'20px'}>
                {listofFreelancers.map(i => 
                    <FreelancerCard 
                        name={i.fullName} 
                        rating={i.overallRating} 
                        skill={i.skills[Math.floor(Math.random() * i.skills.length - 1) + 1].name}
                        onRequest={() => handleRequestOpen(i)}    
                    />    
                )}
            </HStack>
            <RequestModal isOpen={isOpen} onClose={() => onClose()} selectedFreelancer={selectedFreelancer} onSubmit={handleAddRequest} submitting={sending}/>
        </>

    )
} 