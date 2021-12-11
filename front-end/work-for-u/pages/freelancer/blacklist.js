import { Heading } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import { useContext, useEffect } from "react"
import { Layout } from "../../components"
import { Blacklist } from "../../components/blacklist"
import { UserContext } from "../../components/contexts/userContext"

const BlacklistPage = () => {

    const {user, isFreelancer} = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if(isFreelancer !== undefined && isFreelancer !== null) {
            if(!isFreelancer) router.push("/employer");
        }
    },[isFreelancer])

    return(
        <Layout>
            <Heading>Blacklist</Heading>
            <br/>
            {user && <Blacklist/>}
        </Layout>
    )
}

export default BlacklistPage;