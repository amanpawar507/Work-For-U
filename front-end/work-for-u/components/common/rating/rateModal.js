import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    VStack,
    Text,
    Progress,
    Box,
    SimpleGrid, Icon, Button, FormControl, Input, FormLabel, HStack, useToast
  } from "@chakra-ui/react"
  import { MdGrade } from 'react-icons/md'
import { useContext, useEffect, useState } from "react"
import client from "../../../utils/client";
import { UserContext } from "../../contexts/userContext";

export const RateModal = ({isOpen, onClose, freelancer, updateFreelancer}) => {

    const [details,setDetails] = useState({
        title: "",
        rating: 0,
        review: ""
    })
    const [submitting,setSubmitting] = useState(false);

    const {user} = useContext(UserContext);
    const toast = useToast();

    const handleChange = e => {
        const {name,value} = e.target;
        setDetails(prevValue => {
            return{
                ...prevValue,
                [name]:value
            }
        });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        console.log(details);
        try {
            const {data} = await client.post(`http://localhost:5000/reviews/${freelancer._id}`,{
                ...details,
                reviewer: user._id
            });
            updateFreelancer(data);
            setSubmitting(false);
            onClose();
            toast({
                title: "Freelancer rated successfully",
                status: "success",
                duration: 2000
            })
        } catch (error) {
            console.log(error);
            toast({
                title: error.response ? error.response.data.error.toString() : error,
                status: "error",
                duration: 2000
            })
            setSubmitting(false);
        }

    }

    return(
        <>
        </>
    )
}

export const Rating = ({ onChange, rating, name, disabled }) => {
    const [tempRating, setTempRating] = useState(0)

    return (
        <SimpleGrid
            templateColumns="repeat(5, 1.8rem)"
            spacingX="2px"
            ChildWidth="1px"
            onMouseOut={() => setTempRating(0)}
        >
            {[1, 2, 3, 4, 5].map(star => (
                <Icon
                    key={star}
                    as={MdGrade}
                    fontSize="1.5rem"
                    color={
                        tempRating >= star || rating >= star ? 'yellow.400' : 'gray.100'
                    }
                    cursor={!disabled ? 'pointer' : ''}
                    onMouseOver={() => !disabled && setTempRating(star)}
                    onClick={() => !disabled && onChange({target:{ value: star, name: name }})}
                />
            ))}
        </SimpleGrid>
    )
}