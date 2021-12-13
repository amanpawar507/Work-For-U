import { Box, Button, Divider, Flex, HStack, Spacer, Text, useDisclosure, useToast, VStack } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react";
import { MdBlock, MdCheck } from 'react-icons/md'
import client from "../../utils/client";
import { InfoText } from "../common/infoText"
import { ReviewList } from "../common/rating/reviewList";
import { ProjectChart, SuccessChart } from "./successChart";
import randomcolor from "randomcolor"
import { UserContext } from "../contexts/userContext";
import { DataDisplay } from "./dataDisplay";
import { RequestModal } from "../dashboard/requestModal";
import { EmptyAlert } from "../common/emptyAlert";
import { UpdateProfileModal } from "./updateProfileModal";
import { Avatar, CustomAvatar } from "../common/Avatar";

export const Profile = ({isFreelancer,isFreelancerProfile,userInfo,isUser,updateUserInfo}) => {

    const [chartInfo, setChartInfo] = useState();
    const [blackListing, setBlackListing] = useState();
    const [avgPay, setAvgPay] = useState(0);
    

    const {user:currentUser, setUser} = useContext(UserContext);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose} = useDisclosure();

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

    useEffect(() => {
        if(!userInfo) return;
        const getSuccessRate = async () => {
            try {
                const {data} = await client.get(`http://localhost:5000/freelancer/successRate/${userInfo._id}`);
                //console.log(data);
                let labels = [];
                let values = [];
                let colors = [];
                for(let key in data.projectBySkills) {
                    labels.push(key);
                    values.push(data.projectBySkills[key]);
                    colors.push(randomcolor());
                }
                //console.log({labels,values, colors});
                setChartInfo({labels,values, colors, successRate : data.successRate});
            } catch (error) {
                //console.log(error);
                errorAlert(error);
            }
        }

        const getAveragePay = async() => {
            try {
                const {data} = await client.get(`http://localhost:5000/project/all/employer/${userInfo._id}`);
                const count = data.length;
                let total = 0;
                data.map(i => total += i.hourlyPay);
                setAvgPay(total/count);
            } catch (error) {
                //console.log(error);
                errorAlert(error);
            }
        }

        const getProjectsBySkills = async() => {
            try {
                const {data} = await client.get(`http://localhost:5000/employer/project/skills/${userInfo._id}`);
                //console.log("projects by skills: " , data)
                //console.log(Object.keys(data).length);
                if(Object.keys(data).length > 0) {
                    let labels = [];
                    let values = [];
                    let colors = [];
                    for(let key in data) {
                        labels.push(key);
                        values.push(data[key]);
                        colors.push(randomcolor());
                    }
                    setChartInfo({labels,values, colors});
                }else{
                    setChartInfo(null);
                }

            } catch (error) {
                //console.log(error);
                errorAlert(error);
            }
        }
        if(isFreelancerProfile) {
            getSuccessRate()
        }else{
            getAveragePay();
            getProjectsBySkills();
        }
    },[isFreelancerProfile])

    const handleBlacklisting = async add => {
        try {
            setBlackListing(true);
            if(add) {
                const {data} = await client.post("http://localhost:5000/freelancer/blacklist",{
                    freelancerID: currentUser._id,
                    EmployerID: userInfo._id
                })
                setUser(data);
                setBlackListing(false)
            }else{
                debugger;
                const {data} = await client.delete(`http://localhost:5000/freelancer/blacklist/${currentUser._id}/${userInfo._id}`)
                setUser(data);
                setBlackListing(false)
            }
        } catch (error) {
            //console.log(error);
            setBlackListing(false);
            errorAlert(error);
        }
    }

    const handleReviewDelete = async (reviewId, projectId) => {
        try {
            const getOverallRating = reviews => {
                if (reviews.length == 0) {
                    return 0;
                  } else {
                    let avg = 0;
                    let count = 0;
                    for (element of reviews) {
                      avg = avg + element.rating;
                      count++;
                    }
                    avg = avg / count;
                    return Number(avg.toFixed(2));
                  }
            }

            const {data} = await client.delete(`http://localhost:5000/reviews/${reviewId}/${projectId}`);
            const {reviewID, deleted} = data;
            if(deleted) {
                let currentUserData = userInfo;
                let newArray = currentUserData.reviews.filter(i => i._id !== reviewID);
                currentUserData = {
                    ...currentUserData,
                    overallRating: getOverallRating(newArray),
                    reviews: newArray
                };
                if(isUser) {
                    setUser(currentUserData);
                }else{
                    updateUserInfo(currentUserData);
                }
                toast({
                    title: "review deleted successfully",
                    status: "success",
                    duration: 2000
                });
            }
        } catch (error) {
            //console.log(error);
            toast({
                title: "Could not delete",
                status: "error",
                duration: 2000
            });
        }
    }

    return(
        <Box w="100%" h={'100%'}>
            <HStack w='100%' mb="40px" spacing={'50px'}>
                <CustomAvatar size={"xl"} name={userInfo.fullName} id={userInfo._id} isFreelancer={isFreelancerProfile}/>
                {isFreelancerProfile && <DataDisplay content={`${userInfo.overallRating}/5`} label={`Rating (${userInfo.reviews.length} reviews)`}/>}
                {isFreelancerProfile && chartInfo && <DataDisplay content={`${chartInfo.successRate ? Math.round(chartInfo.successRate) : "0"}%`} label={"Success Rate"}/>}
                {!isFreelancerProfile && <DataDisplay content={`$${avgPay ? Math.round(avgPay) : 0}`} label={"Average pay/hour"}/>}
                {!isFreelancer && isFreelancerProfile && <Button variant={'outline'} colorScheme={'teal'} onClick={() => onOpen()}>Request</Button>}
                {isUser && <Button variant={'outline'} colorScheme={'teal'} onClick={() => onUpdateOpen()}>Edit Profile</Button>}
                {isFreelancer && !isFreelancerProfile && <Button 
                isLoading={blackListing} 
                bg={'gray.500'} 
                leftIcon={(currentUser.blacklist && currentUser.blacklist.includes(userInfo._id) ) ? <MdCheck/> : <MdBlock/>} 
                onClick={() => handleBlacklisting(!(currentUser.blacklist && currentUser.blacklist.includes(userInfo._id)))}>
                    {(currentUser.blacklist && currentUser.blacklist.includes(userInfo._id) ) ? "Blacklisted": "Blacklist"}
                </Button>}
            </HStack>
            <HStack w='100%' justifyContent={'center'}  spacing={'20px'} minH={'60%'} mb='10px'>
                <Box w={'100%'}  borderRight={'1px solid gray'}>
                    {userInfo.fullName && <InfoText label="Full Name" content={userInfo.fullName}/>}
                    {userInfo.companyName && <InfoText label="Company Name" content={userInfo.companyName}/>}
                    {userInfo.emailId && <InfoText label="Email" content={userInfo.emailId}/>}
                    {userInfo.introduction && <InfoText label="Introduction" content={userInfo.introduction}/>}
                    {userInfo.skills && <InfoText label="Skills" content={userInfo.skills.map(i => i.name).toString()}/>}
                    {userInfo.location && <InfoText label="Location" content={userInfo.location}/>}
                    {userInfo.expectedPay && <InfoText label="Expected Pay" content={`$${userInfo.expectedPay}`}/>}
                </Box>
                {/* <Flex minW={'200px'} justifyContent={"center"} direction={'column'} gap="10px"> */}
                    {isFreelancerProfile && (chartInfo && chartInfo.successRate ? <SuccessChart chartInfo={chartInfo}/> : <EmptyAlert text="No projects completed yet."/>)}
                    {!isFreelancerProfile && (chartInfo ? <ProjectChart chartInfo={chartInfo}/> : <EmptyAlert text="No projects created yet."/>)}
                {/* </Flex> */}
            </HStack>
            <Divider/>
            {isFreelancerProfile && <Box w={'100%'} pt='10px'>
                {userInfo.reviews.length > 0 ? <ReviewList reviews={userInfo.reviews} user={currentUser} owner={isUser} handleDelete={handleReviewDelete}/> : <EmptyAlert text="No Reviews yet!"/>}
            </Box>}
            <RequestModal isOpen={isOpen} onClose={() => onClose()} selectedFreelancer={userInfo}/>
            {isUser && <UpdateProfileModal isOpen={isUpdateOpen} onClose={onUpdateClose} details={userInfo} isFreelancer={isFreelancerProfile}/>}
        </Box>
    )
}
