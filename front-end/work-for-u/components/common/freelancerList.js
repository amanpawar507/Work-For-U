import { HStack, SimpleGrid, useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuIcon,
    MenuCommand,
    MenuDivider,
    Button,
    Select,
} from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FreelancerCard } from "../dashboard/freelancerCard"
import { RequestModal } from "../dashboard/requestModal"

export const FreelancerList = ({list}) => {
    const [selectedFreelancer, setSelectedFreelancer] = useState(null);
    const [resultList, setResultList] = useState([]);
    const {isOpen, onOpen, onClose} = useDisclosure();

    useEffect(()=> {
        if(!list) return;
        setResultList(list);
    },[list])


    const handleRequestOpen = freelancer => {
        setSelectedFreelancer(freelancer);
        onOpen();
    }

  

     return(
        <>
            <SimpleGrid mt='10px' columns={[2, null, 3]} spacing='40px'>
                {resultList.map(i => 
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