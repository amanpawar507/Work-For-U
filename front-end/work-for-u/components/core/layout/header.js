import { Button, HStack, Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"

export const Header = () => {

    const router = useRouter();

    return(
        <HStack w={'100%'} p ={'10px 0'} justifyContent={'space-between'}>
            <HStack>
                <Input placeholder="Search" size="md" color="white" /> 
                <Button>Search</Button>
            </HStack>
            <HStack>
                <Button color='brand.300' variant='ghost' onClick={() => router.push('/employer')}>Dashboard</Button>
                <Button color='brand.300' variant='ghost' onClick={() => router.push('employer/projects')}>Projects</Button>
                <Button color='brand.300' variant='ghost'>Profile</Button>
            </HStack>
        </HStack>
    )
}