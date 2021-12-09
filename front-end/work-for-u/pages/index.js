import { Box, Button, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router"
import { useContext, useEffect } from "react"
import { UserContext } from "../components/contexts/userContext";
import { Layout } from "../components/core"


export default function Home() {

  const router = useRouter();

  const {user ,handleTypeSelect} = useContext(UserContext);

  // useEffect(() => {
  //   router.push('/employer');
  // },[])

  return (
    <Layout>
      <Box w={'100%'} h={'90vh'} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
        {/* <Heading fontSize={'5xl'} textAlign={'center'} as="h1">Work For U</Heading> */}
       <Flex justifyContent={'center'} mb='10px'>
          <img src="/WorkForU.png" width='300' alt="logo"/>
       </Flex>
        <Heading fontStyle={'italic'} fontSize={'2xl'} textAlign={'center'} as="h2">Choose who you work for</Heading>
        <br/>
        <br/>
        <Text textAlign={'center'} fontSize='2xl'>I am a...</Text>
        <HStack justifyContent={'center'}>
          <Button variant={'solid'} color={'#eeeee'} bg={'brand.300'} onClick={()=>handleTypeSelect(1)}>Employer</Button>
          <Button variant={'solid'} color={'#eeeee'}  onClick={()=>handleTypeSelect(2)}>Freelancer</Button>
        </HStack>
      </Box>
    </Layout>
  )
}
