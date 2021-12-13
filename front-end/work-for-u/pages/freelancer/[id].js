import { Button, CircularProgress, Container, HStack, Text, useToast, VStack } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/contexts/userContext";
import { Layout } from "../../components/core/layout";
import { Profile } from "../../components/profile";
import client from "../../utils/client";

const FreelanceProfilePage = () => {
    const [isUser,setIsUser] = useState(false);
    const [info,setInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const {query, push} = useRouter();
    const {user,isFreelancer} = useContext(UserContext);
    const toast = useToast();
    const errorAlert = error => {
        toast({
            title: error.response? 
                    error.response.data.error : 
                    error.message ? 
                    error.message : 
                    error,
            status: "error",
            duration: 2000
        });
    }
    // useEffect(() => {
       
    // },[isFreelancer])
    const {id} = query;
    useEffect(() => {
        if(!id || !user) return;


        const getInfo = async userId => {
            try {
                setLoading(true);
                const {data} = await client.get(`http://localhost:5000/freelancer/${userId}`);
                setInfo(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setInfo(null);
                errorAlert(error);
            }
        }
        
   
        if(user._id === id) {
            setIsUser(true);
        }else{
            if(isFreelancer !== undefined && isFreelancer !== null) {
                if(isFreelancer) push("/freelancer");
            }
        }
        
       
        getInfo(id);

    },[id,user])
    
    return(
         <Layout>
            <Container maxW={"container.lg"} pt="50px" h={'600px'}>
                {info ? 
                    <Profile 
                        isFreelancerProfile={true} 
                        isFreelancer={isFreelancer} 
                        isUser={isUser} 
                        userInfo={info} 
                        updateUserInfo={data => setInfo(data)}
                    /> :
                    loading ?
                    <VStack justifyContent={'center'}>
                        <CircularProgress/>
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

export default FreelanceProfilePage;




