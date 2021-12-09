import { useContext, useEffect, useState } from "react";
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
import { InputComp } from "../common/Input";
import { UserContext } from "../contexts/userContext";

  export const UpdateProfileModal = ({isOpen,onClose,onSubmit,isFreelancer,details}) => {

    const [userDetails, setUserDetails] = useState({
        _id:null,
        fullName:"",
        companyName:"",
        introduction:"",
        skills:[],
        location:null,
        expectedPay:0
    });
    const [submitting, setSubmitting] = useState(false);
    const [skillList, setSkillList] = useState([]);
    const [loading, setLoading] = useState(false);

    const {setUser} = useContext(UserContext);

    useEffect(() => {
        try {
            const getAllSkills = async () => {
                const {data} = await client.get("http://localhost:5000/skills/");
                setSkillList(data);
                setLoading(false);
            } 
            if(isOpen && isFreelancer) {
                setLoading(true);
                getAllSkills();
            }
        } catch (error) {
            console.log(error);
        }
    },[isOpen,isFreelancer]);

    const toast = useToast();


    useEffect(() => {
        if(!details) return;
        let current;
        if(isFreelancer) {
            let {_id,fullName, introduction, skills, location, expectedPay} = details;
            current = {
                _id,
                fullName,
                introduction,
                skills:  skills.map(i => {return i._id.toString()}),
                location,
                expectedPay
            }
          
        }else{
            let {_id,fullName, companyName} = details;
            current = {
                _id,
                fullName,
                companyName
            }
        }
        setUserDetails(current);
    },[isFreelancer, details])

    const handleChange = e => {
        const {name,value} = e.target;
        setUserDetails(prevValue => {
            return{
                ...prevValue,
                [name]:value
            }
        });
    }

    const handleCheck = value => {
        console.log(value);
        setUserDetails(prevValue => {
            return {
                ...prevValue,
                skills: value
            }
        });
    }

    const validation = obj => {
        if(!obj) return;
        console.log(obj);
        for(let key in obj) {
            console.log(key);
            if(key !== "id") {
                if(key === "skills") {
                    if(userDetails[key].length === 0) throw 'Select a skill'
                 }else if(key === "expectedPay"){
                    if(userDetails[key] === 0) throw `Missing ${key}!`
                 }
                 else{
                     if(userDetails[key].trim().length === 0) throw `Missing ${key}!`
                 }
            }
        }
    }

    const handleSubmit = async e => {
        try {
            e.preventDefault();
            const {_id, fullName,companyName,introduction,skills,location,expectedPay} = userDetails;
            let obj = {};
            if(isFreelancer) {
               obj = {id:_id, fullName, introduction,skills,location,expectedPay};  
            }else{
                obj = {id:_id, fullName, companyName};
            }
            validation(obj); 
            setSubmitting(true);
            const {data} = await client.patch(`http://localhost:5000/${isFreelancer?"freelancer":"employer"}/edit`,obj);
            setUser(data)
            toast({
                title: "Profile updated successfully!",
                status: "success",
                duration: 2000
            });
            setSubmitting(false);
            onClose();
        } catch (error) {
            console.log(error);
            toast({
                title: error.response ? error.response.data.error : error,
                status: error.response ? "error" : "warning",
                duration: 2000
            });
            setSubmitting(false);
        }
        // if(errorList.length === 0)  onSubmit(projectDetails);
    }



    return(
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          {loading && <Box p={"50px 0"}>
                    <Progress size="xs" isIndeterminate />
                </Box>}
            {!loading && <form onSubmit={handleSubmit}>
                {details.fullName && <InputComp name="fullName" label="Full Name" onChange={handleChange} value={userDetails.fullName} required/>}
                {details.companyName && <InputComp name="companyName" label="Company Name" onChange={handleChange} value={userDetails.companyName} required/>}
                {details.introduction && <InputComp name="introduction" label="Introduction" onChange={handleChange} value={userDetails.introduction} required/>}
                {details.skills && <FormControl isRequired>
                    <FormLabel htmlFor="skillsRequired">Skillset</FormLabel>
                    <CheckboxGroup id="skillsRequired" value={userDetails.skills} onChange={handleCheck} name="skills" colorScheme="green">
                        <HStack flexWrap={'wrap'}>
                            {skillList.map(i => <Checkbox value={i._id} key={i._id}>{i.name}</Checkbox>)}
                        </HStack>
                    </CheckboxGroup> 
                </FormControl>         }       
                {details.location && <InputComp name="location" label="Location" onChange={handleChange} value={userDetails.location} required/>}
                {details.expectedPay && <InputComp name="expectedPay" label="Expected Pay" onChange={handleChange} type={'number'} value={userDetails.expectedPay} required/>}
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
            </form>}
          </ModalBody>
        </ModalContent>
    </Modal>
    )
  }