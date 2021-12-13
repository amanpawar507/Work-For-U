import axios from "axios";
import { useRouter } from "next/dist/client/router";
import React, { createContext, useEffect, useState } from "react";
import client from "../../utils/client";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFreelancer, setIsFreelancer] = useState(null);

  const router = useRouter();

  useEffect(() => {
    try {
      let userExist = sessionStorage.getItem("accessToken");
      // let isFreelancer = sessionStorage.getItem("isFreelancer");
      //debugger;
      if (userExist) {
        setCurrentUser();
      } else {
        router.push("/logout");
      }
    } catch (error) {
      //console.log(error);
    }
  }, []);

  const setCurrentUser = async () => {
    const { data } = await client.post(`http://localhost:5000/common/reCreate`);
    if (data) {
      if (data.user.reviews) {
        sessionStorage.setItem("isFreelancer", true);
        setIsFreelancer(true);
        // if(router.pathname.split("/")[1] === "employer") {
        //   router.push("/freelancer");
        // }
      } else {
        sessionStorage.setItem("isFreelancer", false);
        setIsFreelancer(false);
        // if(router.pathname.split("/")[1] === "freelancer") {
        //   router.push("/employer");
        // }
      }
      setUser(data.user);
    }
  };

  const handleTypeSelect = (type) => {
    if (type === 1) {
      sessionStorage.setItem("isFreelancer", false);
      setIsFreelancer(false);
    } else {
      sessionStorage.setItem("isFreelancer", true);
      setIsFreelancer(true);
    }
    router.push("/login");
  };

  const saveUser = (user) => {
    if (!user) return;
    setUser(user.user);
    sessionStorage.setItem("accessToken", user.token);
  };

  return (
    <UserContext.Provider
      value={{ user, handleTypeSelect, isFreelancer, setUser, saveUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
