import { Avatar, Box, Button, Divider, Flex, HStack, Spacer, Text, useDisclosure, VStack } from "@chakra-ui/react"
import axios from "axios";
import { useEffect, useState } from "react";
import { MdFace, MdGrade } from 'react-icons/md'
import client from "../../utils/client";
import { InfoText } from "../common/infoText"
import { RateModal } from "../common/rating/rateModal";
import { ReviewList } from "../common/rating/reviewList";
import { SuccessChart } from "./successChart";
import randomcolor from "randomcolor"

export const Profile = ({isFreelancer,userInfo,isUser,updateFreelancer}) => {

    const [chartInfo, setChartInfo] = useState();

    const {isOpen: isRatingOpen, onOpen: onRatingOpen, onClose: onRatingClose} = useDisclosure();

    useEffect(() => {
        if(!userInfo) return;
        const getSuccessRate = async () => {
            const {data} = await client.get(`http://localhost:5000/freelancer/successRate/${userInfo._id}`);
            console.log(data);
            let labels = [];
            let values = [];
            let colors = [];
            for(let key in data.projectBySkills) {
                labels.push(key);
                values.push(data.projectBySkills[key]);
                colors.push(randomcolor());
            }
            console.log({labels,values, colors});
            setChartInfo({labels,values, colors});
        }

        if(isFreelancer) getSuccessRate()
    },[isFreelancer])


    return(
        <Box w="100%" h={'100%'}>
            <HStack w='100%' mb="40px" spacing={'50px'}>
                <Avatar size={"xl"} name={userInfo.fullName}/>
                {!isFreelancer && <Button bg={"yellow.400"} leftIcon={<MdGrade/>} onClick={() => onRatingOpen()}>Rate</Button>}
            </HStack>
            <HStack w='100%'  spacing={'20px'} minH={'60%'}>
                <Box minW={'250px'} maxW={'400px'} borderRight={'1px solid gray'}>
                    {userInfo.fullName && <InfoText label="Full Name" content={userInfo.fullName}/>}
                    {userInfo.companyName && <InfoText label="Company Name" content={userInfo.companyName}/>}
                    {userInfo.emailId && <InfoText label="Email" content={userInfo.emailId}/>}
                    {userInfo.introduction && <InfoText label="Introduction" content={userInfo.introduction}/>}
                    {userInfo.skills && <InfoText label="Skills" content={userInfo.skills.map(i => i.name).toString()}/>}
                    {userInfo.location && <InfoText label="Location" content={userInfo.location}/>}
                    {userInfo.expectedPay && <InfoText label="Expected Pay" content={`$${userInfo.expectedPay}`}/>}
                </Box>
                {/* <Flex minW={'200px'} justifyContent={"center"} direction={'column'} gap="10px"> */}
                    <SuccessChart chartInfo={chartInfo}/>
                {/* </Flex> */}
            </HStack>
            <Divider/>
            <Box w={'500px'} pt='10px'>
                {userInfo.reviews.length > 0 ? <ReviewList reviews={userInfo.reviews}/> : <Text>No Reviews yet !</Text>}
            </Box>
            <RateModal freelancer={userInfo} isOpen={isRatingOpen} onClose={onRatingClose} updateFreelancer={(data) => updateFreelancer(data)}/>
        </Box>
    )
}
