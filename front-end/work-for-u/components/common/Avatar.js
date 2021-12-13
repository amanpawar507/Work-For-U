import {Center, Text } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import { getRandomColor } from "../../utils/helper";

export const CustomAvatar = ({size, name, id, isFreelancer}) => {

    const router = useRouter();

    const getSize = size => {
        switch (size) {
            case "xl":
                return "98px"
                break;
            case "md":
                return "48px"
                break;
        
            default:
                return "68px"
                break;
        }
    }

    const getFontSize = size => {
        switch (size) {
            case "xl":
                return "6rem"
                break;
            case "md":
                return "3rem"
        
            default:
                return "4rem"
                break;
        }
    }

    const getInitials = name => {
        const initialsArray = []
        name.split(" ").map((i,idx) => (idx === 0 || idx === name.split(" ").length - 1)  ? initialsArray.push(i.split("")[0].toUpperCase()) : i);
        return `${initialsArray.join("")}`
    }


    return(
        <Center 
            w={getSize(size)}
            h={getSize(size)}
            bg={getRandomColor()}
            borderRadius="full"
            onClick={() => id && router.push(`/${isFreelancer ? "freelancer":"employer"}/${id}`)}
        >
            <Text  fontSize={`calc(${getFontSize(size)} / 2.5)`}>{getInitials(name)}</Text>
        </Center>
    )
}