import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
// import axios from 'axios';
import client from "../../utils/client";
import { FreelancerList } from "../common/freelancerList";

export const Dashboard = () => {

    const [listofFreelancers, setListOfFreelancers] = useState([]);


    const toast = useToast();

    useEffect(() => {
        const getFreelancers = async() => {
            const {data} = await client.get("http://localhost:5000/freelancer/all");
            setListOfFreelancers(data);
        }
        getFreelancers();
    },[])


    return (
       <FreelancerList list={listofFreelancers}/>
    )
} 