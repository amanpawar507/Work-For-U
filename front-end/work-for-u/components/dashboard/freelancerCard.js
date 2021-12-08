import { VStack, Image, Text, HStack,Button, Center, Heading } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import randomcolor from "randomcolor"

 export const FreelancerCard = ({name,rating, location,onRequest,id}) => {
    const router = useRouter();

     return (
         <VStack w="xs" boxShadow={"md"} background={'white'} textAlign={'left'} borderRadius={'5px'} overflow={'hidden'}>
             {/* <Image
                minW={'100%'}
                boxSize={'2xs'}
                objectFit={'cover'}
                src={"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"}
             /> */}
             <Center w={'100%'} minH={'200px'} bg={randomcolor()} color={'white'} cursor={'pointer'} onClick={() => router.push(`/freelancer/${id}`)}>
                 <Heading fontSize={'5xl'} color={'white'}>{name.split(" ").map(i => i.split("")[0].toUpperCase()).join("")}</Heading>
             </Center>
             <VStack w={'100%'} padding={'10px'}>
                <Text fontSize={'lg'} w={'100%'}>
                    {name}
                </Text>
                <Text fontSize={'lg'} w={'100%'}>
                    {location}
                </Text>
                <HStack w={'100%'} justifyContent={'space-between'}>
                    <Text fontSize={'lg'} w={'100%'}>
                        {rating}/5
                    </Text>
                    <Button  background={'brand.500'} onClick={()=>onRequest()}>
                        Request
                    </Button>
                </HStack>
             </VStack>
         </VStack>
     )
 }