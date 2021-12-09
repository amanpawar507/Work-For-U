import { Heading } from "@chakra-ui/react"
import { useContext, useEffect } from "react"
import { Layout } from "../../components"
import { Blacklist } from "../../components/blacklist"
import { UserContext } from "../../components/contexts/userContext"

const BlacklistPage = () => {

    const {user} = useContext(UserContext);

    useEffect(() => {
        console.log("in blacklist page: ", user);
    },[user])

    return(
        <Layout>
            <Heading>Blacklist</Heading>
            <br/>
            {user && <Blacklist/>}
        </Layout>
    )
}

export default BlacklistPage;