import { Button } from "@chakra-ui/button";
import { Flex, VStack } from "@chakra-ui/layout"
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useContext, useState } from "react";
import {InputComp} from "../common/Input";
import { UserContext } from "../contexts/userContext";

export const Login = () => {
    const [details, setDetails] = useState({
        emailId:null,
        password:null
    })
    const {isFreelancer} = useContext(UserContext);
    const toast = useToast();
    const handleSubmit = async e => {
        try {
            e.preventDefault();
            const {data} = await axios.post("http://localhost:5000/employer/login",details)
            console.log(data);
        } catch (error) {
            console.log(error);
            toast({
                title: "Could not login",
                status: "error",
                duration: 2000
            });
        }
    }

    return(
        <Flex justifyContent={'center'}>
            <form onSubmit={handleSubmit}>
            <VStack mt="5%"  padding={'20px'} background={'white'} borderRadius={'10px'} boxShadow={'md'}>
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
            </VStack>
                    
                   
                    <Button colorScheme={'teal'} mt='10px' w="100%" type="submit" >
                        Submit
                    </Button>
                    <Button colorScheme={'teal'} mt='10px' w="100%" >
                        Not something?
                    </Button>
                </form>
            
        </Flex>
    )
}