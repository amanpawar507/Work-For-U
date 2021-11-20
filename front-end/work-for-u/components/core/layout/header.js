import { Button, HStack, Input, InputGroup, InputRightElement } from "@chakra-ui/react"

export const Header = () => {
    return(
        <HStack w={'100%'} p ={'10px 0'} justifyContent={'space-between'}>
            <HStack>
                <Input placeholder="Search" size="md" color="white" /> 
                <Button>Search</Button>
            </HStack>
            <HStack>
                <Button color='brand.300' variant='ghost'>Dashboard</Button>
                <Button color='brand.300' variant='ghost'>Projects</Button>
                <Button color='brand.300' variant='ghost'>Profile</Button>
            </HStack>
        </HStack>
    )
}