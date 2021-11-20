import React from "react";
import { Container } from "@chakra-ui/react";
import { Header } from "./header";


export const Layout = ({children}) => {
    return(
        <Container maxW={'container.lg'} background={'brand.900'} display={'flex'} flexDirection={'column'}>
            <Header/>
            {children}
        </Container>
    )
}