import { Avatar } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"

export const CustomAvatar = ({size, name, id, isFreelancer}) => {

    const router = useRouter();

    return(
        <Avatar size={size} name={name} cursor='pointer' onClick={() => router.push(`/${isFreelancer ? "freelancer" : "employer"}/${id}`)}/>
    )
}