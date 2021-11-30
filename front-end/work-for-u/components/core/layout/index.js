import React, { useContext } from "react";
import { Box, Container, Spacer } from "@chakra-ui/react";
import { Header } from "./header";
import { UserContext } from "../../contexts/userContext";


export const Layout = ({children}) => {

    const {user} = useContext(UserContext);

    return(
        <Container maxW={'container.lg'} background={'brand.900'} display={'flex'} flexDirection={'column'}>
            {user && <Header/>}
            <Box w={'100%'} mt={'40px'}>
                {children}
            </Box>
        </Container>
    )
}