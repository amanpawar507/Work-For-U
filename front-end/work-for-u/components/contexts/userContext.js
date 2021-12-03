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
            if(isFreelancer === undefined || isFreelancer === null) {
              router.push("/")
            }
            else{
                if(isFreelancer === "true") {
                    setIsFreelancer(true);
                    if(userExist) setFreelancer(userExist);
                }else{
                    setIsFreelancer(false);
                    if(userExist) setEmployer(userExist);
                }
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    },[]);

    const setEmployer = async(id) => {
        const {data} = await axios.get(`http://localhost:5000/employer/${id}`)
        if(data) {
            setUser(data);
            localStorage.setItem("user",data._id);
        }
    }

    const setFreelancer = async(id) => {
        const {data} = await axios.get(`http://localhost:5000/freelancer/${id}`)
        if(data) {
            setUser(data);
            localStorage.setItem("user",data._id);
            // router.push('/freelancer');
        }
    }

    const handleTypeSelect = type => {
        if(type === 1) {
            localStorage.setItem("isFreelancer",false);
            setIsFreelancer(false);
        }else{
            localStorage.setItem("isFreelancer",true);
            setIsFreelancer(true);
        }
        router.push("/login");
    }

    const saveUser = user => {
        if(!user) return;
        setUser(user);
        localStorage.setItem('user',user._id);
    }

    return (
        <UserContext.Provider value={{user,handleTypeSelect,isFreelancer,setUser,saveUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;