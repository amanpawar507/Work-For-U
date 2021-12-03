import { useState, useEffect } from "react";
import { HStack, toast, useDisclosure, useToast } from "@chakra-ui/react"
import { FreelancerCard } from "./freelancerCard"
import axios from 'axios';
import { RequestModal } from "./requestModal";
import { FreelancerList } from "../common/freelancerList";

export const Dashboard = () => {

    const [listofFreelancers, setListOfFreelancers] = useState([]);


    const toast = useToast();

    useEffect(() => {
        const getFreelancers = async() => {
            const {data} = await axios.get("http://localhost:5000/freelancer/all");
            setListOfFreelancers(data);
        }
        getFreelancers();
    },[])


    return (
       <FreelancerList list={listofFreelancers}/>
    )
} 