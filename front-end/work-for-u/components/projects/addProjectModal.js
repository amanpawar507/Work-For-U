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
    Progress,
    useToast
  } from "@chakra-ui/react"
  import { Checkbox, CheckboxGroup } from "@chakra-ui/react"
import client from "../../utils/client";

  export const AddProjectModal = ({isOpen,onClose,onSubmit,submitting,isEdit,selectedProject}) => {

    const [projectDetails, setProjectDetails] = useState({
        name:"",
        description:"",
        tenureMonths:"",
        skillsRequired:[],
        hourlyPay:0,
        hrsPerDay: 0,
        daysPerWeek: 0
    });
    const [skillList, setSkillList] = useState([]);
    const [errorList, setErrorList] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

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
        let {_id,name,description,tenureMonths,hourlyPay,skillsRequired,hrsPerDay,daysPerWeek} = selectedProject;
        let current = {
            _id,
            name,
            description,
            tenureMonths,
            hourlyPay,
            skillsRequired: skillsRequired.map(i => {return i._id.toString()}),
            hrsPerDay,
            daysPerWeek
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
            if(!projectDetails[k]) {
                errors.push(k);
                throw "missing fields"
            } 
           debugger;
            switch (k) {
                case "hourlyPay":
                    if(projectDetails[k] === 0) {
                        errors.push(k);
                        throw "Hourly pay should be greater than 0"
                    }
                    break;
                case "hrsPerDay":
                    if(projectDetails[k] === 0 || projectDetails[k] > 8) {
                        errors.push(k);
                        throw "Hours per day should be greater than 0 and less than 9"
                    }
                    break;
                case "daysPerWeek":
                    if(projectDetails[k] === 0 || projectDetails[k] > 6) {
                        errors.push(k);
                        throw "Days per week should be greater than 0 and less than 7"
                    }
                    break;
                case "skillsRequired":
                    if(projectDetails[k].length === 0) {
                        errors.push(k);
                        throw "Select atleast one skill"
                    }
                    break;
                case "tenureMonths":
                    if(projectDetails[k] === 0) {
                        errors.push(k);
                        throw "Tenure months should be greater than 0"
                    }
                    break;
                default:
                    if(projectDetails[k].trim().length === 0) {
                        errors.push(k);
                        throw "Empty spaces"
                    }
                    break;
            } 
        });
        console.log(errors);
        setErrorList(errors);
    }

    const handleSubmit = e => {
        e.preventDefault();
        try {
            validation();
            console.log(projectDetails);
            if(errorList.length === 0)  onSubmit(projectDetails);
        } catch (error) {
            toast({
                title: error,
                status: "warning",
                duration: 2000
            })
        }
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
                    <Textarea  id="description" value={projectDetails.description} onChange={handleChange} placeholder="Describe your project" name="description" isInvalid={errorList.includes('description')}/>
                    <FormLabel htmlFor="tenureMonths">Tenure</FormLabel>
                    <Input  id="tenureMonths" value={projectDetails.tenureMonths} onChange={handleChange} type="number" placeholder="Tenure in months" name="tenureMonths" isInvalid={errorList.includes('tenureMonths')}/>
                    <FormLabel htmlFor="skillsRequired">Skillset</FormLabel>
                    <CheckboxGroup id="skillsRequired" value={projectDetails.skillsRequired} onChange={handleCheck} name="skillsRequired" colorScheme="green">
                        <HStack flexWrap={'wrap'}>
                            {skillList.map(i => <Checkbox value={i._id} key={i._id} isInvalid={errorList.includes('skillsRequired')}>{i.name}</Checkbox>)}
                        </HStack>
                    </CheckboxGroup>
                    <FormLabel htmlFor="hourlyPay">Pay /hour</FormLabel>
                    <Input id="hourlyPay" value={projectDetails.hourlyPay} onChange={handleChange} type="number" placeholder="Pay /hour in $" name="hourlyPay" isInvalid={errorList.includes('hourlyPay')}/>
                    <FormLabel htmlFor="hrsPerDay">Hours /day</FormLabel>
                    <Input id="hrsPerDay" value={projectDetails.hrsPerDay} onChange={handleChange} type="number" placeholder="maximum 8 hours" name="hrsPerDay" isInvalid={errorList.includes('hrsPerDay')}/>
                    <FormLabel htmlFor="daysPerWeek">Days /week</FormLabel>
                    <Input id="daysPerWeek" value={projectDetails.daysPerWeek} onChange={handleChange} type="number" placeholder="maximum 6 days" name="daysPerWeek" isInvalid={errorList.includes('daysPerWeek')}/>
                    <Button
                        mt={4}
                        ml="80%"
                        colorScheme="teal"
                        type="submit"
                        isLoading={submitting}
                        variant={'outline'}
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