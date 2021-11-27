import { useState, useEffect } from "react";
import { HStack } from "@chakra-ui/react"
import { FreelancerCard } from "./freelancerCard"
import axios from 'axios';

export const Dashboard = () => {

    const [listofFreelancers, setListOfFreelancers] = useState([]);

    useEffect(() => {
        const getFreelancers = async() => {
            const {data} = await axios.get("http://localhost:5000/freelancer/all");
            setListOfFreelancers(data);
        }
        getFreelancers();
    },[])

    

    return (
        <>
            <HStack spacing={'20px'}>
                {listofFreelancers.map(i => 
                    <FreelancerCard name={i.fullName} rating={i.overallRating} skill={i.skills[Math.floor(Math.random() * i.skills.length - 1) + 1].name}/>    
                )}
            </HStack>
        </>

    )
} 