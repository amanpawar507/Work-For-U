import { Container } from "@chakra-ui/react";
import { Register } from "../../components/register";

const EmployerRegister = () => {
    return (
        <Container maxW={'container.lg'} display={'flex'} flexDirection={'column'}>
            <Register/>
        </Container>
    )
}

export default EmployerRegister