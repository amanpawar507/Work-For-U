import { Container, useToast } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/contexts/userContext";
import { Layout } from "../../components/core/layout";
import { Profile } from "../../components/profile";
import client from "../../utils/client";

const EmployerProfilePage = () => {
    const [isUser,setIsUser] = useState(false);
    const [info,setInfo] = useState(null);

    const {query} = useRouter();
    const {user,isFreelancer} = useContext(UserContext);
    const toast = useToast();

    useEffect(() => {
        if(!query || !user) return;
        const {id} = query;

        const getInfo = async userId => {
            try {
                const {data} = await client.get(`http://localhost:5000/employer/${userId}`);
                setInfo(data);
            } catch (error) {
                toast({
                    title: error.response ?error.response.data.error : error,
                    status: "error",
                    duration: 2000
                });
            }
        }
        console.log(user._id === id);
        if(user._id === id) {
           
            setIsUser(true);
            setInfo(user);
        }else{
            getInfo(id);
        }

    },[query,user])
    
    return(
        info && <Layout>
            <Container maxW={"container.md"} pt="20px" h={'600px'}>
                <Profile isFreelancerProfile={false} isFreelancer={isFreelancer} isUser={isUser} userInfo={info} updateUserInfo={data => setInfo(data)}/>
            </Container>
        </Layout>


    )
}

export default EmployerProfilePage;

