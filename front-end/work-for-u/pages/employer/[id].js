import { Button, CircularProgress, Container, HStack, Text, useToast, VStack } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/contexts/userContext";
import { Layout } from "../../components/core/layout";
import { Profile } from "../../components/profile";
import client from "../../utils/client";

const EmployerProfilePage = () => {
    const [isUser,setIsUser] = useState(false);
    const [info,setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const {query, push} = useRouter();
    const {user,isFreelancer} = useContext(UserContext);
    const toast = useToast();

    useEffect(() => {
        if(!query || !user) return;
        const {id} = query;

        const getInfo = async userId => {
            try {
                setLoading(true);
                const {data} = await client.get(`http://localhost:5000/employer/${userId}`);
                setInfo(data);
                setLoading(false);
            } catch (error) {
                toast({
                    title: error.response ?error.response.data.error : error,
                    status: "error",
                    duration: 2000
                });
                setLoading(false);
            }
        }
        console.log(user._id === id);

        if(user._id === id) {
            setIsUser(true);
        }else{
            if(isFreelancer !== undefined && isFreelancer !== null) {
                if(!isFreelancer) push("/employer");
            }
        }
            getInfo(id);

    },[query,user])
    
    return(
        <Layout>
            <Container maxW={"container.md"} pt="20px" h={'600px'}>
                {
                   info ? 
                    <Profile 
                        isFreelancerProfile={false} 
                        isFreelancer={isFreelancer} 
                        isUser={isUser} 
                        userInfo={info} 
                        updateUserInfo={data => setInfo(data)}
                    />
                    :
                    loading ?
                    <VStack justifyContent={'center'}>
                        <CircularProgress isIndeterminate/>
                    </VStack>
                        :
                    <VStack justifyContent={'center'}>
                        <Text>Could not find the user!</Text>
                        <HStack>
                            <Button colorScheme={'teal'} variant={'outline'} onClick={() => push("/employer")}>Back to Dashboard</Button>
                        </HStack>
                    </VStack> 
                }
            </Container>
        </Layout>


    )
}

export default EmployerProfilePage;

