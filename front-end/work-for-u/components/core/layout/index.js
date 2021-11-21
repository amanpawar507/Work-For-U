import React from "react";
import { Box, Container, Spacer } from "@chakra-ui/react";
import { Header } from "./header";


export const Layout = ({children}) => {
    return(
        <Container maxW={'container.lg'} background={'brand.900'} display={'flex'} flexDirection={'column'}>
            <Header/>
            <Box w={'100%'} mt={'40px'}>
                {children}
            </Box>
        </Container>
    )
}