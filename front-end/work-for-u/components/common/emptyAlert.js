import { Alert } from "@chakra-ui/react"

export const EmptyAlert = ({text}) => {
    return(
        <Alert variant={'left-accent'} status={"info"}>{text}</Alert>
    )
}