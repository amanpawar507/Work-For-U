import axios from "axios";
import { useRouter } from "next/dist/client/router";
import React, { createContext, useEffect, useState } from "react";
import client from "../../utils/client";


export const UserContext = createContext();

const UserContextProvider = ({children}) => {

    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFreelancer, setIsFreelancer] = useState(false);

    const router = useRouter();

    useEffect(() => {
        try {

         
            let userExist = localStorage.getItem('accessToken');
            let isFreelancer = localStorage.getItem('isFreelancer');
            console.log(userExist);
            if(isFreelancer === undefined || isFreelancer === null) {
              router.push("/")
            }
            else{
                if(isFreelancer === "true") {
                    setIsFreelancer(true);
                    if(userExist && userExist !== undefined) setCurrentUser();
                }else{
                    setIsFreelancer(false);
                    if(userExist && userExist !== undefined) setCurrentUser();
                }
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    },[]);

    const setCurrentUser = async() => {
        const {data} = await client.get(`http://localhost:5000/reCreate`)
        console.log(data);
        if(data) {
            setUser(data.user);
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
        setUser(user.user);
        localStorage.setItem('accessToken',user.token);
    }

    return (
        <UserContext.Provider value={{user,handleTypeSelect,isFreelancer,setUser,saveUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;