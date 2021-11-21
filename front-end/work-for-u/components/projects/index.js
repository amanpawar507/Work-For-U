import { useEffect, useState } from "react"
import { Grid, Text } from "@chakra-ui/react"
import axios from "axios"
import { ProjectCard } from "./projectCard";

export const Projects = () => {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const getAllProjects = async () => {
            const {data} = await axios.get("http://localhost:5000/project/");
            setProjects(data);
        }
        getAllProjects();
    },[])

    return(
        <>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                {
                    projects.map((i,idx) => <ProjectCard key={idx} name={i.name} status={i.status}/>)
                }
            </Grid>
        </>
    )
}