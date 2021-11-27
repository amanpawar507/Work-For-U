import { useEffect, useState } from "react"
import { Box, Button, Grid, Text, useDisclosure, useToast } from "@chakra-ui/react"
import axios from "axios"
import { ProjectCard } from "./projectCard";
import { AddProjectModal } from "./addProjectModal";
import { ProjectDetailsModal } from "./projectDetailsModal";

export const Projects = () => {

    const [projects, setProjects] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const {isOpen,onOpen,onClose} = useDisclosure();
    const {isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose} = useDisclosure();

    const toast = useToast();

    useEffect(() => {
        const getAllProjects = async () => {
            const {data} = await axios.get("http://localhost:5000/project/");
            setProjects(data);
        }
        getAllProjects();
    },[])


    const handleCreateProject = async details => {
        try {
            setIsSubmitting(true);
            let tenure = parseFloat(details.tenureMonths);
            let pay = parseFloat(details.hourlyPay);
            if(tenure === 0 || pay === 0) {
                toast({title: "Tenure and Hourly pay should be greater than 0",
                    status: "warning",
                    duration: 2000
                });
                setIsSubmitting(false);
                return;
            }
            if(details._id) {
                let id = details._id;
                delete details._id;
                const {data} = await axios.patch(`http://localhost:5000/project/${id}`,
                    {
                        ...details, 
                        tenureMonths: tenure,
                        hourlyPay: pay
                    }   
                );
                setProjects(prevValue => {
                    return prevValue.map( i => i._id === id ? data : i);
                });
                setIsSubmitting(false);
                onClose();
            }else{
                const {data} = await axios.post("http://localhost:5000/project/",
                    {
                        ...details, 
                        tenureMonths: tenure,
                        hourlyPay: pay,
                        createdBy: "619d40caac603228d069b3ba"
                    }   
                );
                setProjects(prevValue => [...prevValue,data]);
                setIsSubmitting(false);
                onClose();
            }

        } catch (error) {
            console.log(error);
            toast({title: error.message? error.message : error,
                status: "error",
                duration: 2000
            });
            setIsSubmitting(false);
        }
    }
    
    const handleShowDetails = details => {
        console.log(details);
        setSelectedProject(details);
        onDetailsOpen();
    }

    const handleEditProject = details => {
        setIsEdit(true);
        setSelectedProject(details);
        onOpen();
    }

    return(
        <Box w={'100%'}>
            <Button minW={'100px'} variant={'outline'} color={'brand.300'} borderColor={'brand.300'} mb='20px' onClick={() => onOpen()}>Add</Button>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                {
                    projects.map((i,idx) => <ProjectCard key={idx} name={i.name} status={i.status} onDetailsClick={() => handleShowDetails(i)} onEditClick={() => handleEditProject(i)}/>)
                }
            </Grid>
            <AddProjectModal isOpen={isOpen} onClose={onClose} onSubmit={handleCreateProject} submitting={isSubmitting} isEdit={isEdit} selectedProject={selectedProject}/>
            <ProjectDetailsModal isOpen={isDetailsOpen} onClose={onDetailsClose} projectDetails={selectedProject}/>
        </Box>
    )
}