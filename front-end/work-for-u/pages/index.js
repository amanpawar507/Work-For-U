import { Box, Button, HStack, Text } from "@chakra-ui/react";
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
        <Text textAlign={'center'} fontSize='2xl'>I am a...</Text>
        <HStack justifyContent={'center'}>
          <Button variant={'solid'} color={'brand.500'} bg={'brand.300'} onClick={()=>handleTypeSelect(1)}>Employer</Button>
          <Button variant={'solid'} color={'brand.300'} onClick={()=>handleTypeSelect(2)}>Freelancer</Button>
        </HStack>
      </Box>
    </Layout>
  )
}
