import { useRouter } from "next/dist/client/router"
import { useContext, useEffect } from "react"
import { UserContext } from "../../components/contexts/userContext"
import { Layout } from "../../components/core"
import { FreelancerDashboard } from "../../components/freelancerDashboard"

const FreelancerPage = () => {

    const {isFreelancer} = useContext(UserContext);

    const router = useRouter();

    useEffect(() => {
        if(isFreelancer !== undefined && isFreelancer !== null) {
            if(!isFreelancer) router.push("/employer");
        }
    },[isFreelancer])

    return(
        <Layout>
            <FreelancerDashboard/>
        </Layout>
    )
}

export default FreelancerPage;