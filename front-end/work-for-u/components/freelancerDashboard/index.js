import { Box, HStack, Stat, StatHelpText, StatLabel, StatNumber, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/contexts/userContext";
import { ProjectCard } from "../../components/projects/projectCard";
import client from "../../utils/client";
import { EmptyAlert } from "../common/emptyAlert";
import { ProjectDetailsModal } from "../projects/projectDetailsModal";
import { UpdateStatusModal } from "./updateStatusModal";

export const FreelancerDashboard = () => {

    const [recentProjects, setRecentProjects] = useState([]);
    const [earnings, setEarnings] = useState(90);
    const [selectedProject,setSelectedProject] = useState(null);

    const {user} = useContext(UserContext);

    const router = useRouter();

    const toast = useToast();

    const {isOpen, onOpen, onClose} = useDisclosure();
    const {isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose} = useDisclosure();

    useEffect(() => {
        if(!user) return;
        const getData = async() => {
            try {
                const {data} = await client.get(`http://localhost:5000/project/all/freelancer/${user._id}`);
                console.log(data);
                if(data.length > 3) {
                    setRecentProjects(data.slice(0,2))
                }else{
                    setRecentProjects(data)
                }
                let total = 0;
                data.forEach(element => {
                    if(element.status === 3) total += element.hourlyPay * 8 * 30 * element.tenureMonths
                });
                setEarnings(total);
            } catch (error) {
                if(error.statusCode === 401) router.push("/logout");
                console.log(error);
                toast({
                    title: error.message? error.message : error,
                    status: "error",
                    duration: 2000
                });
            }
        }
        getData();
    },[user])

    const handleDetailsClick = project => {
        setSelectedProject(project);
        onDetailsOpen();
    }

    const handleUpdateClick = project => {
        onOpen();
        setSelectedProject(project);
    }

    const setUpdatedProject = updated => {
        setRecentProjects(prevValue => {
            return prevValue.map(i => i._id === updated._id ? updated : i);
        });
        toast({
            title: "Project status updated successfully",
            status: "success",
            duration: 2000
        })
        onClose();
    }

    return(
            <Box>
                <Text color="black" fontSize={'2xl'} fontWeight={'bold'} mb='10px' borderBottom='1px solid black'>Earnings till date</Text>
                <Stat>
                    <StatLabel>Approx. Earnings</StatLabel>
                    <StatNumber fontSize={'3xl'}>${earnings}</StatNumber>
                    <StatHelpText>Till now</StatHelpText>
                </Stat>
                <Text color="black" fontSize={'2xl'} fontWeight={'bold'} mb='10px' borderBottom='1px solid black'>Recent Projects</Text>
                {recentProjects.length > 0 ? <HStack flexWrap={'wrap'}>
                    {recentProjects.map((i,idx) => 
                        <ProjectCard 
                            key={idx} 
                            name={i.name} 
                            status={i.status} 
                            onDetailsClick={() => handleDetailsClick(i)} 
                            onUpdateClick={() => handleUpdateClick(i)}
                            assignedTo={i.assignedTo}
                            assignedBy={i.createdBy}
                            />
                    )}
                </HStack> : 
                <EmptyAlert text="No projects accepted yet!"/>
                }
                <UpdateStatusModal isOpen={isOpen} onClose={onClose} selectedProject={selectedProject} setUpdatedProject={setUpdatedProject}/>
                <ProjectDetailsModal isOpen={isDetailsOpen} onClose={onDetailsClose} projectDetails={selectedProject}/>
            </Box>
    )
}
