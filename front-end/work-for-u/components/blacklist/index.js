import { Box,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    useToast,
    Avatar,
    Button,
} from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import client from "../../utils/client";
import { EmptyAlert } from "../common/emptyAlert";
import { UserContext } from "../contexts/userContext";

export const Blacklist = () => {

    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(false);

    const {user,setUser} = useContext(UserContext);

    const toast = useToast();

    useEffect(() => {
        if(!user || !user.blacklist || user.blacklist.length === 0) {
            setDetails([]);
            return;
        }
        const getEmployersInfo = async arr => {
            try {
                const {data} = await client.post("http://localhost:5000/employer/getList",{employeridarr: arr});
                setDetails(data);
            } catch (error) {
                toast({
                    title: "Could not fetch employers info",
                    status: "error",
                    duration: 2000
                })
            }
        }
        getEmployersInfo(user.blacklist);
    },[user]);

    const unBlock = async employer => {
        try {
            setLoading(true);
            const {data} = await client.delete(`http://localhost:5000/freelancer/blacklist/${user._id}/${employer._id}`)
            console.log(data);
            setUser(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast({
                title: "Could not remove the employer from list",
                status: "error",
                duration: 2000
            })
        }
    }

    return(
       <></>
    )
}