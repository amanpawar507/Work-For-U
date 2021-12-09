import { Box, Button, Checkbox, CheckboxGroup, Flex, FormLabel, Heading, HStack, Select, Textarea, useToast } from "@chakra-ui/react"
import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { useContext, useEffect, useState } from "react";
import client from "../../utils/client";
import { InputComp } from "../common/Input"
import { UserContext } from "../contexts/userContext";


export const Register = ({isFreelancer}) => {

    const [details, setDetails] = useState({
        fullName: null,
        emailId: null,
        password: null,
        companyName: null,
        confirmPassword:null,
        location: null,
        introduction:null,
        expectedPay:null,
        skills:null
    });
    const [submitting, setSubmitting] = useState(false);
    const [allStates, setAllStates] = useState([]);
    const [skillList, setSkillList] = useState([]);
    const [skillSet,setSkillSet] = useState([]);
    const router = useRouter();
    // const {isFreelancer} = useContext(UserContext);
    const toast = useToast();

    useEffect(() => {
        const getData = async () => {
            try {
                const {data} = await axios.post("https://countriesnow.space/api/v0.1/countries/states",{country:"United States"});
                console.log(data)
                setAllStates(data.data.states)
                const {data: skills} = await client.get("http://localhost:5000/skills/");
                setSkillList(skills);
            } catch (error) {
                console.log(error);
                toast({
                    title: error.message? error.message : error,
                    status: "error",
                    duration: 2000
                });
            }
        }
        if(isFreelancer) getData();
    },[isFreelancer])

    const handleChange = e =>{
        const {value,name} = e.target;
        setDetails(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }
        });
    }

    const handleSubmit = async e => {
        try {
            e.preventDefault();
            if(details.password !== details.confirmPassword) {
                toast({
                    title: "password and confirm password should match!",
                    status: "warning",
                    duration: 2000
                });
                return;
            }
            setSubmitting(true);
            let request = details;
            delete request.confirmPassword;
            if(isFreelancer) {
                delete request.companyName
                request = {
                    ...request,
                    expectedPay: parseFloat(request.expectedPay)
                }
                const {data} = await client.post("http://localhost:5000/freelancer/",request);
                console.log(data);
                toast({
                    title: "registration successfull",
                    status: "success",
                    duration: 2000
                });
            }else{
                delete request.expectedPay;
                delete request.introduction;
                delete request.location;
                delete request.skills;
                const {data} = await client.post("http://localhost:5000/employer/",request);
                console.log(data);
                
            }
            router.push('/login');
            setSubmitting(false);
        } catch (error) {
            console.log(error)
            toast({
                title: error.message? error.message : error,
                status: "error",
                duration: 2000
            });
        }
    }

    const handleCheck = value => {
        console.log(value);
        setDetails(prevValue => {
            return {
                ...prevValue,
                skills: value
            }
        });
    };

    return(
        <Flex justifyContent={'center'}>
            <Box mt="5%" w={'40%'} padding={'20px'} background={'white'} borderRadius={'10px'} boxShadow={'md'}>
                <Heading mb='10px' as="h1">Join Us</Heading>
                <form onSubmit={handleSubmit}> 
                    <InputComp name="fullName" label="Full Name" value={details.fullName} onChange={handleChange} required={true}/>
                    <InputComp name="emailId" label="Email Id" value={details.emailId} onChange={handleChange} required={true}/>
                    {!isFreelancer && <InputComp name="companyName" label="Company Name" value={details.companyName} onChange={handleChange} required={true}/>}
                    {isFreelancer && <InputComp name="expectedPay" label="Minimum pay expected /hr" value={details.expectedPay} onChange={handleChange} required={true}/>}
                    {isFreelancer &&  <FormLabel htmlFor="introduction">Introduction</FormLabel>}
                    {isFreelancer && <Textarea  id="introduction" value={details.introduction} onChange={handleChange} placeholder="Introduction" name="introduction"/>}
                    {isFreelancer && <FormLabel htmlFor="skillset">Skillset</FormLabel>}
                    {isFreelancer && <CheckboxGroup id="skillset" onChange={handleCheck} name="skills" colorScheme="green">
                        <HStack flexWrap={'wrap'} maxH={'80px'} overflow={'auto'}>
                            {skillList.map(i => <Checkbox value={i._id} key={i._id} >{i.name}</Checkbox>)}
                        </HStack>
                    </CheckboxGroup>}
                    {isFreelancer && <FormLabel htmlFor="location">Location</FormLabel>}
                    {isFreelancer && <Select size={'sm'} name="location" value={details.location} onChange={handleChange}>
                        {allStates && allStates.map((i,idx) => <option key={idx} value={i.name}>{i.name}</option>)}
                    </Select>}
                    <InputComp name="password" label="Password" type={'password'} value={details.password} onChange={handleChange} required={true}/>
                    <InputComp name="confirmPassword" label="Confirm Password" type={'password'} value={details.confirmPassword} onChange={handleChange} required={true}/>
                    <Button variant={'outline'} colorScheme={'teal'} mt='10px' w="100%" type="submit" isLoading={submitting}>
                        Register
                    </Button>
                    <Button variant={'outline'} colorScheme={'teal'} mt='10px' w="100%" isDisabled={submitting} onClick={() => router.push('/login')}>
                        Back to login
                    </Button>
                </form>
            </Box>
        </Flex>
    )
}