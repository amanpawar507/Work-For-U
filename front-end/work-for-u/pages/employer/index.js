import { useRouter } from "next/dist/client/router";
import { useContext, useEffect } from "react";
import { Dashboard, Layout } from "../../components"
import { UserContext } from "../../components/contexts/userContext";

const EmployerPage = () => {
    const {isFreelancer} = useContext(UserContext);

    const router = useRouter();

    useEffect(() => {
        if(isFreelancer !== undefined && isFreelancer !== null) {
            debugger;
            if(isFreelancer) router.push("/freelancer");
        }
    },[isFreelancer])

    return(
        <Layout>
            <Dashboard/>
        </Layout>
    )
}

export default EmployerPage;