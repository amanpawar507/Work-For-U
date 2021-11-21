import { VStack, Image, Text } from "@chakra-ui/react"

 export const FreelancerCard = ({name,rating, skill}) => {
     return (
         <VStack w="xs" background={'brand.500'} textAlign={'left'} borderRadius={'5px'} overflow={'hidden'}>
             <Image
                minW={'100%'}
                boxSize={'2xs'}
                objectFit={'cover'}
                src={"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"}
             />
             <VStack w={'100%'} padding={'10px'}>
                <Text fontSize={'lg'} w={'100%'}>
                    {name}
                </Text>
                <Text fontSize={'lg'} w={'100%'}>
                    {skill}
                </Text>
                <Text fontSize={'lg'} w={'100%'}>
                    {rating}
                </Text>
             </VStack>
         </VStack>
     )
 }