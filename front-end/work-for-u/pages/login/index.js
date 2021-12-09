import { useRouter } from "next/dist/client/router"
import { useContext, useEffect } from "react"
import { Layout } from "../../components"
import { UserContext } from "../../components/contexts/userContext"
import { Login } from "../../components/login"

const LoginPage = () => {

    const {user,isFreelancer} = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if(user) router.push(`/${isFreelancer ? "freelancer" : "employer"}/`);
    },[user,isFreelancer])

    return (
        <Layout>
            <Login/>
        </Layout>
    )
}

export default LoginPage