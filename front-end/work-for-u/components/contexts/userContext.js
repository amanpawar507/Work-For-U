import axios from "axios";
import { useRouter } from "next/dist/client/router";
import React, { createContext, useEffect, useState } from "react";
import client from "../../utils/client";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFreelancer, setIsFreelancer] = useState(false);

  const router = useRouter();

<<<<<<< HEAD
  useEffect(() => {
    try {
      let userExist = localStorage.getItem("user");
      let isFreelancer = localStorage.getItem("isFreelancer");
      console.log(userExist);
      if (!userExist) {
        router.push("/");
      } else {
        if (isFreelancer || isFreelancer === "true") {
          getFreelancer();
        } else {
          getEmployer();
=======
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
                    if(userExist && userExist !== undefined) setCurrentUser(userExist);
                }else{
                    setIsFreelancer(false);
                    if(userExist && userExist !== undefined) setCurrentUser(userExist);
                }
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
>>>>>>> 58cc1ef838d1bc927d59ec02c5976862624a6a4a
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

<<<<<<< HEAD
  const getEmployer = async () => {
    setLoading(true);
    const { data } = await axios.get(
      "http://localhost:5000/employer/61a903a12924a7089139f0d8"
    );
    if (data) {
      setUser(data);
      setIsFreelancer(false);
      localStorage.setItem("user", data._id);
      localStorage.setItem("isFreelancer", false);
      router.push("/employer");
=======
    const setCurrentUser = async(id) => {
        const {data} = await client.get(`http://localhost:5000/reCreate`)
        console.log(data);
        if(data) {
            setUser(data.user);
        }
>>>>>>> 58cc1ef838d1bc927d59ec02c5976862624a6a4a
    }
    setLoading(false);
  };

<<<<<<< HEAD
  const getFreelancer = async () => {
    setLoading(true);
    const { data } = await axios.get(
      "http://localhost:5000/freelancer/61a903af2924a7089139f0df"
    );
    if (data) {
      setUser(data);
      setIsFreelancer(true);
      localStorage.setItem("user", data._id);
      localStorage.setItem("isFreelancer", true);
      router.push("/freelancer/register");
    }
    setLoading(false);
  };

  const handleTypeSelect = (type) => {
    if (type === 1) {
      getEmployer();
    } else {
      getFreelancer();
=======
    // const setFreelancer = async(id) => {
    //     const {data} = await client.get(`http://localhost:5000/freelancer/${id}`)
    //     if(data) {
    //         setUser(data.user);
    //         // router.push('/freelancer');
    //     }
    // }

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
>>>>>>> 58cc1ef838d1bc927d59ec02c5976862624a6a4a
    }
  };

<<<<<<< HEAD
  return (
    <UserContext.Provider value={{ user, handleTypeSelect, isFreelancer }}>
      {children}
    </UserContext.Provider>
  );
};
=======
    return (
        <UserContext.Provider value={{user,handleTypeSelect,isFreelancer,setUser,saveUser}}>
            {children}
        </UserContext.Provider>
    )
}
>>>>>>> 58cc1ef838d1bc927d59ec02c5976862624a6a4a

export default UserContextProvider;
