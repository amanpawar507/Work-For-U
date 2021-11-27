import axios from "axios";
import React, { createContext, useEffect, useState } from "react";


export const UserContext = createContext();

const UserContextProvider = ({children}) => {

    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            const getUser = async() => {
                setLoading(true);
                const {data} = await axios.get("http://localhost:5000/employer/619d40caac603228d069b3ba")
                if(data) {
                    setUser(data);
                }
                setLoading(false);
            }
            getUser();
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    },[]);

    return (
        <UserContext.Provider value={{user}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;