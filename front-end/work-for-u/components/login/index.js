import { Button } from "@chakra-ui/button";
import { Flex, VStack } from "@chakra-ui/layout"
import {InputComp} from "../common/Input";

export const Login = () => {
    return(
        <Flex justifyContent={'center'}>
            <form>
            <VStack mt="5%"  padding={'20px'} background={'white'} borderRadius={'10px'} boxShadow={'md'}>
                    <InputComp name="emailId" label="Username"/>
                    <InputComp name="password" label="Password"/>
            </VStack>
                    
                   
                    <Button colorScheme={'teal'} mt='10px' w="100%" type="submit" >
                        Submit
                    </Button>
                    <Button colorScheme={'teal'} mt='10px' w="100%" >
                        Not something?
                    </Button>
                </form>
            
        </Flex>
    )
}