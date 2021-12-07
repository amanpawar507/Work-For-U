import React, { useContext } from "react";
import { Box, Container, Spacer } from "@chakra-ui/react";
import { Header } from "./header";
import { UserContext } from "../../contexts/userContext";
// import { Chart, ArcElement } from 'chart.js';
// Chart.register(ArcElement);


export const Layout = ({children}) => {

    const {user, isFreelancer} = useContext(UserContext);

    return(
        <Container maxW={'container.lg'} background={'rgb(245, 245, 245)'} display={'flex'} flexDirection={'column'}>
            {user && <Header isFreelancer={isFreelancer} userInfo={user}/>}
            <Box w={'100%'} mt={'40px'}>
                {children}
            </Box>
        </Container>
    )
}