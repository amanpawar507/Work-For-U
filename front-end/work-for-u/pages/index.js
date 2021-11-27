import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"
import { Layout } from "../components/core"


export default function Home() {

  const router = useRouter();

  useEffect(() => {
    router.push('/employer');
  },[])

  return (
    <Layout>
      please wait...
    </Layout>
  )
}
