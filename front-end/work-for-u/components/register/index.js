import { Box, Button, Checkbox, CheckboxGroup, Flex, FormLabel, Heading, HStack, Select, Textarea, useToast } from "@chakra-ui/react"
import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { useContext, useEffect, useState } from "react";
import client from "../../utils/client";
import { emailValidation } from "../../utils/helper";
import { InputComp } from "../common/Input"
import { UserContext } from "../contexts/userContext";


export const Register = ({isFreelancer}) => {

    const [details, setDetails] = useState({
        fullName: "",
        emailId: "",
        companyName: "",
        location: null,
        introduction:"",
        expectedPay:null,
        skills:null
    });

    const [pass, setPass] = useState({
        password: "",
        confirmPassword: ""
    })
    const [submitting, setSubmitting] = useState(false);
    const [allStates, setAllStates] = useState([]);
    const [skillList, setSkillList] = useState([]);
    const [skillSet,setSkillSet] = useState([]);
    const router = useRouter();
    // const {isFreelancer} = useContext(UserContext);
    const toast = useToast();

    const errorAlert = error => {
        toast({
            title: error.response? 
                    error.response.data.error : 
                    error.message ? 
                    error.message : 
                    error,
            status: "error",
            duration: 2000
        });
    }

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
                errorAlert(error);
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

    const handlePassChange = e =>{
        const {value,name} = e.target;
        setPass(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }
        });
    }

    useEffect(() => {
        console.log(details);
        console.log(pass);
    },[details])

    const warn = text => {
        toast({
            title: text,
            status: "warning",
            duration: 2000
        });
    }

    const handleSubmit = async e => {
        try {
            e.preventDefault();
            console.log(details);
            const {fullName,companyName, emailId, location, skills, introduction, expectedPay} = details;
            const {password, confirmPassword} = pass;
            if(fullName.trim().length === 0 || emailId.trim().length === 0 ) {
                warn("Please fill all the fields");
                return;
            }
            if(!emailValidation(emailId)) {
                warn("Please pass a valid emailId");
                return;
            }
            if(password.length < 6) {
                warn("Password should be atleast 6 characters long");
                return;
            }
            if(password !== confirmPassword) {
                warn("password and confirm password should match!");
                return;
            }
            if(isFreelancer) {
                if(!expectedPay || expectedPay < 0) {
                    warn("Please pass a valid expectedPay");
                    return;
                }
                if(location.trim().length === 0 || !location) {
                    warn("Please select a location");
                    return;
                }
                if(!skills || (skills.length && skills.length === 0)) {
                    warn("Please select atleast one skill")
                    return;
                }
            }else{
                if(companyName.trim().length === 0) {
                    warn("Please pass your company name");
                    return;
                }
            }
            setSubmitting(true);
            let request = {...details,...pass};
            console.log(request);
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
            setSubmitting(false);
            console.log(error)
            errorAlert(error);
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
                    {isFreelancer && <Textarea  id="introduction" value={details.introduction} onChange={handleChange} placeholder="Introduction (optional)" name="introduction"/>}
                    {isFreelancer && <FormLabel htmlFor="skillset">Skillset</FormLabel>}
                    {isFreelancer && <CheckboxGroup id="skillset" onChange={handleCheck} name="skills" colorScheme="green">
                        <HStack flexWrap={'wrap'} maxH={'80px'} overflow={'auto'}>
                            {skillList.map(i => <Checkbox value={i._id} key={i._id} >{i.name}</Checkbox>)}
                        </HStack>
                    </CheckboxGroup>}
                    {isFreelancer && <FormLabel htmlFor="location">Location</FormLabel>}
                    {isFreelancer && <Select size={'sm'} name="location" value={details.location} onChange={handleChange}>
                        <option value={null}>Select location</option>
                        {allStates && allStates.map((i,idx) => <option key={idx} value={i.name}>{i.name}</option>)}
                    </Select>}
                    <InputComp name="password" label="Password" type={'password'} value={pass.password} onChange={handlePassChange} helper="atleast 6 characters long" required={true}/>
                    <InputComp name="confirmPassword" label="Confirm Password" type={'password'} value={pass.confirmPassword} helper="atleast 6 characters long" onChange={handlePassChange} required={true}/>
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