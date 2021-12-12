import { useRouter } from "next/dist/client/router";
import { useContext, useEffect } from "react";
import { Layout } from "../../components";
import { UserContext } from "../../components/contexts/userContext";

const { Projects } = require("../../components/projects")

const FreelancerProjectsPage = () => {

    const {isFreelancer} = useContext(UserContext);

    const router = useRouter();

    useEffect(() => {
        if(isFreelancer !== undefined && isFreelancer !== null) {
            if(!isFreelancer) router.push("/employer");
        }
    },[isFreelancer])

    return(
        <Layout>
            <Projects/>
        </Layout>
    )
}

export default FreelancerProjectsPage;
