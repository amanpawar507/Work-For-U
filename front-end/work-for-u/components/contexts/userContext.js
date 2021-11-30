import axios from "axios";
import { useRouter } from "next/dist/client/router";
import React, { createContext, useEffect, useState } from "react";


export const UserContext = createContext();

const UserContextProvider = ({children}) => {

    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFreelancer, setIsFreelancer] = useState(false);

    const router = useRouter();

    useEffect(() => {
        try {

         
            let userExist = localStorage.getItem('user');
            let isFreelancer = localStorage.getItem('isFreelancer');
            console.log(userExist);
            if(!userExist) {
              router.push('/');
            }else{
                if(isFreelancer || isFreelancer === "true") {
                    getFreelancer();
                }else{
                    getEmployer();
                }
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    },[]);

    const getEmployer = async() => {
        setLoading(true);
        const {data} = await axios.get("http://localhost:5000/employer/61a55b51c6ff9fc004c17d99")
        if(data) {
            setUser(data);
            setIsFreelancer(false);
            localStorage.setItem("user",data._id);
            localStorage.setItem("isFreelancer",false);
            router.push('/employer');
        }
        setLoading(false);
    }

    const getFreelancer = async() => {
        setLoading(true);
        const {data} = await axios.get("http://localhost:5000/freelancer/61a55b5ec6ff9fc004c17da0")
        if(data) {
            setUser(data);
            setIsFreelancer(true);
            localStorage.setItem("user",data._id);
            localStorage.setItem("isFreelancer",true);
            router.push('/freelancer');
        }
        setLoading(false);
    }

    const handleTypeSelect = type => {
        if(type === 1) {
            getEmployer();
        }else{
            getFreelancer()
        }
    }

    return (
        <UserContext.Provider value={{user,handleTypeSelect,isFreelancer}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;