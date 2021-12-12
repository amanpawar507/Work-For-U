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

export const RateModal = ({isOpen, onClose, project}) => {

    const [details,setDetails] = useState({
        title: "",
        rating: 0,
        review: ""
    })
    const [submitting,setSubmitting] = useState(false);

    const {user} = useContext(UserContext);
    const toast = useToast();

    useEffect(() => {
        setDetails({
            title: "",
            rating: 0,
            review: ""
        })
    },[isOpen])

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
            const {data} = await client.post(`http://localhost:5000/reviews/${project.assignedTo}`,{
                ...details,
                reviewer: user._id
            });
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
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rate the freelancer for {project && project.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
                <Rating rating={details.rating} name='rating' onChange={handleChange}/>
                <br/>
                <FormControl isRequired>
                    <FormLabel htmlFor="title">Title</FormLabel>
                    <Input 
                        id="title" 
                        value={details.title} 
                        name="title" 
                        onChange={handleChange} 
                        placeholder="Title" 
                    />
                    <FormLabel htmlFor="review">Review</FormLabel>
                    <Input 
                        id="review" 
                        value={details.review} 
                        name="review" 
                        onChange={handleChange} 
                        placeholder="Review" 
                    />
                </FormControl>
                <HStack w={'100%'} mt='10px' justifyContent={'flex-end'}>
                    <Button variant={'outline'} isLoading={submitting} type="submit" colorScheme='teal'>
                        Submit
                    </Button>
                </HStack> 
            </form>
          </ModalBody>
        </ModalContent>
    </Modal>

        
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