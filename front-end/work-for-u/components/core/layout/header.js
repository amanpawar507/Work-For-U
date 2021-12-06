import { Button, HStack, Input, InputGroup, InputRightElement, Select } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import { useState } from "react";

export const Header = ({isFreelancer,userInfo}) => {
    const [search,setSearch] = useState(null);
    const [filter, setFilter] = useState(null);
    const router = useRouter();

    // const isFr
    const handleChange = e => {
        setSearch(e.target.value);
    }

    const handleSearch = () => {
        //debugger;
        //if(!search || search.trim().length === 0) return;
        router.push(`/employer/search?q=${search}&&t=${filter}`);
    }

    return(
        <HStack w={'100%'} p ={'10px 0'} justifyContent={'space-between'}>
            <HStack>
                <Input w={'200px'} borderColor={"#BFC0C0"} value={search} onChange={handleChange} placeholder="Search" size="md"  />
                <Select value={filter} borderColor={"#BFC0C0"}  onChange={e => setFilter(e.target.value)} variant={'outline'} placeholder='filter' size={'md'} w={'100px'}>
                    <option value="name">name</option>
                    <option value="skill">skill</option>
                    <option value='location'>location</option>
                </Select> 
                <Button onClick={handleSearch}>Search</Button>
            </HStack>
            <HStack>
                <Button  variant='ghost' onClick={() => router.push(`/${isFreelancer?"freelancer":"employer"}`)}>Dashboard</Button>
                <Button variant='ghost' onClick={() => router.push(`/${isFreelancer?"freelancer":"employer"}/projects`)}>Projects</Button>
                <Button variant='ghost' onClick={() => router.push(`/${isFreelancer?"freelancer":"employer"}/${userInfo._id}`)}>Profile</Button>
                <Button  variant='ghost' onClick={() => router.push(`/logout`)}>Logout</Button>
            </HStack>
        </HStack>
    )
}