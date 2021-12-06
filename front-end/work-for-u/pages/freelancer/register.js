import { Container } from "@chakra-ui/react"
import { Register } from "../../components/register"

const FreelancerRegister = () => {
    return(
        <Container maxW={'container.lg'}  display={'flex'} flexDirection={'column'}>
            <Register isFreelancer/>
        </Container>
    )
}

export default FreelancerRegister