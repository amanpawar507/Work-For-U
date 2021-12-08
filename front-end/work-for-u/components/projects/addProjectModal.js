import { useEffect, useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Textarea,
    HStack,
    FormControl,
    FormLabel,
    Box,
    Progress
  } from "@chakra-ui/react"
  import { Checkbox, CheckboxGroup } from "@chakra-ui/react"
import client from "../../utils/client";

  export const AddProjectModal = ({isOpen,onClose,onSubmit,submitting,isEdit,selectedProject}) => {

    const [projectDetails, setProjectDetails] = useState({
        name:null,
        description:null,
        tenureMonths:null,
        skillsRequired:[],
        hourlyPay:null
    });
    const [skillList, setSkillList] = useState([]);
    const [errorList, setErrorList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            const getAllSkills = async () => {
                const {data} = await client.get("http://localhost:5000/skills/");
                setSkillList(data);
                setLoading(false);
            } 
            if(isOpen) {
                setLoading(true);
                getAllSkills();
            }
            // else{
                // setProjectDetails({
                //     name:null,
                //     description:null,
                //     tenureMonths:null,
                //     skillsRequired:[],
                //     hourlyPay:null
                // })
            // }
        } catch (error) {
            console.log(error);
        }
    },[isOpen]);


    useEffect(() => {
        if(!isEdit || !selectedProject) {
            setProjectDetails({
                name:null,
                description:null,
                tenureMonths:null,
                skillsRequired:[],
                hourlyPay:null
            })
            return;
        }
        let {_id,name,description,tenureMonths,hourlyPay,skillsRequired} = selectedProject;
        let current = {
            _id,
            name,
            description,
            tenureMonths,
            hourlyPay,
            skillsRequired: skillsRequired.map(i => {return i._id.toString()})
        }
        setProjectDetails(current);
    },[isEdit, selectedProject])

    const handleChange = e => {
        const {name,value} = e.target;
        setProjectDetails(prevValue => {
            return{
                ...prevValue,
                [name]:value
            }
        });
    }

    const handleCheck = value => {
        console.log(value);
        setProjectDetails(prevValue => {
            return {
                ...prevValue,
                skillsRequired: value
            }
        });
    }

    const validation = () => {
        let keys = Object.keys(projectDetails);
        let errors = [];
        keys.forEach(k => {
            if(!projectDetails[k] || projectDetails[k].length === 0) errors.push(k);
        });
        console.log(errors);
        setErrorList(errors);
    }

    const handleSubmit = e => {
        e.preventDefault();
        validation();
        if(errorList.length === 0)  onSubmit(projectDetails);
    }



    return(
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit?'Edit':"Add"} Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          {loading && <Box p={"50px 0"}>
                    <Progress size="xs" isIndeterminate />
                </Box>}
            {!loading && <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input id="name" value={projectDetails.name} name="name" onChange={handleChange} placeholder="name" isInvalid={errorList.includes('name')} />
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <Textarea  id="description" value={projectDetails.description} onChange={handleChange} placeholder="Description" name="description" isInvalid={errorList.includes('description')}/>
                    <FormLabel htmlFor="tenure">Tenure</FormLabel>
                    <Input  id="tenure" value={projectDetails.tenureMonths} onChange={handleChange} type="number" placeholder="Tenure" name="tenureMonths" isInvalid={errorList.includes('tenureMonths')}/>
                    <FormLabel htmlFor="skillsRequired">Skillset</FormLabel>
                    <CheckboxGroup id="skillsRequired" value={projectDetails.skillsRequired} onChange={handleCheck} name="skillsRequired" colorScheme="green">
                        <HStack flexWrap={'wrap'}>
                            {skillList.map(i => <Checkbox value={i._id} key={i._id} isInvalid={errorList.includes('skillsRequired')}>{i.name}</Checkbox>)}
                        </HStack>
                    </CheckboxGroup>
                    <FormLabel htmlFor="hourlyPay">Pay /hour</FormLabel>
                    <Input id="hourlyPay" value={projectDetails.hourlyPay} onChange={handleChange} type="number" placeholder="Pay /hour" name="hourlyPay" isInvalid={errorList.includes('hourlyPay')}/>
                    <Button
                        mt={4}
                        ml="80%"
                        colorScheme="teal"
                        type="submit"
                        isLoading={submitting}
                    >
                        Submit
                    </Button>
                </FormControl>
            </form>}
          </ModalBody>
        </ModalContent>
    </Modal>
    )
  }