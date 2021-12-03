import { Box, Container, HStack, Spinner, Text, VStack } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router";
import { useContext, useEffect } from "react";
import { UserContext } from "../../components/contexts/userContext";

const Logout = () => {

    const router = useRouter();
    const {setUser} = useContext(UserContext);

    useEffect(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('isFreelancer');
        setUser(null);
        router.push("/");
    },[])


    return(
        <Container>
            <VStack justifyContent={'center'} h={'100vh'}>
                <HStack justifyContent={'center'} wrap={'wrap'}>
                    <Box w={'100%'} display='flex' justifyContent='center'>
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='brand.500'
                            size='xl'
                            
                            />
                    </Box>
                    <Text  fontSize={'xl'}>Logging out...</Text>
                </HStack>
            </VStack>
        </Container>
    )
}

export default Logout;