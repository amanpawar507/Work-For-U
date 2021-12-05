import { Container, useToast } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/contexts/userContext";
import { Layout } from "../../components/core/layout";
import { Profile } from "../../components/profile";
import client from "../../utils/client";

const FreelanceProfilePage = () => {
    const [isUser,setIsUser] = useState(false);
    const [info,setInfo] = useState(null);

    const {query} = useRouter();
    const {user} = useContext(UserContext);
    const toast = useToast();

    useEffect(() => {
        if(!query || !user) return;
        const {id} = query;

        const getInfo = async userId => {
            try {
                const {data} = await client.get(`http://localhost:5000/freelancer/${userId}`);
                setInfo(data);
            } catch (error) {
                toast({
                    title: error.response ?error.response.data.error : error,
                    status: "error",
                    duration: 2000
                });
            }
        }
        
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
                <Profile isFreelancer={true} isUser={isUser} userInfo={info}/>
            </Container>
        </Layout>


    )
}

export default FreelanceProfilePage;

Pages > employer > [id]

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
    const {user} = useContext(UserContext);
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
                <Profile isFreelancer={false} isUser={isUser} userInfo={info}/>
            </Container>
        </Layout>


    )
}

export default EmployerProfilePage;


Components > profile > index.js

import { Avatar, Box, Divider, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import { InfoText } from "../common/infoText"

export const Profile = ({isFreelancer,userInfo,isUser}) => {
    return(
        <Box w="100%" h={'100%'}>
            <HStack w='100%' mb="40px">
                <Avatar size={"xl"} name={userInfo.fullName}/>
            </HStack>
            <HStack w='100%'  spacing={'20px'} minH={'60%'}>
                <Box maxW={'300px'} borderRight={'1px solid gray'}>
                    {userInfo.fullName && <InfoText label="Full Name" content={userInfo.fullName}/>}
                    {userInfo.companyName && <InfoText label="Company Name" content={userInfo.companyName}/>}
                    {userInfo.emailId && <InfoText label="Email" content={userInfo.emailId}/>}
                    {userInfo.introduction && <InfoText label="Introduction" content={userInfo.introduction}/>}
                    {userInfo.skills && <InfoText label="Skills" content={userInfo.skills.map(i => i.name).toString()}/>}
                    {userInfo.location && <InfoText label="Location" content={userInfo.location}/>}
                    {userInfo.expectedPay && <InfoText label="Expected Pay" content={`$${userInfo.expectedPay}`}/>}
                </Box>
                <Flex minW={'200px'} justifyContent={"center"} direction={'column'} gap="10px">
                    <Text>No Reviews yet!</Text>
                </Flex>
            </HStack>
        </Box>
    )
}
