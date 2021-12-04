import { Button } from "@chakra-ui/button";
import { Flex, VStack } from "@chakra-ui/layout"
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { useContext, useState } from "react";
import {InputComp} from "../common/Input";
import { UserContext } from "../contexts/userContext";

export const Login = () => {
    const [details, setDetails] = useState({
        emailId:null,
        password:null
    })
    const {isFreelancer,saveUser} = useContext(UserContext);
    const [checking,setChecking] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const handleSubmit = async e => {
        try {
            setChecking(true);
            e.preventDefault();
            const {data} = await axios.post(`http://localhost:5000/${isFreelancer?"freelancer":"employer"}/login`,details)
            console.log(data);
            saveUser(data);
            setChecking(false);
            router.push(`/${isFreelancer?"freelancer":"employer"}`)
        } catch (error) {
            console.log(error.response.data);
            toast({
                title: error.response? error.response.data.error:error,
                status: "error",
                duration: 2000
            });
            setChecking(false);
        }
    }
    console.log(isFreelancer);
    console.log(Boolean(isFreelancer))

    return(
        <Flex justifyContent={'center'}>
            <form onSubmit={handleSubmit}>
            <VStack w={'300px'} mt="5%"  padding={'20px'} background={'white'} borderRadius={'10px'} boxShadow={'md'}>
                    <InputComp name="emailId" label="Username" value={details.emailId} onChange={
                        e => setDetails(prevValue => {
                            return{
                                ...prevValue,
                                [e.target.name]: e.target.value
                            }
                        })
                    }/>
                    <InputComp type="password" name="password" label="Password" value={details.password} onChange={
                        e => setDetails(prevValue => {
                            return{
                                ...prevValue,
                                [e.target.name]: e.target.value
                            }
                        })
                    }/>
                    <Button colorScheme={'teal'} mt='10px' w="100%" type="submit" isLoading={checking}>
                        Submit
                    </Button>
                    <Button disabled={checking} colorScheme={'teal'} mt='10px' w="100%" onClick={() => router.push(`/${isFreelancer?"freelancer":"employer"}/register`)}>
                        Haven't joined u, yet?
                    </Button>
                    <Button disabled={checking} colorScheme={'teal'} mt='10px' w="100%" onClick={() => router.push("/")}>
                        {isFreelancer ? 'Not freelancer?' : 'Not employer?'}
                    </Button>
            </VStack>
                </form>
            
        </Flex>
    )
}