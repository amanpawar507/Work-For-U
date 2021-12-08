import { HStack, SimpleGrid, useDisclosure } from "@chakra-ui/react"
import { useState } from "react";
import { FreelancerCard } from "../dashboard/freelancerCard"
import { RequestModal } from "../dashboard/requestModal"

export const FreelancerList = ({list}) => {
    const [selectedFreelancer, setSelectedFreelancer] = useState(null);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const handleRequestOpen = freelancer => {
        setSelectedFreelancer(freelancer);
        onOpen();
    }
    return(
       list &&  <>
            <SimpleGrid columns={[2, null, 3]} spacing='40px'>
                {list.map(i => 
                    <FreelancerCard 
                        id={i._id}
                        name={i.fullName} 
                        rating={i.overallRating} 
                        location={i.location}
                        onRequest={() => handleRequestOpen(i)}    
                    />    
                )}
            </SimpleGrid>
            <RequestModal isOpen={isOpen} onClose={() => onClose()} selectedFreelancer={selectedFreelancer}/>
        </>

    )
}