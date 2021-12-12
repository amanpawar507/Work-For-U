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
import { EmptyAlert } from "../common/emptyAlert";
import { RateModal } from "../common/rating/rateModal";

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
    const {isOpen: isRatingOpen, onOpen: onRatingOpen, onClose: onRatingClose} = useDisclosure();


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
        try {
            const getAllSkills = async () => {
                const {data} = await client.get("http://localhost:5000/skills/");
                setSkillList(data);
            } 
            getAllSkills();
        } catch (error) {
            console.log(error);
        }
    },[]);

    useEffect(() => {
        if(!user) return;
        const getFreelancerRequests = async() => {
            try {
                const {data} = await client.get(`http://localhost:5000/project/requests/${user._id}`);
                console.log(data);
                setRequests(data);
            } catch (error) {
                errorAlert(error);
            }
        }
        const getAllProjects = async () => {
            try {
                if(!isFreelancer){
                    const {data} = await client.get(`http://localhost:5000/project/all/employer/${user._id}`);
                    console.log(data);
                    setProjects(data);
                }
                else{
                    const {data} = await client.get(`http://localhost:5000/project/all/freelancer/${user._id}`);
                    setProjects(data);
                } 
            } catch (error) {
                errorAlert(error);
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
            let hours = parseInt(details.hrsPerDay);
            let days = parseInt(details.daysPerWeek);
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
                        hourlyPay: pay,
                        hrsPerDay: hours,
                        daysPerWeek: days
                    }   
                );
                console.log(data);
                setProjects(prevValue => {
                    return prevValue.map( i => i._id === data._id ? data : i);
                });
                setIsSubmitting(false);
                toast({title: "Project updated successfully",
                    status: "success",
                    duration: 2000
                });
                onClose();
            }else{
                const {data} = await client.post("http://localhost:5000/project/",
                {
                    ...details, 
                    tenureMonths: tenure,
                    hourlyPay: pay,
                    hrsPerDay: hours,
                    daysPerWeek: days,
                    createdBy: user._id
                }   
                );
                console.log(data);
                setProjects(prevValue => [...prevValue,data]);
                setIsSubmitting(false);
                toast({title: "Project added successfully",
                status: "success",
                duration: 2000
            });
                onClose();
            }

        } catch (error) {
            console.log(error.response.data);
            setIsSubmitting(false);
            errorAlert(error);
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
            errorAlert(error);
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
        try {
            const {type,query} = filterData;
            let userType = isFreelancer ? 'freelancer' : 'employer'
            const {data} = await client.get(`http://localhost:5000/project/filter/${userType}/${user._id}/${query}/${type}`,{query,type});
        
            setProjects(data);
        } catch (error) {
            errorAlert(error);
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

    const updateProjectAfterRating = data => {
        if(!data) return;
        setProjects(prevValue => {
            return prevValue.map(i => i._id === data._id ? data : i);
        });
    }

    return(
        <Box w={'100%'}>
            {!isFreelancer && <Button minW={'100px'} variant={'solid'} color={'black'} bg={'brand.900'} mb='20px' onClick={() => {setSelectedProject(null); onOpen()}}>Add</Button>}
            {isFreelancer && <>
                <Heading mb='10px' fontSize={'2xl'} borderBottom={'1px solid black'}>Requests</Heading>

                {requests.length > 0 ? <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                    {
                        requests.map((i,idx) => 
                            <ProjectCard 
                                key={idx} 
                                id={i._id} 
                                name={i.name} 
                                status={i.status} 
                                assignedBy={i.createdBy}
                                onDetailsClick={() => handleShowDetails(i)} 
                                setUpdatedRequest={(data) => setUpdatedRequest(data)}
                            />)
                    }
                </Grid>:
                <EmptyAlert text="You have no new requests. Hang tight!"/>
                }
            </>}
            <br/>
            <Heading mt='10px' mb='10px' fontSize={'2xl'} borderBottom={'1px solid black'}>Your projects</Heading>
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <GridItem colSpan={2}>
                    { projects.length > 0 ? <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        {
                            projects.map((i,idx) => <ProjectCard 
                                key={idx} 
                                id={i._id} 
                                name={i.name} 
                                status={i.status} 
                                assignedTo={i.assignedTo}
                                assignedBy={i.createdBy}
                                reviewed={i.reviewed}
                                onDetailsClick={() => handleShowDetails(i)} 
                                onEditClick={() => handleEditProject(i)} 
                                onDeleteClick={() => handleDeleteProject(i._id)} 
                                onUpdateClick={() => {setSelectedProject(i); onUpdateOpen();}}
                                onRateClick={() => {setSelectedProject(i); onRatingOpen();}}
                        />)
                        }
                    </Grid>:
                    <EmptyAlert text={isFreelancer ? "You have no project for now." : "No projects created. Create some!"}/>}
                </GridItem>
                <ProjectFilter handleFilter={handleFilter} handleClearFilter={clearFilter}/>
            </Grid>  
            <AddProjectModal isOpen={isOpen} onClose={onClose} onSubmit={handleCreateProject} submitting={isSubmitting} isEdit={isEdit} selectedProject={selectedProject}/>
            <ProjectDetailsModal isOpen={isDetailsOpen} onClose={onDetailsClose} projectDetails={selectedProject}/>
            <UpdateStatusModal isOpen={isUpdateOpen} onClose={onUpdateClose} selectedProject={selectedProject} setUpdatedProject={setUpdatedProject}/>
            <RateModal project={selectedProject} isOpen={isRatingOpen} onClose={() => {setSelectedProject(); onRatingClose();}} updateProject={(data) => updateProjectAfterRating(data)}/>
        </Box>
    )
}