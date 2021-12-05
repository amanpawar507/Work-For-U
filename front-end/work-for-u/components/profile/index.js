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
