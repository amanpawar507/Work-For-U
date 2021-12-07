import { useContext, useEffect, useState } from "react"
import { Box, Button, Grid, GridItem, Heading, HStack, Input, Select, Text, useDisclosure, useToast, VStack } from "@chakra-ui/react"
import axios from "axios"
import { ProjectCard } from "./projectCard";
import { AddProjectModal } from "./addProjectModal";
import { ProjectDetailsModal } from "./projectDetailsModal";
import { UserContext } from "../contexts/userContext";
import client from "../../utils/client";
import { UpdateStatusModal } from "../freelancerDashboard/updateStatusModal";
import { ProjectFilter } from "./projectFilter";

export const Projects = () => {

    const [projects, setProjects] = useState([]);
    const [requests,setRequests] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [skillList, setSkillList] = useState([]);

    const {user,isFreelancer} = useContext(UserContext);

    const {isOpen,onOpen,onClose} = useDisclosure();
    const {isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose} = useDisclosure();
    const {isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose} = useDisclosure();

    const toast = useToast();

    useEffect(() => {
        try {
            const getAllSkills = async () => {
                const {data} = await client.get("http://localhost:5000/skills/");
                setSkillList(data);
                setLoading(false);
            } 
            setLoading(true);
            getAllSkills();
        } catch (error) {
            console.log(error);
        }
    },[]);

    useEffect(() => {
        if(!user) return;
        const getFreelancerRequests = async() => {
            const {data} = await client.get(`http://localhost:5000/project/requests/${user._id}`);
            console.log(data);
            setRequests(data);
        }
        const getAllProjects = async () => {
            if(!isFreelancer){
                const {data} = await client.get(`http://localhost:5000/project/all/employer/${user._id}`);
                setProjects(data);
            }
            else{
                const {data} = await client.get(`http://localhost:5000/project/all/freelancer/${user._id}`);
                setProjects(data);
            }
            
        }
        if(isFreelancer) getFreelancerRequests();
        getAllProjects();
    },[user,isFreelancer])


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
                const {data} = await client.patch(`http://localhost:5000/project/${id}`,
                    {
                        ...details, 
                        tenureMonths: tenure,
                        hourlyPay: pay
                    }   
                );
                console.log(data);
                setProjects(prevValue => {
                    return prevValue.map( i => i._id === id ? data : i);
                });
                setIsSubmitting(false);
                onClose();
            }else{
                const {data} = await client.post("http://localhost:5000/project/",
                    {
                        ...details, 
                        tenureMonths: tenure,
                        hourlyPay: pay,
                        createdBy: user._id
                    }   
                );
                console.log(data);
                setProjects(prevValue => [...prevValue,data]);
                setIsSubmitting(false);
                onClose();
            }

        } catch (error) {
            console.log(error.response.data);
            toast({title: error.error? error.error : error,
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

    const handleDeleteProject = async id => {
        try {
            const {data} = await client.delete(`http://localhost:5000/project/${id}`);
            console.log(data);
            if(data.deleted) {
                setProjects(prevValue => {
                    return prevValue.filter( i => i._id !== id);
                });
            }
        } catch (error) {
            toast({title: error.message? error.message : error, status:"error", duration: 2000});
        }
    }

    const setUpdatedRequest = data => {
        setRequests(prevValue => {
            return prevValue.filter(i => i._id !== data._id);
        })
        if(data.status === 1) {
            setProjects(prevValue => {
                return [data,...prevValue]
            })
        }
    }

    const setUpdatedProject = data => {
        if(!data) return;
        setProjects(prevValue => {
            return prevValue.map(i => i._id === data._id ? data : i);
        })
        onUpdateClose();
    }

    const handleFilter = async filterData => {
        const {type,query} = filterData;
        let filteredData = [];
        let currentData;
        if(!isFreelancer){
            const {data} = await client.get(`http://localhost:5000/project/all/employer/${user._id}`);
            currentData = data;
        }
        else{
            const {data} = await client.get(`http://localhost:5000/project/all/freelancer/${user._id}`);
            currentData = data;
        }
        if(currentData) {
            if(!type || type === "name") {
                currentData.map(i => (i.name.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(i.name.toLowerCase())) ? filteredData.push(i) : i);
                if(type) {
                    setProjects(filteredData);
                    return;
                }
            }
    
            if(!type || type === "skill") {
                currentData.forEach(el => {
                    const projectExist = filteredData.find(i => i._id === el._id);
                    if(!projectExist) {
                        const skillExist = el.skillsRequired.find(i => i.name.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(i.name.toLowerCase()));
                        if(skillExist) {
                            filteredData.push(el);
                        }
                    }
                })
                if(type) {
                    setProjects(filteredData);
                    return;
                }
            }
    
            setProjects(filteredData);
        }
    }

    const clearFilter = async () => {
        if(!isFreelancer){
            const {data} = await client.get(`http://localhost:5000/project/all/employer/${user._id}`);
            setProjects(data);
        }
        else{
            const {data} = await client.get(`http://localhost:5000/project/all/freelancer/${user._id}`);
            setProjects(data);
        }
    }

    return(
        <Box w={'100%'}>
            {!isFreelancer && <Button minW={'100px'} variant={'solid'} color={'brand.500'} bg={'brand.900'} mb='20px' onClick={() => {setSelectedProject(null); onOpen()}}>Add</Button>}
            {isFreelancer && <>
                <Heading mb='10px' fontSize={'2xl'} borderBottom={'1px solid black'}>Requests</Heading>
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                    {
                        requests.map((i,idx) => <ProjectCard key={idx} id={i._id} name={i.name} status={i.status} onDetailsClick={() => handleShowDetails(i)} onEditClick={() => handleEditProject(i)} onDeleteClick={() => handleDeleteProject(i._id)} setUpdatedRequest={(data) => setUpdatedRequest(data)}/>)
                    }
                </Grid>
            </>}
            <Heading mt='10px' mb='10px' fontSize={'2xl'} borderBottom={'1px solid black'}>Your projects</Heading>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <GridItem colSpan={2}>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        {
                            projects.map((i,idx) => <ProjectCard 
                                key={idx} 
                                id={i._id} 
                                name={i.name} 
                                status={i.status} 
                                assignedTo={i.assignedTo}
                                onDetailsClick={() => handleShowDetails(i)} 
                                onEditClick={() => handleEditProject(i)} 
                                onDeleteClick={() => handleDeleteProject(i._id)} 
                                onUpdateClick={() => {setSelectedProject(i); onUpdateOpen();}}
                                onRateClick={() => onRatingOpen()}
                        />)
                        }
                    </Grid>
                </GridItem>
                <ProjectFilter handleFilter={handleFilter} handleClearFilter={clearFilter}/>
            </Grid>
            <AddProjectModal isOpen={isOpen} onClose={onClose} onSubmit={handleCreateProject} submitting={isSubmitting} isEdit={isEdit} selectedProject={selectedProject}/>
            <ProjectDetailsModal isOpen={isDetailsOpen} onClose={onDetailsClose} projectDetails={selectedProject}/>
            <UpdateStatusModal isOpen={isUpdateOpen} onClose={onUpdateClose} selectedProject={selectedProject} setUpdatedProject={setUpdatedProject}/>
        </Box>
    )
}